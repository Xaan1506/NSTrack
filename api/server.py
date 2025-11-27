import os
import sys
from pathlib import Path

# Ensure backend package is on the path
CURRENT_DIR = Path(__file__).parent
BACKEND_DIR = CURRENT_DIR.parent / "backend"
sys.path.append(str(BACKEND_DIR))

# Import FastAPI app from backend
from server import app  # FastAPI instance defined in backend/server.py

# Optional: Vercel looks for an ASGI app named 'app'
# Nothing else needed here; all routing is defined in backend/server.py

