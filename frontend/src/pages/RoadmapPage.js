import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, Sparkles, CheckCircle, Lightbulb, Target, Clock, Code, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TRACK_CONFIG = {
  'web-dev': {
    label: 'Web Development',
    focusArea: 'Full-Stack Web Development',
    summary: 'Build modern websites and web applications',
    baseTopics: [
      'Master HTML5 & CSS3 fundamentals (semantic tags, layout, accessibility)',
      'Deep dive into modern JavaScript (ES6+, async/await, modules)',
      'Create responsive layouts with Flexbox and CSS Grid',
      'Build interactive UIs with a frontend framework (React, Vue, or Angular)',
      'Learn backend fundamentals with Node.js and Express'
    ],
    levelTopics: {
      beginner: [
        'Follow guided tutorials to build landing pages and dashboards',
        'Learn Git + GitHub workflows for solo projects',
        'Practice DOM manipulation and basic API calls'
      ],
      intermediate: [
        'Implement authentication, authorization, and protected routes',
        'Integrate databases (MongoDB/PostgreSQL) with RESTful APIs',
        'Optimize performance with code-splitting and caching strategies'
      ],
      advanced: [
        'Design scalable architectures (microservices, event-driven systems)',
        'Implement CI/CD pipelines and automated testing',
        'Master advanced accessibility and web performance budgeting'
      ]
    }
  },
  'app-dev': {
    label: 'App Development',
    focusArea: 'Mobile App Development',
    summary: 'Create mobile applications for iOS and Android',
    baseTopics: [
      'Choose a framework (React Native, Flutter, or Swift/Kotlin)',
      'Understand mobile design patterns (MVC, MVVM, Clean Architecture)',
      'Work with device APIs (camera, storage, sensors)',
      'Implement offline storage and synchronization strategies',
      'Learn app deployment workflows for App Store and Play Store'
    ],
    levelTopics: {
      beginner: [
        'Build a simple cross-platform app with navigation and forms',
        'Practice styling with platform-specific components',
        'Learn how to debug on emulators and physical devices'
      ],
      intermediate: [
        'Integrate native modules and third-party SDKs',
        'Implement push notifications and deep linking',
        'Optimize performance and memory usage'
      ],
      advanced: [
        'Adopt clean architecture with dependency injection',
        'Set up automated builds with Fastlane/GitHub Actions',
        'Implement advanced animations and accessibility features'
      ]
    }
  },
  'ai-ml': {
    label: 'AI / Machine Learning',
    focusArea: 'AI & Machine Learning Engineering',
    summary: 'Master artificial intelligence and ML algorithms',
    baseTopics: [
      'Strengthen Python for data science (NumPy, Pandas, Matplotlib)',
      'Review math foundations: linear algebra, probability, calculus basics',
      'Study core ML algorithms (regression, classification, clustering)',
      'Learn model evaluation, bias/variance, and feature engineering',
      'Build end-to-end ML projects with Scikit-learn and TensorFlow/PyTorch'
    ],
    levelTopics: {
      beginner: [
        'Complete guided notebooks on Kaggle/Google Colab',
        'Replicate classic datasets (Iris, Titanic, MNIST)',
        'Learn to clean and visualize datasets effectively'
      ],
      intermediate: [
        'Implement neural networks, CNNs, and transfer learning',
        'Deploy models using FastAPI/Flask or serverless platforms',
        'Experiment with hyperparameter tuning and ML pipelines'
      ],
      advanced: [
        'Design production-ready ML systems with monitoring',
        'Work on NLP/LLM projects and vector databases',
        'Optimize models with quantization and hardware acceleration'
      ]
    }
  },
  'dsa-cp': {
    label: 'DSA & Competitive Programming',
    focusArea: 'Algorithms & Competitive Programming',
    summary: 'Excel in data structures and problem-solving',
    baseTopics: [
      'Master time complexity analysis and math tricks',
      'Strengthen core data structures (arrays, stacks, queues, linked lists)',
      'Learn recursion and divide & conquer strategies',
      'Practice sorting, searching, and greedy paradigms',
      'Build strong foundations in dynamic programming and graph theory'
    ],
    levelTopics: {
      beginner: [
        'Solve array/string problems daily (Two Sum, Valid Parentheses)',
        'Implement custom data structures from scratch',
        'Participate in easy-rated contests to build stamina'
      ],
      intermediate: [
        'Master DP patterns (knapsack, LIS, matrix paths)',
        'Learn advanced graphs (DSU, shortest paths, MST)',
        'Compete weekly on Codeforces/LeetCode contest mode'
      ],
      advanced: [
        'Study bitmask DP, segment trees, Fenwick trees',
        'Optimize solutions with heuristics and pruning',
        'Focus on contest strategy, debugging speed, and editor setups'
      ]
    }
  }
};

const RoadmapPage = () => {
  // Define generateAIPoweredRoadmap as a static method to ensure it's accessible
  const navigate = useNavigate();
  const trackOptions = Object.keys(TRACK_CONFIG).map(key => ({ value: key, label: TRACK_CONFIG[key].label }));
  const [step, setStep] = useState('questions');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goals: '',
    time_availability: '5-10 hours',
    current_level: 'beginner'
  });
  const [roadmap, setRoadmap] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  // problemFilters removed: practice problems moved to separate Problems page
  const [track, setTrack] = useState(() => localStorage.getItem('selectedTrack') || 'web-dev');
  const getPracticeProblems = (focusArea, level = 'beginner', filters = { category: 'all', platform: 'all', technology: 'all', searchQuery: '' }, trackKey = 'web-dev') => {
    const allProblems = [
      {
        id: 2,
        title: 'Responsive Layout',
        description: 'Create a responsive layout using CSS Grid and Flexbox',
        difficulty: 'Easy',
        category: 'layout',
        platform: 'Frontend Mentor',
        technology: 'CSS',
        link: 'https://www.frontendmentor.io/challenges',
        video: 'https://youtube.com/embed/0xMQfnTU6oo',
        resources: [
          'CSS Grid Guide: https://css-tricks.com/snippets/css/complete-guide-grid/',
          'Flexbox Froggy: https://flexboxfroggy.com/'
        ],
        tracks: ['web-dev']
      },
      {
        id: 3,
        title: 'REST API with Node.js',
        description: 'Build a RESTful API with Node.js and Express',
        difficulty: 'Medium',
        category: 'backend',
        platform: 'FreeCodeCamp',
        technology: 'Node.js',
        link: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
        video: 'https://youtube.com/embed/pKd0Rpw7O48',
        resources: [
          'Express.js Documentation: https://expressjs.com/',
          'REST API Best Practices: https://www.freecodecamp.org/news/rest-api-best-practices/'
        ],
        tracks: ['web-dev']
      },
      {
        id: 4,
        title: 'Two Sum',
        description: 'Find two numbers that add up to a target sum',
        difficulty: 'Easy',
        category: 'algorithms',
        platform: 'LeetCode',
        technology: 'JavaScript',
        link: 'https://leetcode.com/problems/two-sum/',
        video: 'https://youtube.com/embed/KLlXCFG5TnA',
        resources: [
          'Big O Notation: https://www.freecodecamp.org/news/big-o-notation-explained/',
          'JavaScript Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'
        ],
        tracks: ['web-dev', 'dsa-cp']
      },
      {
        id: 5,
        title: 'Design Twitter',
        description: 'Design a simplified version of Twitter',
        difficulty: 'Hard',
        category: 'system design',
        platform: 'Grokking',
        technology: 'System Design',
        link: 'https://www.educative.io/courses/grokking-the-system-design-interview',
        video: 'https://youtube.com/embed/xZ7F_v1Wufk',
        resources: [
          'System Design Primer: https://github.com/donnemartin/system-design-primer',
          'Scalability Basics: https://www.lecloud.net/tagged/scal/'
        ],
        tracks: ['web-dev']
      },
      {
        id: 6,
        title: 'Debug Memory Leak',
        description: 'Identify and fix a memory leak in a Node.js application',
        difficulty: 'Hard',
        category: 'debugging',
        platform: 'Node.js Docs',
        technology: 'Node.js',
        link: 'https://nodejs.org/en/docs/guides/diagnostics/memory/using-memory-cpupprof/',
        video: 'https://youtube.com/embed/0oAxLayoOWQ',
        resources: [
          'Node.js Debugging Guide: https://nodejs.org/en/docs/guides/debugging-getting-started/',
          'Chrome DevTools: https://developers.google.com/web/tools/chrome-devtools/'
        ],
        tracks: ['web-dev']
      },
      {
        id: 7,
        title: 'React Native Habit Tracker',
        description: 'Build a cross-platform habit tracker with React Native and AsyncStorage',
        difficulty: 'Medium',
        category: 'projects',
        platform: 'Expo',
        technology: 'React Native',
        link: 'https://reactnative.dev/docs/tutorial',
        video: 'https://youtube.com/embed/0-S5a0eXPoc',
        resources: [
          'React Native Docs: https://reactnative.dev/docs/intro-react-native-components',
          'Expo Guide: https://docs.expo.dev/'
        ],
        tracks: ['app-dev']
      },
      {
        id: 8,
        title: 'Flutter Weather App',
        description: 'Fetch live weather data and render beautiful cards with Flutter',
        difficulty: 'Medium',
        category: 'projects',
        platform: 'Flutter',
        technology: 'Flutter',
        link: 'https://docs.flutter.dev/get-started/codelab',
        video: 'https://youtube.com/embed/jBBl1tYkUnE',
        resources: [
          'Flutter Codelabs: https://codelabs.developers.google.com/?cat=Flutter',
          'OpenWeather API: https://openweathermap.org/api'
        ],
        tracks: ['app-dev']
      },
      {
        id: 9,
        title: 'MNIST Digit Classifier',
        description: 'Train and evaluate a neural network to recognize handwritten digits',
        difficulty: 'Medium',
        category: 'machine learning',
        platform: 'Kaggle',
        technology: 'TensorFlow',
        link: 'https://www.tensorflow.org/tutorials/quickstart/beginner',
        video: 'https://youtube.com/embed/bte8Er0QhDg',
        resources: [
          'Kaggle MNIST: https://www.kaggle.com/c/digit-recognizer',
          'TensorFlow Guide: https://www.tensorflow.org/tutorials'
        ],
        tracks: ['ai-ml']
      },
      {
        id: 10,
        title: 'Build an ML Pipeline',
        description: 'Create a full ML pipeline with data cleaning, training, and deployment',
        difficulty: 'Hard',
        category: 'machine learning',
        platform: 'FastAPI',
        technology: 'Python',
        link: 'https://fastapi.tiangolo.com/tutorial/machine-learning/',
        video: 'https://youtube.com/embed/0RS1N2NtD6w',
        resources: [
          'MLflow Guide: https://mlflow.org/docs/latest/index.html',
          'FastAPI Docs: https://fastapi.tiangolo.com/'
        ],
        tracks: ['ai-ml']
      },
      {
        id: 11,
        title: 'Sliding Window Mastery',
        description: 'Solve sliding window problems for arrays and strings efficiently',
        difficulty: 'Medium',
        category: 'algorithms',
        platform: 'LeetCode',
        technology: 'Algorithms',
        link: 'https://leetcode.com/tag/sliding-window/',
        video: 'https://youtube.com/embed/8s1tcX5mJ1E',
        resources: [
          'Sliding Window Patterns: https://www.educative.io/courses/grokking-the-coding-interview',
          'LeetCode Discuss Collection: https://leetcode.com/discuss/general-discussion/1064670/Sliding-Window-for-Beginners'
        ],
        tracks: ['dsa-cp']
      },
      {
        id: 12,
        title: 'Dynamic Programming Bootcamp',
        description: 'Practice classic DP problems (knapsack, LIS, grid paths)',
        difficulty: 'Hard',
        category: 'algorithms',
        platform: 'Codeforces',
        technology: 'Algorithms',
        link: 'https://codeforces.com/blog/entry/67679',
        video: 'https://youtube.com/embed/oBt53YbR9Kk',
        resources: [
          'AtCoder DP Contest: https://atcoder.jp/contests/dp',
          'CP Algorithms: https://cp-algorithms.com/dynamic_programming/basic.html'
        ],
        tracks: ['dsa-cp']
      }
    ];

    return allProblems.filter((problem) => {
      const focusMatch = true;
      const levelMatch =
        (level === 'beginner' && problem.difficulty === 'Easy') ||
        (level === 'intermediate' && ['Easy', 'Medium'].includes(problem.difficulty)) ||
        level === 'advanced';

      const categoryMatch = filters.category === 'all' || problem.category === filters.category;
      const platformMatch = filters.platform === 'all' || problem.platform === filters.platform;
      const techMatch = filters.technology === 'all' || problem.technology === filters.technology;
      const searchMatch =
        problem.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const trackMatch = !problem.tracks || problem.tracks.includes(trackKey);

      return focusMatch && levelMatch && categoryMatch && platformMatch && techMatch && searchMatch && trackMatch;
    });
  };

  // Simple technology detector used by the roadmap generator.
  const detectTechnologies = (text = '') => {
    const t = (text || '').toLowerCase();
    const known = [
      { name: 'react', category: 'frontend', aliases: ['react', 'reactjs', 'react.js'] },
      { name: 'vue', category: 'frontend', aliases: ['vue', 'vuejs', 'vue.js'] },
      { name: 'angular', category: 'frontend', aliases: ['angular'] },
      { name: 'svelte', category: 'frontend', aliases: ['svelte'] },
      { name: 'node.js', category: 'backend', aliases: ['node', 'nodejs', 'node.js'] },
      { name: 'express', category: 'backend', aliases: ['express'] },
      { name: 'python', category: 'backend', aliases: ['python'] },
      { name: 'django', category: 'backend', aliases: ['django'] },
      { name: 'flask', category: 'backend', aliases: ['flask'] },
      { name: 'tensorflow', category: 'ml', aliases: ['tensorflow'] },
      { name: 'pytorch', category: 'ml', aliases: ['pytorch'] },
      { name: 'javascript', category: 'frontend', aliases: ['javascript', 'js', 'ecmascript'] },
      { name: 'typescript', category: 'frontend', aliases: ['typescript', 'ts'] },
      { name: 'tailwind', category: 'frontend', aliases: ['tailwind', 'tailwindcss'] }
    ];

    const results = [];
    known.forEach(k => {
      if (k.aliases.some(a => t.includes(a))) {
        results.push({ name: k.name, category: k.category, confidence: 0.9, related: [] });
      }
    });

    return results;
  };

  // Static method to generate roadmap
  RoadmapPage.generateAIPoweredRoadmap = (goals, time, level, trackKey = 'web-dev') => {
    // Normalize and analyze user input
    const goalsLower = goals.toLowerCase();
    const isBeginner = level === 'beginner';
    const isIntermediate = level === 'intermediate';
    const isAdvanced = level === 'advanced';

    // Initialize path with core fundamentals based on level
    let path = [];
    const selectedTrack = TRACK_CONFIG[trackKey] || TRACK_CONFIG['web-dev'];
    const levelKey = isAdvanced ? 'advanced' : isIntermediate ? 'intermediate' : 'beginner';

    if (selectedTrack) {
      path.push(`Track focus: ${selectedTrack.summary}`);
      path.push('');
      selectedTrack.baseTopics.forEach(topic => path.push(topic));
      selectedTrack.levelTopics?.[levelKey]?.forEach(topic => path.push(topic));
      path.push('');
    }

    // Detect technologies from user input
    const detectedTech = detectTechnologies(goals);

    // Extract key problem areas from the user's description with enhanced matching
    const problemKeywords = [
      {
        key: 'responsive',
        aliases: ['responsive', 'mobile', 'tablet', 'desktop', 'screen size'],
        topics: ['Responsive Design', 'Media Queries', 'Flexbox', 'CSS Grid', 'Viewport Units']
      },
      {
        key: 'layout',
        aliases: ['layout', 'positioning', 'alignment', 'spacing', 'grid', 'flex'],
        topics: ['CSS Layout', 'Flexbox', 'CSS Grid', 'Positioning', 'CSS Box Model']
      },
      {
        key: 'javascript',
        aliases: ['javascript', 'js', 'ecmascript', 'es6', 'esnext'],
        topics: ['JavaScript Fundamentals', 'DOM Manipulation', 'ES6+ Features', 'Async/Await', 'Promises']
      },
      {
        key: 'api',
        aliases: ['api', 'rest', 'graphql', 'fetch', 'axios'],
        topics: ['REST APIs', 'GraphQL', 'Fetch API', 'Axios', 'Error Handling']
      },
      {
        key: 'performance',
        aliases: ['performance', 'speed', 'optimization', 'fast', 'slow'],
        topics: ['Performance Optimization', 'Lazy Loading', 'Code Splitting', 'Caching']
      }
    ];

    // Enhanced problem detection
    const detectedProblems = [];
    problemKeywords.forEach(({ aliases, topics }) => {
      const isMentioned = aliases.some(alias => goalsLower.includes(alias));
      if (isMentioned) {
        detectedProblems.push(...topics);
      }
    });

    // Generate path based on detected technologies and problems
    if (detectedTech.length > 0) {
      path.push('Based on your goals, I recommend focusing on these technologies:');

      detectedTech.forEach(({ name, category, confidence, related }) => {
        const techName = name.charAt(0).toUpperCase() + name.slice(1);
        path.push(`• ${techName} (${category}${related.length > 0 ? `, related to: ${related.join(', ')}` : ''})`);
      });
      path.push(''); // Empty line for better readability
    }

    // Add detected problems to the path
    if (detectedProblems.length > 0) {
      path.push('Key areas to focus on:');
      detectedProblems.forEach(problem => {
        path.push(`• ${problem}`);
      });
      path.push(''); // Empty line for better readability
    }

    // Find relevant topics based on user's problem description
    const relevantTopics = [];
    problemKeywords.forEach(({ key, topics }) => {
      if (goalsLower.includes(key)) {
        relevantTopics.push(...topics);
      }
    });

    // If no specific problems mentioned, use level-based defaults
    if (relevantTopics.length === 0) {
      if (isBeginner) {
        path.push('Master HTML5 & CSS3 fundamentals (semantic HTML, box model, selectors)');
        path.push('Learn JavaScript basics (variables, functions, loops, conditionals)');
      } else {
        path.push('Review and strengthen core web technologies (HTML5, CSS3, JavaScript)');
      }
    } else {
      // Add relevant topics based on the user's problem description
      path.push('Focus on addressing your specific challenges:');
      relevantTopics.forEach(topic => {
        path.push(`• ${topic}`);
      });
    }

    // Detect specific technologies and frameworks mentioned in the problem
    const techStack = {
      frontend: {
        react: goalsLower.includes('react') || goalsLower.includes('reactjs') || goalsLower.includes('react.js'),
        vue: goalsLower.includes('vue') || goalsLower.includes('vue.js') || goalsLower.includes('vuejs'),
        angular: goalsLower.includes('angular') || goalsLower.includes('angularjs'),
        svelte: goalsLower.includes('svelte'),
        typescript: goalsLower.includes('typescript') || goalsLower.includes('ts ') || goalsLower.includes('type script'),
        jquery: goalsLower.includes('jquery') || goalsLower.includes('jquery ui'),
        bootstrap: goalsLower.includes('bootstrap') || goalsLower.includes('css framework'),
        tailwind: goalsLower.includes('tailwind') || goalsLower.includes('tailwindcss')
      },
      backend: {
        node: goalsLower.includes('node') || goalsLower.includes('nodejs') || goalsLower.includes('node.js'),
        express: goalsLower.includes('express') || goalsLower.includes('expressjs') || goalsLower.includes('express.js'),
        nextjs: goalsLower.includes('next') || goalsLower.includes('nextjs') || goalsLower.includes('next.js'),
        python: goalsLower.includes('python') || goalsLower.includes('django') || goalsLower.includes('flask'),
        java: (goalsLower.includes('java') && !goalsLower.includes('javascript')) || goalsLower.includes('spring'),
        php: goalsLower.includes('php') || goalsLower.includes('laravel') || goalsLower.includes('wordpress'),
        ruby: goalsLower.includes('ruby') || goalsLower.includes('rails') || goalsLower.includes('ruby on rails'),
        dotnet: goalsLower.includes('.net') || goalsLower.includes('c#') || goalsLower.includes('asp.net')
      },
      database: {
        mongodb: goalsLower.includes('mongodb') || goalsLower.includes('mongo') || goalsLower.includes('mongoose'),
        postgresql: goalsLower.includes('postgres') || goalsLower.includes('postgresql') || goalsLower.includes('postgre sql') || goalsLower.includes('postgresql'),
        mysql: goalsLower.includes('mysql') || goalsLower.includes('my sql') || goalsLower.includes('mariadb'),
        sqlite: goalsLower.includes('sqlite') || goalsLower.includes('sqlite3'),
        sql: goalsLower.includes('sql') && !goalsLower.includes('nosql') && !goalsLower.includes('postgresql') && !goalsLower.includes('mysql') && !goalsLower.includes('sqlite'),
        firebase: goalsLower.includes('firebase') || goalsLower.includes('firestore')
      },
      devops: {
        docker: goalsLower.includes('docker') || goalsLower.includes('container'),
        aws: goalsLower.includes('aws') || goalsLower.includes('amazon web services'),
        azure: goalsLower.includes('azure') || goalsLower.includes('microsoft azure'),
        gcp: goalsLower.includes('gcp') || goalsLower.includes('google cloud'),
        heroku: goalsLower.includes('heroku'),
        netlify: goalsLower.includes('netlify'),
        vercel: goalsLower.includes('vercel') || goalsLower.includes('zeit')
      },
      testing: {
        jest: goalsLower.includes('jest'),
        cypress: goalsLower.includes('cypress'),
        testing: goalsLower.includes('test') || goalsLower.includes('testing'),
        tdd: goalsLower.includes('tdd') || goalsLower.includes('test driven')
      }
    };

    // Add frontend technologies to path based on the user's problem context
    const frontendTechs = [];

    if (techStack.frontend.react) {
      frontendTechs.push('React.js');
      if (isBeginner) {
        path.push('Learn React fundamentals (components, JSX, props, state)');
        path.push('Understand React hooks (useState, useEffect, useContext)');
      } else {
        path.push('Master React patterns (HOCs, render props, custom hooks)');
        path.push('Advanced state management (Context API, Redux, or Recoil)');
      }

      if (techStack.frontend.typescript) {
        path.push('Integrate TypeScript with React for type safety');
        path.push('TypeScript best practices for React components and hooks');
      }
    }

    if (techStack.frontend.vue) {
      frontendTechs.push('Vue.js');
      path.push('Learn Vue.js fundamentals (components, directives, computed properties)');
      path.push('State management with Vuex or Pinia');
    }

    if (techStack.frontend.angular) {
      frontendTechs.push('Angular');
      path.push('Master Angular components, services, and dependency injection');
      path.push('Learn RxJS for reactive programming in Angular');
    }

    if (techStack.frontend.svelte) {
      frontendTechs.push('Svelte');
      path.push('Learn Svelte components and reactivity');
      path.push('State management with Svelte stores');
    }

    // Add general frontend topics if specific framework not mentioned
    if (frontendTechs.length === 0 && (goalsLower.includes('frontend') || goalsLower.includes('ui') || goalsLower.includes('design'))) {
      path.push('Deep dive into modern JavaScript (ES6+ features, async/await, closures)');
      path.push('Master CSS Grid and Flexbox for modern layouts');
      path.push('Learn responsive design principles and mobile-first development');
    }

    // Add backend technologies to path based on the user's problem context
    const backendTechs = [];

    if (techStack.backend.node || techStack.backend.express) {
      backendTechs.push('Node.js');
      if (techStack.backend.express) backendTechs.push('Express.js');

      if (isBeginner) {
        path.push('Learn Node.js fundamentals (modules, event loop, file system)');
        path.push('Build RESTful APIs with Express.js');
      } else {
        path.push('Advanced Node.js patterns (streams, worker threads, clustering)');
        path.push('Design scalable and maintainable Express.js applications');
      }

      if (isIntermediate || isAdvanced) {
        path.push('Implement authentication & authorization (JWT, OAuth, sessions)');
        path.push('API security best practices (rate limiting, CORS, sanitization)');
        path.push('Error handling and logging strategies');
      }
    }

    if (techStack.backend.python) {
      backendTechs.push('Python');
      if (goalsLower.includes('django')) {
        path.push('Master Django framework (models, views, templates)');
        path.push('Build REST APIs with Django REST Framework');
      } else if (goalsLower.includes('flask')) {
        path.push('Learn Flask framework (routes, templates, blueprints)');
        path.push('Build RESTful APIs with Flask-RESTful or FastAPI');
      } else {
        path.push('Master Python for backend development');
        path.push('Build web applications with your preferred Python framework');
      }
    }

    if (techStack.backend.java) {
      backendTechs.push('Java');
      if (goalsLower.includes('spring')) {
        path.push('Master Spring Boot framework');
        path.push('Build RESTful APIs with Spring Web');
      } else {
        path.push('Learn Java for backend development');
        path.push('Build web applications with Java EE or Spring');
      }
    }

    // Add general backend topics if specific technology not mentioned
    if (backendTechs.length === 0 && (goalsLower.includes('backend') || goalsLower.includes('api') || goalsLower.includes('server'))) {
      path.push('Learn about RESTful API design principles');
      path.push('Understand HTTP methods and status codes');
      path.push('API documentation with OpenAPI/Swagger');
    }

    // Add database technologies based on the user's problem context
    const dbTechs = [];

    if (techStack.database.mongodb) {
      dbTechs.push('MongoDB');
      path.push('Master MongoDB fundamentals (collections, documents, queries)');
      path.push('Data modeling with MongoDB (relationships, schema design)');

      if (techStack.backend.node) {
        path.push('Integrate MongoDB with Node.js using Mongoose ODM');
        path.push('Advanced Mongoose features (middleware, validation, aggregation)');
      }
    }

    if (techStack.database.postgresql || techStack.database.mysql || techStack.database.sql) {
      const dbType = techStack.database.postgresql ? 'PostgreSQL' :
        techStack.database.mysql ? 'MySQL' : 'SQL';
      dbTechs.push(dbType);

      path.push(`Master ${dbType} (tables, relationships, complex queries, transactions)`);
      path.push('Database optimization and indexing strategies');

      if (techStack.backend.node) {
        const orm = techStack.database.postgresql ? 'Sequelize/TypeORM' :
          techStack.database.mysql ? 'Sequelize/TypeORM' : 'Knex.js/TypeORM';
        path.push(`Connect ${dbType} with Node.js using ${orm}`);
      }
    }

    if (techStack.database.firebase) {
      dbTechs.push('Firebase');
      path.push('Learn Firebase Realtime Database and Firestore');
      path.push('Implement authentication and security rules');
    }

    // Add general database topics if no specific database mentioned
    if (dbTechs.length === 0 && (goalsLower.includes('database') || goalsLower.includes('data'))) {
      path.push('Learn about different types of databases (SQL vs NoSQL)');
      path.push('Database design principles and normalization');
      path.push('Query optimization and indexing');
    }

    // Add advanced topics based on level
    if (isIntermediate || isAdvanced) {
      path.push('Learn about software architecture patterns (MVC, Microservices, etc.)');
      path.push('Understand CI/CD pipelines and DevOps basics');

      if (isAdvanced) {
        path.push('Master performance optimization techniques');
        path.push('Learn about containerization with Docker');
        path.push('Explore cloud platforms (AWS, GCP, or Azure)');
      }
    }

    // Add project-based learning tailored to the user's problem
    if (path.length > 0) {
      // Extract potential project ideas from the problem description
      const projectIdeas = [];
      const problemWords = goalsLower.split(/\s+/);
      const projectVerbs = ['build', 'create', 'develop', 'make', 'design'];

      // Look for project ideas in the problem description
      for (let i = 0; i < problemWords.length - 1; i++) {
        if (projectVerbs.includes(problemWords[i])) {
          // Try to extract the next few words as the project idea
          const idea = goals.split(/\s+/).slice(i, i + 4).join(' ');
          if (idea.length > 10) {  // Ensure it's a meaningful phrase
            projectIdeas.push(idea);
            break;
          }
        }
      }

      // If no project ideas were found in the problem description, generate some based on technologies
      if (projectIdeas.length === 0) {
        if (frontendTechs.length > 0) {
          projectIdeas.push(`a ${frontendTechs.join('/')} application`);
        }
        if (backendTechs.length > 0) {
          projectIdeas.push(`a ${backendTechs.join('/')} backend service`);
        }
        if (dbTechs.length > 0) {
          projectIdeas.push(`a database-powered application with ${dbTechs.join('/')}`);
        }
      }

      // Add the project to the learning path
      if (projectIdeas.length > 0) {
        path.push('');  // Empty line for better readability
        path.push('Project: ' + projectIdeas[0]);
        path.push('• Break down the project into smaller tasks');
        path.push('• Set up version control with Git');
        path.push('• Implement core features incrementally');
        path.push('• Write tests for critical functionality');
        path.push('• Deploy and share your project');
      } else {
        // Fallback to a generic project idea
        path.push('Build a complete project that solves a real-world problem');
      }

      // Add deployment step if relevant to the user's problem
      if (goalsLower.includes('deploy') || goalsLower.includes('host') || goalsLower.includes('production')) {
        path.push('\nDeployment & DevOps:');
        if (techStack.devops.vercel || techStack.devops.netlify) {
          const platform = techStack.devops.vercel ? 'Vercel' : 'Netlify';
          path.push(`• Deploy your application using ${platform}`);
          path.push(`• Set up continuous deployment with GitHub`);
        } else if (techStack.devops.heroku) {
          path.push('Deploy your application on Heroku');
          path.push('Set up environment variables and add-ons');
        } else if (techStack.devops.aws || techStack.devops.azure || techStack.devops.gcp) {
          const cloud = techStack.devops.aws ? 'AWS' : techStack.devops.azure ? 'Azure' : 'Google Cloud';
          path.push(`Deploy your application on ${cloud}`);
          path.push('Set up CI/CD pipelines');
          path.push('Configure monitoring and logging');
        } else {
          path.push('Learn to deploy your application (choose a platform based on your needs)');
          path.push('• Frontend: Vercel, Netlify, GitHub Pages');
          path.push('• Backend: Heroku, Railway, Render, or cloud providers');
        }
      }
    }

    // Determine focus area based on user goals
    // goalsLower is already defined above
    let focusArea = selectedTrack?.focusArea || 'web development';
    const allowFocusOverride = trackKey === 'web-dev';

    if (allowFocusOverride) {
      if ((goalsLower.includes('frontend') || goalsLower.includes('front end') ||
        goalsLower.includes('react') || goalsLower.includes('vue') ||
        goalsLower.includes('angular') || goalsLower.includes('ui') ||
        goalsLower.includes('ux') || goalsLower.includes('design')) &&
        !goalsLower.includes('backend') && !goalsLower.includes('node') && !goalsLower.includes('api')) {
        focusArea = 'frontend development';
      } else if ((goalsLower.includes('backend') || goalsLower.includes('back end') ||
        goalsLower.includes('server') || goalsLower.includes('api') ||
        goalsLower.includes('database') || goalsLower.includes('node')) &&
        !goalsLower.includes('frontend') && !goalsLower.includes('react') &&
        !goalsLower.includes('vue') && !goalsLower.includes('angular')) {
        focusArea = 'backend development';
      } else if (path.length > 0) {
        const frontendKeywords = ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'ui', 'ux', 'design'];
        const backendKeywords = ['node', 'express', 'api', 'server', 'database', 'mongodb', 'postgres', 'sql'];

        const frontendCount = frontendKeywords.filter(kw => goalsLower.includes(kw)).length;
        const backendCount = backendKeywords.filter(kw => goalsLower.includes(kw)).length;

        if (frontendCount > backendCount) {
          focusArea = 'frontend-focused development';
        } else if (backendCount > frontendCount) {
          focusArea = 'backend-focused development';
        } else {
          focusArea = 'web development';
        }
      }
    }

    // Adjust path based on experience level
    let adjustedPath = [...path]; // Start with our custom path

    if (level === 'beginner') {
      // Keep all topics but add some beginner-friendly explanations
      adjustedPath = adjustedPath.map(topic =>
        topic.startsWith('Master') ? topic : `Learn ${topic.toLowerCase()}`
      );
    } else if (level === 'intermediate') {
      // Skip very basic topics for intermediates
      adjustedPath = adjustedPath.filter(topic =>
        !topic.toLowerCase().includes('fundamentals') &&
        !topic.toLowerCase().includes('learn html')
      );
    } else {
      // Advanced users get more challenging topics
      adjustedPath = adjustedPath.filter(topic =>
        !topic.toLowerCase().includes('fundamentals') &&
        !topic.toLowerCase().includes('learn ')
      );

      if (adjustedPath.length < 5) {
        // Add advanced topics if we don't have enough
        if (focusArea.includes('frontend')) {
          adjustedPath.push('Advanced performance optimization techniques');
          adjustedPath.push('Web accessibility (a11y) best practices');
          adjustedPath.push('Progressive Web App (PWA) development');
        } else if (focusArea.includes('backend')) {
          adjustedPath.push('System design and architecture patterns');
          adjustedPath.push('High availability and scaling strategies');
          adjustedPath.push('Advanced database optimization');
        }
      }
    }

    // Add personalized topics based on goals
    if (goalsLower.includes('job') || goalsLower.includes('career')) {
      adjustedPath.push('Build a professional portfolio website');
      adjustedPath.push('Create an impressive GitHub profile');
      adjustedPath.push('Prepare for technical interviews (DSA, system design)');
      adjustedPath.push('Learn how to write a tech resume and cover letter');
    }

    if (goalsLower.includes('freelance') || goalsLower.includes('freelancing')) {
      adjustedPath.push('Learn how to find and manage clients');
      adjustedPath.push('Understand project scoping and pricing');
      adjustedPath.push('Learn about contracts and legal considerations');
      adjustedPath.push('Build a portfolio of client projects');
    }

    const timeMap = {
      '5-10 hours': 8,
      '10-15 hours': 12,
      '15-20 hours': 16,
      '20+ hours': 20
    };

    const weeks = timeMap[time] || 12;
    const stepsPerWeek = Math.max(1, Math.ceil(adjustedPath.length / weeks));

    const weeklyRoadmap = [];
    for (let i = 0; i < adjustedPath.length; i += stepsPerWeek) {
      weeklyRoadmap.push({
        week: Math.floor(i / stepsPerWeek) + 1,
        steps: adjustedPath.slice(i, i + stepsPerWeek)
      });
    }

    return {
      title: 'Your Personalized Web Development Roadmap',
      description: `A ${weeks}-week learning path to ${goals || (selectedTrack?.summary?.toLowerCase() || 'master web development')}`,
      weeks: weeklyRoadmap,
      totalWeeks: weeks,
      focusAreas: focusArea,
      focusArea: focusArea,
      personalizedTips: getPersonalizedTips(goals, level),
      practiceProblems: getPracticeProblems(focusArea, level, undefined, trackKey),
      trackKey,
      trackLabel: selectedTrack?.label || 'Web Development',
      trackSummary: selectedTrack?.summary
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.goals.trim()) {
      toast.error('Please enter your learning goals');
      return;
    }
    if (!track) {
      toast.error('Please select a learning track');
      return;
    }

    setLoading(true);

    try {
      // Generate the roadmap directly using the existing function
      const generatedRoadmap = RoadmapPage.generateAIPoweredRoadmap(
        formData.goals,
        formData.time_availability,
        formData.current_level,
        track
      );

      setRoadmap(generatedRoadmap);
      setStep('roadmap');

      // Scroll to the roadmap section
      setTimeout(() => {
        document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      toast.success('Roadmap generated successfully!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setGenerationError({ message: error?.message || 'Unknown error', stack: error?.stack || '' });
      const msg = error?.message ? `Failed to generate roadmap: ${error.message}` : 'Failed to generate roadmap. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrackChange = (value) => {
    setTrack(value);
    localStorage.setItem('selectedTrack', value);
  };

  const renderWeek = (weekData) => {
    return (
      <div key={weekData.week} className="mb-8">
        <h3 className="text-xl font-semibold text-cyan-400 mb-3">Week {weekData.week}</h3>
        <div className="space-y-2 pl-4 border-l-2 border-cyan-500/20">
          {weekData.steps.map((step, idx) => (
            <div key={idx} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getPersonalizedTips = (goals, level) => {
    const tips = [];
    const goalsLower = goals.toLowerCase();

    if (level === 'beginner') {
      tips.push('Start with small projects to build confidence');
      tips.push('Focus on understanding core concepts before frameworks');
      tips.push('Practice coding daily, even if it\'s just for 30 minutes');
    } else if (level === 'intermediate') {
      tips.push('Start building more complex projects to challenge yourself');
      tips.push('Contribute to open source projects to gain experience');
      tips.push('Learn about design patterns and system design');
    } else {
      tips.push('Focus on mastering advanced concepts and optimizations');
      tips.push('Mentor others to reinforce your knowledge');
      tips.push('Stay updated with the latest industry trends and tools');
    }

    if (goalsLower.includes('job') || goalsLower.includes('career')) {
      tips.push('Network with professionals in your desired field');
      tips.push('Attend tech meetups and conferences');
      tips.push('Prepare for technical interviews with mock interviews');
    }

    if (goalsLower.includes('freelance') || goalsLower.includes('freelancing')) {
      tips.push('Create a professional portfolio website');
      tips.push('Set up a professional invoicing system');
      tips.push('Learn about contracts and legal requirements for freelancers');
    }

    return tips;
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-200">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            opacity: 1.0,
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        >
          <source src="/161334-823146699.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'questions' ? 'Create Your Learning Roadmap' : roadmap?.title || 'Your Learning Path'}
            </h1>
            {step === 'roadmap' && roadmap?.description && (
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">{roadmap.description}</p>
                {roadmap.trackSummary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {roadmap.trackSummary}
                  </p>
                )}
              </div>
            )}
          </div>

          {step === 'questions' && (
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What are your learning goals? *
                  </Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600"
                    rows={3}
                    placeholder="E.g., Build a portfolio website, Get a job at a tech company, Master algorithms..."
                    required
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Which learning track are you focusing on? *
                  </Label>
                  <Select value={track} onValueChange={handleTrackChange} required>
                    <SelectTrigger className="mt-2 bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {trackOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {TRACK_CONFIG[track]?.summary || 'Choose where you want to focus your efforts.'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="time_availability" className="text-slate-200 text-sm font-medium">
                    How much time can you dedicate per week? *
                  </Label>
                  <Select
                    value={formData.time_availability}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, time_availability: value }))}
                    required
                  >
                    <SelectTrigger className="mt-2 bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select time commitment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="5-10 hours">5-10 hours/week</SelectItem>
                      <SelectItem value="10-15 hours">10-15 hours/week</SelectItem>
                      <SelectItem value="15-20 hours">15-20 hours/week</SelectItem>
                      <SelectItem value="20+ hours">20+ hours/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="current_level" className="text-slate-200 text-sm font-medium">
                    Current skill level in this track? *
                  </Label>
                  <Select
                    value={formData.current_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, current_level: value }))}
                    required
                  >
                    <SelectTrigger className="mt-2 bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="beginner">Beginner (0-6 months experience)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (6-12 months experience)</SelectItem>
                      <SelectItem value="advanced">Advanced (1+ years experience)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Roadmap...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate My Roadmap
                      </>
                    )}
                  </Button>
                </div>
              </form>
              {generationError && (
                <div className="mt-4 p-4 bg-red-900 text-white rounded">
                  <h4 className="font-bold">Roadmap generation error</h4>
                  <p className="text-sm">{generationError.message}</p>
                  <pre className="text-xs mt-2 max-h-40 overflow-auto text-red-200">{generationError.stack}</pre>
                </div>
              )}
            </div>
          )}

          {step === 'roadmap' && roadmap && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-cyan-500 mb-2">{roadmap.title}</h1>
                  <p className="text-gray-600 dark:text-gray-300">{roadmap.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Focus Area: {roadmap.focusAreas} • {roadmap.totalWeeks} weeks
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="bg-white/5 p-6 rounded-xl border border-gray-200/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">Focus Area</h3>
                    </div>
                    <p className="text-gray-300">
                      {roadmap.focusAreas}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {roadmap.trackLabel}
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-gray-200/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">Duration</h3>
                    </div>
                    <p className="text-gray-300">
                      {roadmap.totalWeeks} weeks at {formData.time_availability}/week
                    </p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-gray-200/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Lightbulb className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">Level</h3>
                    </div>
                    <p className="text-gray-300 capitalize">
                      {formData.current_level}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Personalized Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roadmap.personalizedTips?.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 bg-white/5 p-4 rounded-lg">
                        <span className="text-cyan-400">•</span>
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white">Your Learning Path</h3>
                  {roadmap.weeks.map(renderWeek)}
                </div>

                {/* Practice problems removed from roadmap view; use Problems page in navbar instead. */}

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setStep('questions')}
                    variant="outline"
                    className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-900/50"
                  >
                    Modify My Plan
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Print or Save as PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;