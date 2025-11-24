// Curriculum-aligned coding problems organized by learning phase
// Each problem aligns with concepts taught in the corresponding phase of language learning

export const problemsByTrack = {
        'dsa-cp': {
                phase1: [
                        // Phase 1: Foundations - Basic syntax, loops, conditionals, simple arrays
                        {
                                id: 'dsa-p1-1',
                                title: 'Print Pattern',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'DSA & CP',
                                prerequisites: ['Basic syntax', 'Loops', 'Print statements'],
                                description: 'Print a right-angled triangle pattern using asterisks.',
                                fullDescription: 'Given a number n, print a right-angled triangle pattern with n rows using asterisks (*). Each row i should have i asterisks.',
                                hints: ['Use nested loops', 'Outer loop for rows', 'Inner loop for columns'],
                                solution_approach: 'Use two nested loops. Outer loop runs n times for rows, inner loop runs i times for each row i. Time: O(n²), Space: O(1)',
                                tags: ['loops', 'patterns', 'basics']
                        },
                        {
                                id: 'dsa-p1-2',
                                title: 'Find Maximum in Array',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'DSA & CP',
                                prerequisites: ['Arrays', 'Loops', 'Variables'],
                                description: 'Find the largest number in an array of integers.',
                                fullDescription: 'Given an array of integers, find and return the maximum value.',
                                hints: ['Initialize max with first element', 'Loop through array', 'Update max when larger value found'],
                                solution_approach: 'Initialize max = arr[0], iterate through array updating max. Time: O(n), Space: O(1)',
                                tags: ['arrays', 'loops', 'basics']
                        },
                        {
                                id: 'dsa-p1-3',
                                title: 'Sum of Array Elements',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'DSA & CP',
                                prerequisites: ['Arrays', 'Loops', 'Addition'],
                                description: 'Calculate the sum of all elements in an array.',
                                fullDescription: 'Given an array of integers, return the sum of all elements.',
                                hints: ['Initialize sum = 0', 'Loop through array', 'Add each element to sum'],
                                solution_approach: 'Initialize sum = 0, iterate and accumulate. Time: O(n), Space: O(1)',
                                tags: ['arrays', 'loops', 'basics']
                        },
                        {
                                id: 'dsa-p1-4',
                                title: 'Count Even Numbers',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'DSA & CP',
                                prerequisites: ['Arrays', 'Conditionals', 'Modulo operator'],
                                description: 'Count how many even numbers are in an array.',
                                fullDescription: 'Given an array of integers, count and return how many numbers are even.',
                                hints: ['Use modulo operator %', 'Check if number % 2 == 0', 'Increment counter'],
                                solution_approach: 'Loop through array, count numbers where n % 2 == 0. Time: O(n), Space: O(1)',
                                tags: ['arrays', 'conditionals', 'basics']
                        },
                        {
                                id: 'dsa-p1-5',
                                title: 'Reverse an Array',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'DSA & CP',
                                prerequisites: ['Arrays', 'Loops', 'Swapping'],
                                description: 'Reverse an array in-place.',
                                fullDescription: 'Given an array, reverse it in-place without using extra space.',
                                hints: ['Use two pointers', 'Swap elements from start and end', 'Move pointers toward center'],
                                solution_approach: 'Two pointers from both ends, swap and move inward. Time: O(n), Space: O(1)',
                                tags: ['arrays', 'two-pointers', 'basics']
                        }
                ],
                phase2: [
                        // Phase 2: Core - Functions, recursion, hash maps, basic algorithms
                        {
                                id: 'dsa-p2-1',
                                title: 'Two Sum',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'DSA & CP',
                                prerequisites: ['Hash maps', 'Arrays', 'Functions'],
                                description: 'Find two numbers that add up to a target sum.',
                                fullDescription: 'Given an array and a target sum, return indices of two numbers that add up to the target.',
                                hints: ['Use hash map to store complements', 'Check if target - current exists', 'Return indices when found'],
                                solution_approach: 'Hash map to store value→index. For each element, check if (target - element) exists. Time: O(n), Space: O(n)',
                                tags: ['hash-map', 'arrays', 'search']
                        },
                        {
                                id: 'dsa-p2-2',
                                title: 'Valid Parentheses',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'DSA & CP',
                                prerequisites: ['Stack', 'Strings', 'Data structures'],
                                description: 'Check if brackets are properly balanced.',
                                fullDescription: 'Given a string with brackets (), {}, [], determine if they are properly balanced.',
                                hints: ['Use stack data structure', 'Push opening brackets', 'Pop and match closing brackets'],
                                solution_approach: 'Stack-based matching. Push opening, pop and verify for closing. Time: O(n), Space: O(n)',
                                tags: ['stack', 'strings', 'data-structures']
                        },
                        {
                                id: 'dsa-p2-3',
                                title: 'Fibonacci Sequence',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'DSA & CP',
                                prerequisites: ['Recursion', 'Functions', 'Base cases'],
                                description: 'Calculate the nth Fibonacci number.',
                                fullDescription: 'Given n, return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
                                hints: ['Use recursion or iteration', 'Define base cases', 'Optimize with memoization'],
                                solution_approach: 'Iterative: track last two values. Time: O(n), Space: O(1). Recursive with memo: O(n) both.',
                                tags: ['recursion', 'dynamic-programming', 'math']
                        },
                        {
                                id: 'dsa-p2-4',
                                title: 'Longest Substring Without Repeating',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'DSA & CP',
                                prerequisites: ['Sliding window', 'Hash set', 'Strings'],
                                description: 'Find length of longest substring without repeating characters.',
                                fullDescription: 'Given a string, find the length of the longest substring without repeating characters.',
                                hints: ['Use sliding window', 'Track characters in window with set', 'Shrink window when duplicate found'],
                                solution_approach: 'Sliding window with hash set. Expand right, shrink left on duplicates. Time: O(n), Space: O(min(n,charset))',
                                tags: ['sliding-window', 'hash-set', 'strings']
                        },
                        {
                                id: 'dsa-p2-5',
                                title: 'Merge Sorted Arrays',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'DSA & CP',
                                prerequisites: ['Two pointers', 'Arrays', 'Sorting'],
                                description: 'Merge two sorted arrays into one sorted array.',
                                fullDescription: 'Given two sorted arrays, merge them into a single sorted array.',
                                hints: ['Use two pointers', 'Compare elements', 'Add smaller to result'],
                                solution_approach: 'Two pointers, compare and merge. Time: O(n+m), Space: O(n+m)',
                                tags: ['two-pointers', 'arrays', 'sorting']
                        }
                ],
                phase3: [
                        // Phase 3: Advanced - DP, graphs, trees, complex algorithms
                        {
                                id: 'dsa-p3-1',
                                title: 'Longest Increasing Subsequence',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'DSA & CP',
                                prerequisites: ['Dynamic programming', 'Arrays', 'Optimization'],
                                description: 'Find length of longest strictly increasing subsequence.',
                                fullDescription: 'Given an array, find the length of the longest strictly increasing subsequence.',
                                hints: ['Dynamic programming approach', 'dp[i] = longest LIS ending at i', 'Binary search optimization possible'],
                                solution_approach: 'DP: dp[i] = max(dp[j] + 1) where j < i and arr[j] < arr[i]. Time: O(n²) or O(n log n) with binary search',
                                tags: ['dynamic-programming', 'binary-search', 'optimization']
                        },
                        {
                                id: 'dsa-p3-2',
                                title: 'Course Schedule (Cycle Detection)',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'DSA & CP',
                                prerequisites: ['Graphs', 'DFS', 'Topological sort'],
                                description: 'Determine if courses can be completed given prerequisites.',
                                fullDescription: 'Given course prerequisites as pairs, determine if all courses can be finished (detect cycle in directed graph).',
                                hints: ['Model as directed graph', 'Detect cycle using DFS', 'Use visited states: unvisited, visiting, visited'],
                                solution_approach: 'DFS cycle detection with 3 states. Time: O(V+E), Space: O(V+E)',
                                tags: ['graph', 'dfs', 'cycle-detection']
                        },
                        {
                                id: 'dsa-p3-3',
                                title: 'Binary Tree Maximum Path Sum',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'DSA & CP',
                                prerequisites: ['Trees', 'Recursion', 'DFS'],
                                description: 'Find maximum path sum in a binary tree.',
                                fullDescription: 'Given a binary tree, find the maximum path sum. A path can start and end at any node.',
                                hints: ['Use DFS recursion', 'Track max sum globally', 'For each node, consider: left path + node + right path'],
                                solution_approach: 'Post-order DFS. For each node, max path through it = left + node + right. Time: O(n), Space: O(h)',
                                tags: ['tree', 'dfs', 'recursion']
                        },
                        {
                                id: 'dsa-p3-4',
                                title: 'Word Ladder',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'DSA & CP',
                                prerequisites: ['BFS', 'Graphs', 'Strings'],
                                description: 'Find shortest transformation sequence from start to end word.',
                                fullDescription: 'Given start word, end word, and dictionary, find shortest transformation where each step changes one letter.',
                                hints: ['Model as graph problem', 'Use BFS for shortest path', 'Generate neighbors by changing each character'],
                                solution_approach: 'BFS with word graph. Each word is a node, edges connect words differing by 1 char. Time: O(M² × N), Space: O(M × N)',
                                tags: ['bfs', 'graph', 'strings']
                        }
                ],
                phase4: [
                        // Phase 4: Expert - Optimization, system design, competitive programming
                        {
                                id: 'dsa-p4-1',
                                title: 'Median of Two Sorted Arrays',
                                difficulty: 'Hard',
                                phase: 4,
                                track: 'DSA & CP',
                                prerequisites: ['Binary search', 'Arrays', 'Optimization'],
                                description: 'Find median of two sorted arrays in O(log(m+n)) time.',
                                fullDescription: 'Given two sorted arrays, find the median in logarithmic time.',
                                hints: ['Binary search on smaller array', 'Partition both arrays', 'Check partition validity'],
                                solution_approach: 'Binary search partition. Time: O(log(min(m,n))), Space: O(1)',
                                tags: ['binary-search', 'arrays', 'optimization']
                        },
                        {
                                id: 'dsa-p4-2',
                                title: 'LRU Cache Implementation',
                                difficulty: 'Hard',
                                phase: 4,
                                track: 'DSA & CP',
                                prerequisites: ['Hash map', 'Doubly linked list', 'Design'],
                                description: 'Implement an LRU cache with O(1) operations.',
                                fullDescription: 'Design and implement an LRU cache with get() and put() operations in O(1) time.',
                                hints: ['Use hash map + doubly linked list', 'Hash map for O(1) lookup', 'Linked list for O(1) removal/addition'],
                                solution_approach: 'Hash map stores key→node, doubly linked list maintains order. Time: O(1) for both ops, Space: O(capacity)',
                                tags: ['design', 'hash-map', 'linked-list']
                        }
                ]
        },

        'web-dev': {
                phase1: [
                        // Phase 1: HTML/CSS basics, simple DOM manipulation
                        {
                                id: 'web-p1-1',
                                title: 'Change Text Content',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'Web Development',
                                prerequisites: ['HTML', 'JavaScript basics', 'DOM'],
                                description: 'Change the text of an element when button is clicked.',
                                fullDescription: 'Create a button that changes the text content of a paragraph when clicked.',
                                hints: ['Use getElementById or querySelector', 'Add click event listener', 'Change innerText or textContent'],
                                solution_approach: 'document.getElementById("btn").addEventListener("click", () => { document.getElementById("text").innerText = "New Text" })',
                                tags: ['dom', 'events', 'basics']
                        },
                        {
                                id: 'web-p1-2',
                                title: 'Toggle CSS Class',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'Web Development',
                                prerequisites: ['CSS', 'JavaScript', 'classList'],
                                description: 'Toggle a CSS class on an element.',
                                fullDescription: 'Add a button that toggles a "highlight" class on a div element.',
                                hints: ['Use classList.toggle()', 'Define CSS class with styles', 'Add event listener'],
                                solution_approach: 'element.classList.toggle("highlight") on click event',
                                tags: ['css', 'dom', 'classes']
                        },
                        {
                                id: 'web-p1-3',
                                title: 'Simple Counter',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'Web Development',
                                prerequisites: ['Variables', 'Events', 'DOM'],
                                description: 'Create a counter with increment and decrement buttons.',
                                fullDescription: 'Build a counter that displays a number and has +/- buttons to change it.',
                                hints: ['Store count in a variable', 'Update display on button click', 'Use textContent to show count'],
                                solution_approach: 'let count = 0; increment/decrement on button clicks, update display element',
                                tags: ['variables', 'events', 'ui']
                        },
                        {
                                id: 'web-p1-4',
                                title: 'Show/Hide Element',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'Web Development',
                                prerequisites: ['CSS display', 'JavaScript', 'DOM'],
                                description: 'Toggle visibility of an element.',
                                fullDescription: 'Create a button that shows/hides a div element.',
                                hints: ['Use style.display property', 'Toggle between "none" and "block"', 'Or use classList with hidden class'],
                                solution_approach: 'element.style.display = element.style.display === "none" ? "block" : "none"',
                                tags: ['css', 'dom', 'visibility']
                        },
                        {
                                id: 'web-p1-5',
                                title: 'Basic Form Validation',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'Web Development',
                                prerequisites: ['Forms', 'Events', 'Conditionals'],
                                description: 'Validate that a text input is not empty.',
                                fullDescription: 'Prevent form submission if input field is empty, show error message.',
                                hints: ['Listen to submit event', 'Check input.value.trim()', 'Use preventDefault() if invalid'],
                                solution_approach: 'form.addEventListener("submit", (e) => { if (!input.value.trim()) e.preventDefault() })',
                                tags: ['forms', 'validation', 'events']
                        }
                ],
                phase2: [
                        // Phase 2: Async, fetch API, DOM manipulation, local storage
                        {
                                id: 'web-p2-1',
                                title: 'Fetch and Display Data',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'Web Development',
                                prerequisites: ['Fetch API', 'Promises', 'async/await'],
                                description: 'Fetch data from an API and display it.',
                                fullDescription: 'Fetch JSON data from a public API and display it in a list.',
                                hints: ['Use fetch() to get data', 'Parse JSON with .json()', 'Create DOM elements to display'],
                                solution_approach: 'const data = await fetch(url).then(r => r.json()); data.forEach(item => create and append element)',
                                tags: ['fetch', 'async', 'api']
                        },
                        {
                                id: 'web-p2-2',
                                title: 'Debounced Search',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'Web Development',
                                prerequisites: ['setTimeout', 'Functions', 'Events'],
                                description: 'Implement search input with debounce.',
                                fullDescription: 'Create a search input that waits for user to stop typing before making API call.',
                                hints: ['Use setTimeout', 'Clear previous timeout', 'Delay execution until typing stops'],
                                solution_approach: 'let timeout; input.addEventListener("input", () => { clearTimeout(timeout); timeout = setTimeout(search, 300) })',
                                tags: ['debounce', 'performance', 'events']
                        },
                        {
                                id: 'web-p2-3',
                                title: 'Local Storage Todo List',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'Web Development',
                                prerequisites: ['localStorage', 'Arrays', 'JSON'],
                                description: 'Build a todo list that persists in localStorage.',
                                fullDescription: 'Create a todo list where items are saved to localStorage and loaded on page refresh.',
                                hints: ['Use localStorage.setItem/getItem', 'Store array as JSON string', 'Load on page load'],
                                solution_approach: 'localStorage.setItem("todos", JSON.stringify(todos)); const todos = JSON.parse(localStorage.getItem("todos") || "[]")',
                                tags: ['localstorage', 'persistence', 'json']
                        },
                        {
                                id: 'web-p2-4',
                                title: 'Image Lazy Loading',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'Web Development',
                                prerequisites: ['Intersection Observer', 'DOM', 'Performance'],
                                description: 'Lazy load images as they enter viewport.',
                                fullDescription: 'Implement lazy loading for images using Intersection Observer API.',
                                hints: ['Use Intersection Observer', 'Store real src in data-src', 'Load image when visible'],
                                solution_approach: 'const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) load image }) })',
                                tags: ['intersection-observer', 'performance', 'images']
                        }
                ],
                phase3: [
                        // Phase 3: React/frameworks, state management, advanced patterns
                        {
                                id: 'web-p3-1',
                                title: 'React Component with State',
                                difficulty: 'Medium',
                                phase: 3,
                                track: 'Web Development',
                                prerequisites: ['React', 'useState', 'Components'],
                                description: 'Create a React counter component.',
                                fullDescription: 'Build a React component with useState hook that displays and updates a counter.',
                                hints: ['Use useState hook', 'Destructure state and setter', 'Update state on button click'],
                                solution_approach: 'function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>{count}</button> }',
                                tags: ['react', 'hooks', 'state']
                        },
                        {
                                id: 'web-p3-2',
                                title: 'Custom Hook for API Call',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'Web Development',
                                prerequisites: ['React hooks', 'useEffect', 'Custom hooks'],
                                description: 'Create a custom hook for fetching data.',
                                fullDescription: 'Build a reusable custom hook that handles loading, error, and data states for API calls.',
                                hints: ['Create useFetch hook', 'Use useState for data/loading/error', 'Use useEffect for fetch'],
                                solution_approach: 'function useFetch(url) { const [data, setData] = useState(null); const [loading, setLoading] = useState(true); useEffect(() => { fetch and update states }, [url]); return { data, loading, error } }',
                                tags: ['react', 'custom-hooks', 'api']
                        },
                        {
                                id: 'web-p3-3',
                                title: 'Simple State Management',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'Web Development',
                                prerequisites: ['State management', 'Pub-sub pattern', 'Design patterns'],
                                description: 'Implement a simple Redux-like state store.',
                                fullDescription: 'Create a basic state management system with store, actions, and reducers.',
                                hints: ['Create store with state', 'Implement subscribe/dispatch', 'Use reducer pattern'],
                                solution_approach: 'const store = { state: {}, listeners: [], subscribe(fn) { this.listeners.push(fn) }, dispatch(action) { this.state = reducer(this.state, action); this.listeners.forEach(fn => fn()) } }',
                                tags: ['state-management', 'patterns', 'architecture']
                        }
                ],
                phase4: [
                        // Phase 4: Testing, optimization, production
                        {
                                id: 'web-p4-1',
                                title: 'Write Component Tests',
                                difficulty: 'Medium',
                                phase: 4,
                                track: 'Web Development',
                                prerequisites: ['Jest', 'React Testing Library', 'Testing'],
                                description: 'Write tests for a React component.',
                                fullDescription: 'Create unit tests for a React component using Jest and React Testing Library.',
                                hints: ['Use render from RTL', 'Query elements with screen', 'Assert with expect'],
                                solution_approach: 'test("renders button", () => { render(<MyComponent />); expect(screen.getByText("Click")).toBeInTheDocument() })',
                                tags: ['testing', 'jest', 'react']
                        },
                        {
                                id: 'web-p4-2',
                                title: 'Bundle Size Optimization',
                                difficulty: 'Hard',
                                phase: 4,
                                track: 'Web Development',
                                prerequisites: ['Webpack', 'Code splitting', 'Dynamic imports'],
                                description: 'Optimize bundle size with code splitting.',
                                fullDescription: 'Implement dynamic imports to split code and reduce initial bundle size.',
                                hints: ['Use import() for lazy loading', 'React.lazy for components', 'Analyze bundle with tools'],
                                solution_approach: 'const HeavyComponent = React.lazy(() => import("./Heavy")); <Suspense fallback={<Loading />}><HeavyComponent /></Suspense>',
                                tags: ['optimization', 'code-splitting', 'performance']
                        }
                ]
        },

        'app-dev': {
                phase1: [
                        {
                                id: 'app-p1-1',
                                title: 'Display Text Component',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'App Development',
                                prerequisites: ['Basic components', 'Text', 'Views'],
                                description: 'Create a component that displays text.',
                                fullDescription: 'Build a simple component that displays "Hello World" text.',
                                hints: ['Use Text component', 'Wrap in View', 'Add basic styling'],
                                solution_approach: '<View><Text>Hello World</Text></View>',
                                tags: ['components', 'ui', 'basics']
                        },
                        {
                                id: 'app-p1-2',
                                title: 'Button Click Handler',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'App Development',
                                prerequisites: ['Button', 'Events', 'State'],
                                description: 'Create a button that shows an alert when clicked.',
                                fullDescription: 'Build a button component that displays an alert message on press.',
                                hints: ['Use Button or TouchableOpacity', 'Add onPress handler', 'Show Alert'],
                                solution_approach: '<Button title="Click" onPress={() => Alert.alert("Clicked!")} />',
                                tags: ['button', 'events', 'basics']
                        },
                        {
                                id: 'app-p1-3',
                                title: 'Simple List Rendering',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'App Development',
                                prerequisites: ['FlatList', 'Arrays', 'Rendering'],
                                description: 'Display a list of items from an array.',
                                fullDescription: 'Create a scrollable list that displays items from an array.',
                                hints: ['Use FlatList component', 'Provide data array', 'Define renderItem function'],
                                solution_approach: '<FlatList data={items} renderItem={({item}) => <Text>{item}</Text>} keyExtractor={(item, index) => index.toString()} />',
                                tags: ['flatlist', 'lists', 'rendering']
                        }
                ],
                phase2: [
                        {
                                id: 'app-p2-1',
                                title: 'Fetch and Display API Data',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'App Development',
                                prerequisites: ['fetch', 'useEffect', 'State'],
                                description: 'Fetch data from API and display in list.',
                                fullDescription: 'Make an API call on component mount and display the data in a FlatList.',
                                hints: ['Use useEffect for API call', 'Store data in state', 'Show loading indicator'],
                                solution_approach: 'useEffect(() => { fetch(url).then(r => r.json()).then(setData) }, []); <FlatList data={data} ... />',
                                tags: ['api', 'fetch', 'state']
                        },
                        {
                                id: 'app-p2-2',
                                title: 'Form with Validation',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'App Development',
                                prerequisites: ['TextInput', 'Validation', 'State'],
                                description: 'Create a form with input validation.',
                                fullDescription: 'Build a login form with email and password validation.',
                                hints: ['Use TextInput components', 'Validate on submit', 'Show error messages'],
                                solution_approach: 'const [email, setEmail] = useState(""); const validate = () => { if (!email.includes("@")) showError() }',
                                tags: ['forms', 'validation', 'input']
                        }
                ],
                phase3: [
                        {
                                id: 'app-p3-1',
                                title: 'Offline Data Sync',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'App Development',
                                prerequisites: ['AsyncStorage', 'Network state', 'Sync'],
                                description: 'Implement offline-first data synchronization.',
                                fullDescription: 'Store data locally and sync with server when online.',
                                hints: ['Use AsyncStorage', 'Check network state', 'Queue operations when offline'],
                                solution_approach: 'Store locally first, listen to network state, sync queue when online',
                                tags: ['offline', 'sync', 'storage']
                        }
                ],
                phase4: [
                        {
                                id: 'app-p4-1',
                                title: 'Performance Profiling',
                                difficulty: 'Hard',
                                phase: 4,
                                track: 'App Development',
                                prerequisites: ['Performance', 'Profiling tools', 'Optimization'],
                                description: 'Profile and optimize app performance.',
                                fullDescription: 'Use profiling tools to identify and fix performance bottlenecks.',
                                hints: ['Use React DevTools Profiler', 'Identify slow renders', 'Optimize with memo/useMemo'],
                                solution_approach: 'Profile renders, memoize expensive calculations, optimize list rendering',
                                tags: ['performance', 'profiling', 'optimization']
                        }
                ]
        },

        'ai-ml': {
                phase1: [
                        {
                                id: 'ai-p1-1',
                                title: 'Calculate Mean and Median',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'AI / ML',
                                prerequisites: ['Arrays', 'Math', 'Sorting'],
                                description: 'Calculate mean and median of a dataset.',
                                fullDescription: 'Given an array of numbers, calculate and return the mean and median.',
                                hints: ['Mean = sum / count', 'Median = middle value after sorting', 'Handle even/odd length'],
                                solution_approach: 'mean = sum(arr) / len(arr); sort array, median = arr[n//2] or average of two middle values',
                                tags: ['statistics', 'math', 'basics']
                        },
                        {
                                id: 'ai-p1-2',
                                title: 'Normalize Data',
                                difficulty: 'Easy',
                                phase: 1,
                                track: 'AI / ML',
                                prerequisites: ['Arrays', 'Math', 'Normalization'],
                                description: 'Normalize array values to [0, 1] range.',
                                fullDescription: 'Apply min-max normalization to scale values between 0 and 1.',
                                hints: ['Find min and max', 'Formula: (x - min) / (max - min)', 'Handle edge case when min == max'],
                                solution_approach: 'normalized = (x - min) / (max - min) for each x. Time: O(n), Space: O(n)',
                                tags: ['preprocessing', 'normalization', 'data']
                        }
                ],
                phase2: [
                        {
                                id: 'ai-p2-1',
                                title: 'Linear Regression from Scratch',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'AI / ML',
                                prerequisites: ['Gradient descent', 'Math', 'Optimization'],
                                description: 'Implement simple linear regression.',
                                fullDescription: 'Build linear regression using gradient descent from scratch.',
                                hints: ['Initialize slope and intercept', 'Calculate predictions', 'Update using gradient descent'],
                                solution_approach: 'Iteratively update m and b using gradient descent. Time: O(n × iterations)',
                                tags: ['regression', 'gradient-descent', 'ml-basics']
                        },
                        {
                                id: 'ai-p2-2',
                                title: 'K-Means Clustering',
                                difficulty: 'Medium',
                                phase: 2,
                                track: 'AI / ML',
                                prerequisites: ['Clustering', 'Distance metrics', 'Iteration'],
                                description: 'Implement K-means clustering algorithm.',
                                fullDescription: 'Cluster data points into K groups using K-means.',
                                hints: ['Initialize K centroids', 'Assign points to nearest centroid', 'Update centroids', 'Repeat until convergence'],
                                solution_approach: 'Iterative: assign points, update centroids. Time: O(n × k × iterations)',
                                tags: ['clustering', 'unsupervised', 'algorithms']
                        }
                ],
                phase3: [
                        {
                                id: 'ai-p3-1',
                                title: 'Neural Network from Scratch',
                                difficulty: 'Hard',
                                phase: 3,
                                track: 'AI / ML',
                                prerequisites: ['Neural networks', 'Backpropagation', 'Matrix operations'],
                                description: 'Build a simple neural network with backpropagation.',
                                fullDescription: 'Implement a feedforward neural network with one hidden layer.',
                                hints: ['Forward pass: compute activations', 'Backward pass: compute gradients', 'Update weights'],
                                solution_approach: 'Forward: z = Wx + b, a = activation(z). Backward: compute gradients, update weights',
                                tags: ['neural-networks', 'deep-learning', 'backprop']
                        }
                ],
                phase4: [
                        {
                                id: 'ai-p4-1',
                                title: 'Model Deployment Pipeline',
                                difficulty: 'Hard',
                                phase: 4,
                                track: 'AI / ML',
                                prerequisites: ['Deployment', 'APIs', 'Production'],
                                description: 'Deploy a trained model as an API.',
                                fullDescription: 'Create a REST API to serve predictions from a trained model.',
                                hints: ['Save trained model', 'Create Flask/FastAPI endpoint', 'Handle preprocessing', 'Return predictions'],
                                solution_approach: 'Load model, create POST endpoint, preprocess input, return prediction as JSON',
                                tags: ['deployment', 'api', 'production']
                        }
                ]
        }
};

// Helper functions
export const getAllProblems = () => {
        const allProblems = [];
        Object.values(problemsByTrack).forEach(track => {
                Object.values(track).forEach(phaseProblems => {
                        allProblems.push(...phaseProblems);
                });
        });
        return allProblems;
};

export const getProblemsByPhase = (trackKey, phase) => {
        if (!problemsByTrack[trackKey]) return [];
        const phaseKey = `phase${phase}`;
        return problemsByTrack[trackKey][phaseKey] || [];
};

export const filterProblems = (trackKey = null, phase = null, difficulty = null) => {
        let problems = [];

        if (trackKey && trackKey !== 'all') {
                // Get problems from specific track
                const track = problemsByTrack[trackKey];
                if (track) {
                        if (phase) {
                                problems = track[`phase${phase}`] || [];
                        } else {
                                Object.values(track).forEach(phaseProblems => {
                                        problems.push(...phaseProblems);
                                });
                        }
                }
        } else {
                // Get all problems
                problems = getAllProblems();
                if (phase) {
                        problems = problems.filter(p => p.phase === phase);
                }
        }

        if (difficulty && difficulty !== 'all') {
                problems = problems.filter(p => p.difficulty === difficulty);
        }

        return problems;
};
