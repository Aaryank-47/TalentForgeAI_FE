import type { DSAProblem, MockExecutionResult } from '../types/assessment';

// Force dev server cache invalidate
// Complete mock DSA Problems
export const mockDsaProblems: DSAProblem[] = [
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
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    hiddenTestCases: [
      { input: 'nums = [3,3], target = 6', output: '[0,1]', isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        seen = {}
        for i, num in enumerate(nums):
            remaining = target - num
            if remaining in seen:
                return [seen[remaining], i]
            seen[num] = i`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`
    }
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
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    hiddenTestCases: [
      { input: 's = "{[]}"', output: 'true', isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const mapping = { ")": "(", "}": "{", "]": "[" };
    for (let char of s) {
        if (mapping[char]) {
            const top = stack.pop() || '#';
            if (top !== mapping[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                char top = st.top();
                st.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return st.empty();
    }
};`
    }
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
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    hiddenTestCases: [
      { input: 's = "pwwkew"', output: '3', isHidden: true }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let maxLen = 0, start = 0;
    const map = {};
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (map[char] !== undefined && map[char] >= start) {
            start = map[char] + 1;
        }
        map[char] = i;
        maxLen = Math.max(maxLen, i - start + 1);
    }
    return maxLen;
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        max_len = start = 0
        for i, char in enumerate(s):
            if char in char_map and char_map[char] >= start:
                start = char_map[char] + 1
            char_map[char] = i
            max_len = max(max_len, i - start + 1)
        return max_len`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLen = 0, start = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (map.containsKey(c) && map.get(c) >= start) {
                start = map.get(c) + 1;
            }
            map.put(c, i);
            maxLen = Math.max(maxLen, i - start + 1);
        }
        return maxLen;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLen = 0, start = 0;
        unordered_map<char, int> map;
        for (int i = 0; i < s.length(); i++) {
            char c = s[i];
            if (map.find(c) != map.end() && map[c] >= start) {
                start = map[c] + 1;
            }
            map[c] = i;
            maxLen = max(maxLen, i - start + 1);
        }
        return maxLen;
    }
};`
    }
  }
];

// Simulates running user code on selected problem
export const runMockCode = async (
  problemId: string,
  language: string,
  userCode: string,
  customInput?: string
): Promise<MockExecutionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Determine if code is empty or has trivial length
  if (!userCode || userCode.trim().length < 50) {
    return {
      type: 'error',
      message: 'Compilation Error: Syntax Error',
      detail: 'Details: Line 5: Unexpected token or empty declaration.\nPlease make sure your starter function is correctly declared and complete.',
      passedCount: 0,
      totalCount: 3,
      runtimeMs: 0,
      memoryMb: 0
    };
  }

  // Simulate a custom input compile run
  if (customInput) {
    return {
      type: 'success',
      message: 'Run Completed successfully',
      detail: `Custom Input: ${customInput}\nYour Output: ${customInput.trim().split(/\s+/).reverse().join(' ')}\nExpected Output: ${customInput}`,
      passedCount: 1,
      totalCount: 1,
      runtimeMs: 42,
      memoryMb: 35.6
    };
  }

  // Normal test cases
  return {
    type: 'success',
    message: 'All visible test cases passed!',
    detail: 'Runtime: 48 ms\nMemory: 41.22 MB',
    passedCount: 3,
    totalCount: 3,
    runtimeMs: 48,
    memoryMb: 41.22
  };
};

// Simulates full test case submission (including hidden test cases)
export const submitMockCode = async (
  problemId: string,
  language: string,
  userCode: string
): Promise<MockExecutionResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  if (!userCode || userCode.trim().length < 60) {
    return {
      type: 'error',
      message: 'Runtime Error: NullPointerException',
      detail: 'Stacktrace: at Solution.twoSum(Solution.java:12)\nat Main.main(Main.java:23)',
      passedCount: 0,
      totalCount: 10,
      runtimeMs: 0,
      memoryMb: 0
    };
  }

  // Randomize some passes to look highly dynamic, but mostly succeed
  const roll = Math.random();
  if (roll > 0.8) {
    return {
      type: 'success',
      message: 'Passed 8 / 10 Testcases',
      detail: 'Runtime: 56 ms\nMemory: 42.1 MB\nTest Case 9 Failed: Time Limit Exceeded.',
      passedCount: 8,
      totalCount: 10,
      runtimeMs: 56,
      memoryMb: 42.1
    };
  }

  return {
    type: 'success',
    message: 'Passed 10 / 10 Testcases',
    detail: 'Runtime: 62 ms\nMemory: 45.12 MB\nCongratulations! All test cases passed.',
    passedCount: 10,
    totalCount: 10,
    runtimeMs: 62,
    memoryMb: 45.12
  };
};
