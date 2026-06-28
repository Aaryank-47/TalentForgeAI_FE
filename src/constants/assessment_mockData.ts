// ─────────────────────────────────────────────────────────────
// TalentForge AI — Assessment Module Mock Data
// ─────────────────────────────────────────────────────────────
import type {
  MCQQuestion, DSAProblem, AssessmentTemplate, CandidateAttempt, Assessment
} from '../types/assessment';

// ─── MCQ Categories ───────────────────────────────────────────
export const MCQ_CATEGORIES = [
  'Arrays', 'Strings', 'OOP', 'DBMS', 'Operating System',
  'Networking', 'Aptitude', 'JavaScript', 'React', 'Node',
  'MongoDB', 'SQL', 'HR',
];

// ─── DSA Categories ───────────────────────────────────────────
export const DSA_CATEGORIES = [
  'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
  'Binary Tree', 'BST', 'Graph', 'Heap', 'Dynamic Programming',
  'Backtracking', 'Recursion', 'Sliding Window', 'Greedy', 'Trie', 'Bit Manipulation',
];

// ─── Supported Languages ──────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
];

// ─── MCQ Questions ────────────────────────────────────────────
export const mockMCQQuestions: MCQQuestion[] = [
  {
    id: 'mcq-1', category: 'JavaScript', difficulty: 'Easy', marks: 2,
    question: 'What is the output of `typeof null` in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"string"'],
    correctAnswer: 2,
    explanation: 'Due to a historical bug in JavaScript, typeof null returns "object".',
    tags: ['javascript', 'types'],
  },
  {
    id: 'mcq-2', category: 'JavaScript', difficulty: 'Medium', marks: 3,
    question: 'Which of the following correctly describes the event loop in JavaScript?',
    options: [
      'It runs on a separate thread from the main JavaScript engine',
      'It processes callbacks from the callback queue when the call stack is empty',
      'It executes Promise callbacks before setTimeout callbacks always',
      'It is only available in Node.js, not in browsers',
    ],
    correctAnswer: 1,
    tags: ['javascript', 'async', 'event loop'],
  },
  {
    id: 'mcq-3', category: 'React', difficulty: 'Medium', marks: 3,
    question: 'What is the purpose of the `useCallback` hook in React?',
    options: [
      'It memoizes the return value of a function',
      'It memoizes a function reference to prevent unnecessary re-renders',
      'It replaces useState for complex state logic',
      'It is used for side effects in functional components',
    ],
    correctAnswer: 1,
    tags: ['react', 'hooks', 'performance'],
  },
  {
    id: 'mcq-4', category: 'React', difficulty: 'Hard', marks: 5,
    question: 'In React 18, what is the behavior of `startTransition`?',
    options: [
      'It defers state updates to improve responsiveness for urgent updates',
      'It starts a CSS transition on a React element',
      'It delays component mounting by one tick',
      'It batches all state updates synchronously',
    ],
    correctAnswer: 0,
    tags: ['react', 'concurrent', 'react18'],
  },
  {
    id: 'mcq-5', category: 'Arrays', difficulty: 'Easy', marks: 2,
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 2,
    tags: ['arrays', 'complexity'],
  },
  {
    id: 'mcq-6', category: 'Arrays', difficulty: 'Medium', marks: 3,
    question: 'Which algorithm has the best average-case time complexity for sorting?',
    options: ['Bubble Sort O(n²)', 'Merge Sort O(n log n)', 'Selection Sort O(n²)', 'Insertion Sort O(n²)'],
    correctAnswer: 1,
    tags: ['arrays', 'sorting'],
  },
  {
    id: 'mcq-7', category: 'OOP', difficulty: 'Easy', marks: 2,
    question: 'Which of the following is NOT a pillar of Object-Oriented Programming?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
    correctAnswer: 2,
    tags: ['oop', 'fundamentals'],
  },
  {
    id: 'mcq-8', category: 'OOP', difficulty: 'Medium', marks: 3,
    question: 'What does the Liskov Substitution Principle state?',
    options: [
      'Objects of a superclass shall be replaceable with objects of subclasses without affecting correctness',
      'A class should have only one reason to change',
      'Depend on abstractions, not concretions',
      'Classes should be open for extension but closed for modification',
    ],
    correctAnswer: 0,
    tags: ['oop', 'solid'],
  },
  {
    id: 'mcq-9', category: 'SQL', difficulty: 'Easy', marks: 2,
    question: 'Which SQL clause is used to filter rows based on a condition?',
    options: ['ORDER BY', 'GROUP BY', 'HAVING', 'WHERE'],
    correctAnswer: 3,
    tags: ['sql', 'fundamentals'],
  },
  {
    id: 'mcq-10', category: 'SQL', difficulty: 'Medium', marks: 3,
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: [
      'INNER JOIN returns all rows from both tables; LEFT JOIN only from the left',
      'INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from left table plus matching from right',
      'They are identical in functionality',
      'LEFT JOIN is faster than INNER JOIN in all cases',
    ],
    correctAnswer: 1,
    tags: ['sql', 'joins'],
  },
  {
    id: 'mcq-11', category: 'DBMS', difficulty: 'Medium', marks: 3,
    question: 'What is a deadlock in database systems?',
    options: [
      'When a transaction fails due to a constraint violation',
      'When two or more transactions wait indefinitely for each other to release locks',
      'When the database server runs out of memory',
      'When an index becomes corrupted',
    ],
    correctAnswer: 1,
    tags: ['dbms', 'transactions'],
  },
  {
    id: 'mcq-12', category: 'Node', difficulty: 'Medium', marks: 3,
    question: 'What is the purpose of `process.nextTick()` in Node.js?',
    options: [
      'It schedules a callback to be invoked at the next iteration of the event loop before I/O events',
      'It moves to the next line of code synchronously',
      'It is equivalent to setTimeout(fn, 0)',
      'It triggers garbage collection',
    ],
    correctAnswer: 0,
    tags: ['node', 'event loop'],
  },
  {
    id: 'mcq-13', category: 'MongoDB', difficulty: 'Easy', marks: 2,
    question: 'What is the default data format used by MongoDB to store documents?',
    options: ['XML', 'CSV', 'BSON', 'JSON'],
    correctAnswer: 2,
    tags: ['mongodb', 'fundamentals'],
  },
  {
    id: 'mcq-14', category: 'Networking', difficulty: 'Medium', marks: 3,
    question: 'Which HTTP status code indicates that a resource was not found?',
    options: ['200', '403', '404', '500'],
    correctAnswer: 2,
    tags: ['networking', 'http'],
  },
  {
    id: 'mcq-15', category: 'Operating System', difficulty: 'Medium', marks: 3,
    question: 'What is a race condition in operating systems?',
    options: [
      'A CPU optimization technique for sequential tasks',
      'A situation where the outcome depends on the relative timing of events such as thread execution order',
      'An algorithm for fair CPU scheduling',
      'A memory allocation strategy',
    ],
    correctAnswer: 1,
    tags: ['os', 'concurrency'],
  },
  {
    id: 'mcq-16', category: 'Strings', difficulty: 'Easy', marks: 2,
    question: 'What does the `indexOf` method return if the substring is not found?',
    options: ['0', 'null', '-1', 'undefined'],
    correctAnswer: 2,
    tags: ['strings', 'javascript'],
  },
  {
    id: 'mcq-17', category: 'Aptitude', difficulty: 'Medium', marks: 3,
    question: 'A train travels 360 km in 4 hours. What is its speed?',
    options: ['80 km/h', '90 km/h', '100 km/h', '70 km/h'],
    correctAnswer: 1,
    tags: ['aptitude', 'speed'],
  },
  {
    id: 'mcq-18', category: 'HR', difficulty: 'Easy', marks: 1,
    question: 'Which of the following best describes "active listening"?',
    options: [
      'Interrupting the speaker to clarify points',
      'Fully concentrating, understanding, responding, and remembering what is being said',
      'Listening while multitasking',
      'Only listening when it is relevant to you',
    ],
    correctAnswer: 1,
    tags: ['hr', 'soft skills'],
  },
  {
    id: 'mcq-19', category: 'JavaScript', difficulty: 'Hard', marks: 5,
    question: 'What is the output of: `[1,2,3].reduce((acc,val) => acc + val, 10)`?',
    options: ['6', '16', '10', 'NaN'],
    correctAnswer: 1,
    tags: ['javascript', 'array methods'],
  },
  {
    id: 'mcq-20', category: 'React', difficulty: 'Easy', marks: 2,
    question: 'Which hook should you use to perform side effects in a React functional component?',
    options: ['useState', 'useEffect', 'useRef', 'useContext'],
    correctAnswer: 1,
    tags: ['react', 'hooks'],
  },
  {
    id: 'mcq-21', category: 'OOP', difficulty: 'Hard', marks: 5,
    question: 'What is the difference between composition and inheritance in OOP?',
    options: [
      'They are functionally equivalent',
      'Inheritance models "is-a" relationships; Composition models "has-a" relationships and is generally preferred for flexibility',
      'Composition is only available in statically typed languages',
      'Inheritance is always preferred over composition for code reuse',
    ],
    correctAnswer: 1,
    tags: ['oop', 'design patterns'],
  },
  {
    id: 'mcq-22', category: 'SQL', difficulty: 'Hard', marks: 5,
    question: 'What is the purpose of database normalization?',
    options: [
      'To increase redundancy for fault tolerance',
      'To organize data to minimize redundancy and improve data integrity',
      'To improve read performance by denormalizing data',
      'To convert all columns to the same data type',
    ],
    correctAnswer: 1,
    tags: ['sql', 'normalization'],
  },
  {
    id: 'mcq-23', category: 'Node', difficulty: 'Hard', marks: 5,
    question: 'What is the purpose of clustering in Node.js?',
    options: [
      'To run multiple Node processes sharing the same port to utilize multiple CPU cores',
      'To group related modules together',
      'To cache frequently accessed data',
      'To compress HTTP responses',
    ],
    correctAnswer: 0,
    tags: ['node', 'performance', 'clustering'],
  },
  {
    id: 'mcq-24', category: 'Networking', difficulty: 'Hard', marks: 5,
    question: 'What is the difference between TCP and UDP?',
    options: [
      'TCP is faster; UDP is more reliable',
      'TCP provides reliable, ordered, error-checked delivery; UDP is connectionless and faster but unreliable',
      'They are the same protocol with different names',
      'UDP is used for web traffic; TCP for real-time applications',
    ],
    correctAnswer: 1,
    tags: ['networking', 'protocols'],
  },
  {
    id: 'mcq-25', category: 'Aptitude', difficulty: 'Hard', marks: 5,
    question: 'If the compound interest on ₹8000 for 2 years at 10% per annum is?',
    options: ['₹1600', '₹1680', '₹1800', '₹2000'],
    correctAnswer: 1,
    tags: ['aptitude', 'interest'],
  },
];

// ─── DSA Problems ─────────────────────────────────────────────
export const mockDSAProblems: DSAProblem[] = [
  {
    id: 'dsa-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    timeLimit: '20 min',
    points: 10,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    hiddenTestCases: [
      { input: 'nums = [3,3], target = 6', output: '[0,1]', isHidden: true },
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    timeLimit: '20 min',
    points: 10,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only \'()[]{}\'.'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    hiddenTestCases: [
      { input: 's = "{[]}"', output: 'true', isHidden: true },
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    timeLimit: '30 min',
    points: 20,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    hiddenTestCases: [
      { input: 's = ""', output: '0', isHidden: true },
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-4',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Binary Tree',
    timeLimit: '30 min',
    points: 20,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 ≤ Node.val ≤ 1000'],
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `/**\n * @param {TreeNode} root\n * @return {number[][]}\n */\nvar levelOrder = function(root) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-5',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    category: 'Heap',
    timeLimit: '45 min',
    points: 30,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `You are given an array of \`k\` linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    constraints: ['k == lists.length', '0 ≤ k ≤ 10⁴', '0 ≤ lists[i].length ≤ 500', '-10⁴ ≤ lists[i][j] ≤ 10⁴'],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nvar mergeKLists = function(lists) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-6',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    timeLimit: '35 min',
    points: 20,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ - 1', '0 ≤ amount ≤ 10⁴'],
    examples: [
      { input: 'coins = [1,5,11], amount = 11', output: '1', explanation: '11 = 11' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nvar coinChange = function(coins, amount) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-7',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graph',
    timeLimit: '30 min',
    points: 20,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] is \'0\' or \'1\''],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your solution here\n};\n`,
      python: `class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        # Write your solution here\n        pass\n`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution here\n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your solution here\n    }\n};\n`,
    },
  },
  {
    id: 'dsa-8',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Trie',
    timeLimit: '40 min',
    points: 25,
    supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
    statement: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.

Implement the Trie class:
- \`Trie()\` Initializes the trie object.
- \`void insert(String word)\` Inserts the string word into the trie.
- \`boolean search(String word)\` Returns true if the string word is in the trie.
- \`boolean startsWith(String prefix)\` Returns true if there is a previously inserted string that has the prefix prefix.`,
    constraints: ['1 ≤ word.length, prefix.length ≤ 2000', 'word and prefix consist only of lowercase English letters.', 'At most 3 × 10⁴ calls in total to insert, search, and startsWith.'],
    examples: [
      {
        input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',
        output: '[null,null,true,false,true,null,true]',
      },
    ],
    hiddenTestCases: [],
    starterCode: {
      javascript: `class Trie {\n    constructor() {\n        // Initialize your trie here\n    }\n\n    /** @param {string} word @return {void} */\n    insert(word) {\n        // Write your solution here\n    }\n\n    /** @param {string} word @return {boolean} */\n    search(word) {\n        // Write your solution here\n    }\n\n    /** @param {string} prefix @return {boolean} */\n    startsWith(prefix) {\n        // Write your solution here\n    }\n}\n`,
      python: `class Trie:\n\n    def __init__(self):\n        pass\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        pass\n\n    def startsWith(self, prefix: str) -> bool:\n        pass\n`,
      java: `class Trie {\n\n    public Trie() {}\n\n    public void insert(String word) {}\n\n    public boolean search(String word) { return false; }\n\n    public boolean startsWith(String prefix) { return false; }\n}\n`,
      cpp: `class Trie {\npublic:\n    Trie() {}\n\n    void insert(string word) {}\n\n    bool search(string word) { return false; }\n\n    bool startsWith(string prefix) { return false; }\n};\n`,
    },
  },
];

// ─── Assessment Templates ─────────────────────────────────────
export const mockAssessmentTemplates: AssessmentTemplate[] = [
  {
    id: 'tpl-1', name: 'Frontend Developer MCQ', type: 'mcq',
    description: 'Standard MCQ assessment covering HTML, CSS, JavaScript, and React fundamentals.',
    icon: '📋', tags: ['Frontend', 'React', 'JavaScript'], estimatedDuration: '45 min', questionCount: 30, difficulty: 'Medium',
  },
  {
    id: 'tpl-2', name: 'DSA Fundamentals', type: 'dsa',
    description: 'Classic DSA problems testing arrays, strings, and basic data structures.',
    icon: '🧩', tags: ['DSA', 'Arrays', 'Strings'], estimatedDuration: '60 min', questionCount: 3, difficulty: 'Easy',
  },
  {
    id: 'tpl-3', name: 'Full Stack Assessment', type: 'mixed',
    description: 'Combined MCQ + DSA covering both theoretical knowledge and coding ability.',
    icon: '⚡', tags: ['Full Stack', 'MCQ', 'DSA'], estimatedDuration: '90 min', questionCount: 35, difficulty: 'Medium',
  },
  {
    id: 'tpl-4', name: 'Live Coding Interview', type: 'live_machine_coding',
    description: 'Real-time collaborative coding session with the recruiter.',
    icon: '💻', tags: ['Live', 'Coding', 'Interview'], estimatedDuration: '60 min', questionCount: 1, difficulty: 'Medium',
  },
  {
    id: 'tpl-5', name: 'Take-Home Project', type: 'project',
    description: 'A comprehensive take-home assignment with a 3-day deadline.',
    icon: '🏗️', tags: ['Project', 'Assignment', 'Portfolio'], estimatedDuration: '3 days', questionCount: 1, difficulty: 'Hard',
  },
];

// ─── Mock Candidate Attempts ──────────────────────────────────
export const mockCandidateAttempts: CandidateAttempt[] = [
  {
    id: 'att-1', assessmentId: 'asmnt-1', assessmentName: 'Frontend Developer MCQ',
    candidateId: 'cand-1', candidateName: 'Arjun Mehta', status: 'submitted',
    startedAt: '2026-06-25T09:00:00Z', submittedAt: '2026-06-25T09:42:00Z',
    score: 72, totalMarks: 100, violations: [], answers: {}, timeSpent: 2520,
  },
  {
    id: 'att-2', assessmentId: 'asmnt-2', assessmentName: 'DSA Fundamentals',
    candidateId: 'cand-2', candidateName: 'Priya Sharma', status: 'in_progress',
    startedAt: '2026-06-28T08:00:00Z', totalMarks: 60,
    violations: [{ type: 'tab_switch', timestamp: '2026-06-28T08:12:00Z', severity: 'low' }],
    answers: {}, timeSpent: 1200,
  },
  {
    id: 'att-3', assessmentId: 'asmnt-3', assessmentName: 'Take-Home Project',
    candidateId: 'cand-3', candidateName: 'Rahul Verma', status: 'pending',
    totalMarks: 100, violations: [], answers: {},
  },
];

// ─── Mock Full Assessments ────────────────────────────────────
export const mockFullAssessments: Assessment[] = [
  {
    id: 'asmnt-1',
    name: 'Frontend Developer MCQ',
    description: 'Comprehensive MCQ covering HTML, CSS, JavaScript, and React.',
    type: 'mcq',
    instructions: 'Read each question carefully. You have 45 minutes to complete this assessment. Do not switch tabs.',
    status: 'active',
    createdBy: 'Sarah Johnson',
    createdAt: '2026-06-10T10:00:00Z',
    startDate: '2026-06-15T00:00:00Z',
    endDate: '2026-07-15T23:59:59Z',
    maxAttempts: 1,
    settings: {
      passingPercentage: 70,
      totalMarks: 100,
      totalQuestions: 30,
      duration: 45,
      shuffleQuestions: true,
      shuffleOptions: true,
      allowNavigation: true,
      autoSubmit: true,
      calculatorAllowed: false,
      fullscreenRequired: true,
      cameraRequired: true,
      screenSharingRequired: false,
    },
    mcqConfig: {
      totalQuestions: 30,
      marksPerQuestion: 3,
      negativeMarking: 0,
      passingScore: 70,
      timeLimit: 45,
      selectedQuestionIds: mockMCQQuestions.slice(0, 10).map(q => q.id),
    },
  },
  {
    id: 'asmnt-2',
    name: 'DSA Fundamentals Challenge',
    description: 'Solve classic DSA problems to demonstrate algorithmic thinking.',
    type: 'dsa',
    instructions: 'You will be given 3 coding problems. Write clean, efficient code. No internet access during the exam.',
    status: 'active',
    createdBy: 'Rahul Gupta',
    createdAt: '2026-06-12T10:00:00Z',
    maxAttempts: 2,
    settings: {
      passingPercentage: 60,
      totalMarks: 60,
      totalQuestions: 3,
      duration: 90,
      shuffleQuestions: false,
      shuffleOptions: false,
      allowNavigation: true,
      autoSubmit: true,
      calculatorAllowed: false,
      fullscreenRequired: true,
      cameraRequired: true,
      screenSharingRequired: true,
    },
    dsaConfig: {
      numberOfQuestions: 3,
      totalDuration: 90,
      passingScore: 60,
      marksPerQuestion: 20,
      selectedProblemIds: ['dsa-1', 'dsa-2', 'dsa-3'],
    },
  },
  {
    id: 'asmnt-3',
    name: 'Full Stack Take-Home Project',
    description: 'Build a full-stack todo app with React + Node.js + MongoDB.',
    type: 'project',
    instructions: 'You have 3 days to complete the assignment. Submit via GitHub.',
    status: 'active',
    createdBy: 'Ananya Patel',
    createdAt: '2026-06-20T10:00:00Z',
    maxAttempts: 1,
    settings: {
      passingPercentage: 70,
      totalMarks: 100,
      totalQuestions: 1,
      duration: 4320,
      shuffleQuestions: false,
      shuffleOptions: false,
      allowNavigation: true,
      autoSubmit: false,
      calculatorAllowed: false,
      fullscreenRequired: false,
      cameraRequired: false,
      screenSharingRequired: false,
    },
    projectConfig: {
      title: 'Full-Stack Todo Application',
      description: 'Build a production-ready todo application with full CRUD operations.',
      requirements: `## Requirements\n\n### Frontend (React + TypeScript)\n- Create, Read, Update, Delete todos\n- Filter by status (All, Active, Completed)\n- Responsive UI\n\n### Backend (Node.js + Express)\n- REST API with proper status codes\n- Input validation\n- Error handling middleware\n\n### Database (MongoDB)\n- Mongoose schema with timestamps\n- Proper indexing`,
      techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
      difficulty: 'Medium',
      maximumMarks: 100,
      deadlineDays: 3,
      submissionTypes: ['github', 'live_url', 'documentation'],
    },
  },
];
