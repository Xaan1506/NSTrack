from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET')
ALGORITHM = "HS256"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    skill_level: str  # Beginner, Intermediate, Advanced

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    skill_level: str
    points: int = 10
    selected_track: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class ProfileUpdate(BaseModel):
    points: Optional[int] = None
    selected_track: Optional[str] = None

class RoadmapRequest(BaseModel):
    track: str
    goals: str
    time_availability: str
    current_level: str

class Roadmap(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    track: str
    roadmap_data: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProblemRequest(BaseModel):
    track: str
    difficulty: str
    count: int = 5

class Problem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    track: str
    difficulty: str
    title: str
    description: str
    hints: List[str]
    solution_approach: str

class ProblemComplete(BaseModel):
    problem_id: str
    user_id: str

class LanguageContent(BaseModel):
    language: str
    section: str
    content: str

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Initialize LLM Chat
async def get_llm_chat(session_id: str, system_message: str):
    return LlmChat(
        api_key=os.environ.get('EMERGENT_LLM_KEY'),
        session_id=session_id,
        system_message=system_message
    ).with_model("anthropic", "claude-3-7-sonnet-20250219")

# Routes
@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Set points based on skill level
    points_map = {"Beginner": 10, "Intermediate": 25, "Advanced": 50}
    points = points_map.get(user_data.skill_level, 10)
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        skill_level=user_data.skill_level,
        points=points
    )
    
    user_dict = user.model_dump()
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(access_token=access_token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Convert ISO string to datetime if needed
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    user_obj = User(**{k: v for k, v in user.items() if k != 'password_hash'})
    access_token = create_access_token(data={"sub": user_obj.id})
    
    return TokenResponse(access_token=access_token, user=user_obj)

@api_router.get("/auth/profile", response_model=User)
async def get_profile(current_user: Dict = Depends(get_current_user)):
    if isinstance(current_user['created_at'], str):
        current_user['created_at'] = datetime.fromisoformat(current_user['created_at'])
    return User(**{k: v for k, v in current_user.items() if k != 'password_hash'})

@api_router.put("/auth/profile", response_model=User)
async def update_profile(update_data: ProfileUpdate, current_user: Dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.users.update_one(
            {"id": current_user['id']},
            {"$set": update_dict}
        )
    
    updated_user = await db.users.find_one({"id": current_user['id']}, {"_id": 0})
    if isinstance(updated_user['created_at'], str):
        updated_user['created_at'] = datetime.fromisoformat(updated_user['created_at'])
    
    return User(**{k: v for k, v in updated_user.items() if k != 'password_hash'})

@api_router.post("/roadmap/generate")
async def generate_roadmap(request: RoadmapRequest, current_user: Dict = Depends(get_current_user)):
    session_id = f"roadmap_{current_user['id']}_{request.track}"
    
    system_message = f"""You are an expert learning path advisor for NSTrack, a platform for NST college students.
Create personalized learning roadmaps that are:
- Structured in clear phases (Basics, Core, Advanced, Practice)
- Action-oriented with bullet points
- Include specific topics and milestones
- Practical and project-based

Student Context:
- Track: {request.track}
- Current Level: {request.current_level}
- Goals: {request.goals}
- Time Available: {request.time_availability}

Provide a comprehensive roadmap in this format:

## Phase 1: Foundations
- Topic 1: Description
- Topic 2: Description

## Phase 2: Core Skills
- Topic 1: Description
- Topic 2: Description

## Phase 3: Advanced Concepts
- Topic 1: Description
- Topic 2: Description

## Phase 4: Projects & Practice
- Project 1: Description
- Project 2: Description
"""
    
    chat = await get_llm_chat(session_id, system_message)
    user_message = UserMessage(text=f"Generate a complete roadmap for {request.track}")
    
    response = await chat.send_message(user_message)
    
    # Save roadmap
    roadmap = Roadmap(
        user_id=current_user['id'],
        track=request.track,
        roadmap_data={
            "content": response,
            "goals": request.goals,
            "time_availability": request.time_availability,
            "current_level": request.current_level
        }
    )
    
    roadmap_dict = roadmap.model_dump()
    roadmap_dict['created_at'] = roadmap_dict['created_at'].isoformat()
    
    await db.roadmaps.insert_one(roadmap_dict)
    
    return {"roadmap_id": roadmap.id, "content": response}

@api_router.get("/roadmap/{user_id}")
async def get_user_roadmaps(user_id: str, current_user: Dict = Depends(get_current_user)):
    if current_user['id'] != user_id:
        raise HTTPException(status_code=401, detail="Access denied")
    
    roadmaps = await db.roadmaps.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return roadmaps

@api_router.get("/languages/{lang}")
async def get_language_content(lang: str, section: Optional[str] = None):
    # Static structure with AI-enhanced examples
    language_structure = {
        "python": {
            "introduction": {"title": "Introduction to Python", "topics": ["Purpose", "Where Used", "Advantages"]},
            "setup": {"title": "Setup & First Program", "topics": ["Installation", "Hello World"]},
            "syntax": {"title": "Basic Syntax", "topics": ["Indentation", "Comments", "Variables"]},
            "datatypes": {"title": "Data Types", "topics": ["Numbers", "Strings", "Lists", "Tuples", "Dictionaries"]},
            "operators": {"title": "Operators", "topics": ["Arithmetic", "Comparison", "Logical", "Assignment"]},
            "conditionals": {"title": "Conditionals", "topics": ["if", "elif", "else"]},
            "loops": {"title": "Loops", "topics": ["for loop", "while loop", "break/continue"]},
            "functions": {"title": "Functions", "topics": ["Definition", "Parameters", "Return", "Lambda"]},
            "datastructures": {"title": "Data Structures", "topics": ["Lists", "Tuples", "Sets", "Dictionaries"]},
            "oop": {"title": "Object-Oriented Programming", "topics": ["Classes", "Objects", "Inheritance", "Polymorphism"]},
            "modules": {"title": "Libraries & Modules", "topics": ["Import", "Built-in Modules", "pip"]},
            "advanced": {"title": "Advanced Concepts", "topics": ["Decorators", "Generators", "Exception Handling"]},
            "projects": {"title": "Real-World Projects", "topics": ["Calculator", "To-Do List", "Web Scraper", "API Client", "Data Analyzer"]},
            "practice": {"title": "Practice Questions", "topics": ["Easy", "Medium", "Hard"]}
        },
        "java": {
            "introduction": {"title": "Introduction to Java", "topics": ["Purpose", "Where Used", "Advantages"]},
            "setup": {"title": "Setup & First Program", "topics": ["JDK Installation", "Hello World"]},
            "syntax": {"title": "Basic Syntax", "topics": ["Classes", "Methods", "Variables"]},
            "datatypes": {"title": "Data Types", "topics": ["Primitive Types", "Reference Types", "Arrays"]},
            "operators": {"title": "Operators", "topics": ["Arithmetic", "Comparison", "Logical", "Bitwise"]},
            "conditionals": {"title": "Conditionals", "topics": ["if-else", "switch", "ternary"]},
            "loops": {"title": "Loops", "topics": ["for", "while", "do-while", "enhanced for"]},
            "functions": {"title": "Methods", "topics": ["Declaration", "Parameters", "Return Types", "Overloading"]},
            "datastructures": {"title": "Data Structures", "topics": ["ArrayList", "HashMap", "LinkedList", "Stack", "Queue"]},
            "oop": {"title": "Object-Oriented Programming", "topics": ["Classes", "Objects", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction"]},
            "modules": {"title": "Packages & Libraries", "topics": ["Import", "java.util", "java.io", "java.lang"]},
            "advanced": {"title": "Advanced Concepts", "topics": ["Interfaces", "Abstract Classes", "Exception Handling", "Threads"]},
            "projects": {"title": "Real-World Projects", "topics": ["Banking System", "Library Management", "Chat Application", "E-commerce Backend"]},
            "practice": {"title": "Practice Questions", "topics": ["Easy", "Medium", "Hard"]}
        },
        "cpp": {
            "introduction": {"title": "Introduction to C++", "topics": ["Purpose", "Where Used", "Advantages"]},
            "setup": {"title": "Setup & First Program", "topics": ["Compiler Setup", "Hello World"]},
            "syntax": {"title": "Basic Syntax", "topics": ["Structure", "Namespaces", "Comments"]},
            "datatypes": {"title": "Data Types", "topics": ["int", "float", "char", "bool", "string", "arrays"]},
            "operators": {"title": "Operators", "topics": ["Arithmetic", "Comparison", "Logical", "Bitwise"]},
            "conditionals": {"title": "Conditionals", "topics": ["if-else", "switch"]},
            "loops": {"title": "Loops", "topics": ["for", "while", "do-while"]},
            "functions": {"title": "Functions", "topics": ["Declaration", "Parameters", "Return", "Function Overloading"]},
            "datastructures": {"title": "Data Structures", "topics": ["Arrays", "Vectors", "Maps", "Sets", "Stacks", "Queues"]},
            "oop": {"title": "Object-Oriented Programming", "topics": ["Classes", "Objects", "Inheritance", "Polymorphism", "Encapsulation"]},
            "modules": {"title": "STL & Libraries", "topics": ["iostream", "vector", "algorithm", "string"]},
            "advanced": {"title": "Advanced Concepts", "topics": ["Pointers", "References", "Memory Management", "Templates"]},
            "projects": {"title": "Real-World Projects", "topics": ["Game Engine", "File Compressor", "Network Chat", "Database System"]},
            "practice": {"title": "Practice Questions", "topics": ["Easy", "Medium", "Hard"]}
        },
        "javascript": {
            "introduction": {"title": "Introduction to JavaScript", "topics": ["Purpose", "Where Used", "Advantages"]},
            "setup": {"title": "Setup & First Program", "topics": ["Browser Console", "Node.js", "Hello World"]},
            "syntax": {"title": "Basic Syntax", "topics": ["Statements", "Comments", "Variables"]},
            "datatypes": {"title": "Data Types", "topics": ["String", "Number", "Boolean", "Array", "Object"]},
            "operators": {"title": "Operators", "topics": ["Arithmetic", "Comparison", "Logical", "Ternary"]},
            "conditionals": {"title": "Conditionals", "topics": ["if-else", "switch"]},
            "loops": {"title": "Loops", "topics": ["for", "while", "forEach", "map"]},
            "functions": {"title": "Functions", "topics": ["Declaration", "Arrow Functions", "Callbacks", "Async/Await"]},
            "datastructures": {"title": "Data Structures", "topics": ["Arrays", "Objects", "Maps", "Sets"]},
            "oop": {"title": "Object-Oriented Programming", "topics": ["Classes", "Objects", "Inheritance", "Prototypes"]},
            "modules": {"title": "Modules & Libraries", "topics": ["Import/Export", "npm", "Popular Libraries"]},
            "advanced": {"title": "Advanced Concepts", "topics": ["Closures", "Promises", "Event Loop", "DOM Manipulation"]},
            "projects": {"title": "Real-World Projects", "topics": ["Todo App", "Weather App", "Chat App", "E-commerce Frontend"]},
            "practice": {"title": "Practice Questions", "topics": ["Easy", "Medium", "Hard"]}
        }
    }
    
    if lang.lower() not in language_structure:
        raise HTTPException(status_code=404, detail="Language not found")
    
    return {"language": lang, "structure": language_structure[lang.lower()]}

@api_router.post("/problems/generate")
async def generate_problems(request: ProblemRequest, current_user: Dict = Depends(get_current_user)):
    session_id = f"problems_{request.track}_{request.difficulty}"
    
    system_message = f"""You are a coding problem generator for NSTrack platform.
Generate {request.count} {request.difficulty} level problems for {request.track}.

For each problem, provide:
1. Title (concise, descriptive)
2. Description (clear problem statement)
3. 2-3 Hints (progressive difficulty)
4. Solution Approach (high-level algorithm)

Format each problem as:
---
TITLE: [Problem title]
DESCRIPTION: [Problem description]
HINTS: [hint1] | [hint2] | [hint3]
SOLUTION: [solution approach]
---
"""
    
    chat = await get_llm_chat(session_id, system_message)
    user_message = UserMessage(text=f"Generate {request.count} problems")
    
    response = await chat.send_message(user_message)
    
    # Parse response into problem objects
    problems = []
    problem_blocks = response.split('---')
    
    for block in problem_blocks:
        if 'TITLE:' in block:
            lines = block.strip().split('\n')
            title = ""
            description = ""
            hints = []
            solution = ""
            
            for line in lines:
                if line.startswith('TITLE:'):
                    title = line.replace('TITLE:', '').strip()
                elif line.startswith('DESCRIPTION:'):
                    description = line.replace('DESCRIPTION:', '').strip()
                elif line.startswith('HINTS:'):
                    hints_str = line.replace('HINTS:', '').strip()
                    hints = [h.strip() for h in hints_str.split('|')]
                elif line.startswith('SOLUTION:'):
                    solution = line.replace('SOLUTION:', '').strip()
            
            if title:
                problem = Problem(
                    track=request.track,
                    difficulty=request.difficulty,
                    title=title,
                    description=description,
                    hints=hints if hints else ["Think about the problem step by step"],
                    solution_approach=solution if solution else "Break down the problem into smaller parts"
                )
                problems.append(problem.model_dump())
    
    return {"problems": problems}

@api_router.post("/problems/complete")
async def complete_problem(data: ProblemComplete, current_user: Dict = Depends(get_current_user)):
    if current_user['id'] != data.user_id:
        raise HTTPException(status_code=401, detail="Access denied")
    
    # Record completion
    completion_record = {
        "id": str(uuid.uuid4()),
        "user_id": data.user_id,
        "problem_id": data.problem_id,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.problem_completions.insert_one(completion_record)
    
    return {"message": "Problem marked as complete"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()