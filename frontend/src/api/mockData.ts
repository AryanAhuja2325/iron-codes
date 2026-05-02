export const mockProblems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    tags: ["array", "hashmap"],
    status: "Solved"
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "medium",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]."
    ],
    tags: ["linked-list", "math"],
    status: "Attempted"
  },
  {
    id: "3",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000"
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n"
    ],
    tags: ["array", "binary-search", "divide-and-conquer"],
    status: "Todo"
  }
];

export const mockDashboardStats = {
  problemsSolved: 42,
  streak: 7,
  accuracy: 85,
  submissionsOverTime: [
    { name: "Mon", submissions: 4 },
    { name: "Tue", submissions: 3 },
    { name: "Wed", submissions: 7 },
    { name: "Thu", submissions: 2 },
    { name: "Fri", submissions: 8 },
    { name: "Sat", submissions: 12 },
    { name: "Sun", submissions: 10 },
  ]
};
