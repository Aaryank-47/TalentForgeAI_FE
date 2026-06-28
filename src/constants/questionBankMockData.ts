import type { AIInterviewQuestion, MCQQuestion, DSAQuestion } from '../types/question.types';

export const aiQuestions: AIInterviewQuestion[] = [
  {
    id: 'ai-1',
    text: 'Describe a time when you had to resolve a conflict within your team.',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['conflict-resolution', 'teamwork'],
    expectedTimeMinutes: 3,
    source: 'library',
  },
  {
    id: 'ai-2',
    text: 'How do you approach a system design problem where requirements are ambiguous?',
    category: 'technical',
    difficulty: 'hard',
    tags: ['system-design', 'ambiguity'],
    expectedTimeMinutes: 5,
    source: 'library',
  }
];

export const mcqQuestions: MCQQuestion[] = [
  {
    id: 'mcq-1',
    question: 'What is the time complexity of searching in a perfectly balanced binary search tree?',
    category: 'technical',
    difficulty: 'easy',
    tags: ['data-structures', 'trees'],
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
    marks: 1,
    negativeMarks: 0.25,
    timeLimit: 60,
  },
  {
    id: 'mcq-2',
    question: 'Which HTTP status code is used for a successful resource creation?',
    category: 'technical',
    difficulty: 'easy',
    tags: ['web', 'http'],
    options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
    correctAnswer: 1,
    marks: 1,
    negativeMarks: 0,
    timeLimit: 30,
  }
];

export const dsaQuestions: DSAQuestion[] = [
  {
    id: 'dsa-1',
    title: 'Two Sum',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    category: 'technical',
    difficulty: 'easy',
    tags: ['arrays', 'hash-table'],
    constraints: '- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    hiddenTestCases: [
      { input: '[3,2,4]\n6', output: '[1,2]' },
      { input: '[3,3]\n6', output: '[0,1]' }
    ],
    visibleTestCases: [
      { input: '[2,7,11,15]\n9', output: '[0,1]' }
    ],
    memoryLimit: '256MB',
    timeLimit: '2s',
    expectedComplexity: 'Time: O(n), Space: O(n)',
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // your code here\n}',
      python: 'def twoSum(nums, target):\n    # your code here\n    pass'
    },
    supportedLanguages: ['javascript', 'python', 'java', 'cpp']
  }
];
