export const studentProfile = {
  name: "Aarav Sharma",
  role: "Student",
  branch: "B.Tech CSE",
  institution: "UIT",
  year: "2nd Year",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
  streak: 5,
  points: 2450,
  ranking: 42,
  totalStudents: 1500,
  stats: {
    totalContests: 12,
    upcomingContests: 3,
    completedContests: 9,
    currentRanking: 42
  }
};

export const performanceData = {
  // Trend of scores (percentage) over the last 6 completed contests
  scoreTrend: [
    { contest: "Contest 501", score: 70 },
    { contest: "Contest 502", score: 85 },
    { contest: "Contest 503", score: 65 },
    { contest: "Contest 504", score: 90 },
    { contest: "Contest 505", score: 75 },
    { contest: "Contest 506", score: 100 }
  ],
  // Monthly participation count
  monthlyParticipation: [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 1 },
    { month: "Mar", count: 3 },
    { month: "Apr", count: 2 },
    { month: "May", count: 4 },
    { month: "Jun", count: 5 }
  ],
  recentActivity: [
    {
      id: "act-1",
      type: "contest_complete",
      title: "Completed Weekly Contest 506",
      detail: "Scored 100/100 in Computer Networks",
      time: "1 hour ago",
      color: "emerald"
    },
    {
      id: "act-2",
      type: "registration",
      title: "Registered for Weekly Contest 507",
      detail: "Data Structures & Algorithms assessment",
      time: "3 hours ago",
      color: "indigo"
    },
    {
      id: "act-3",
      type: "problem_solved",
      title: "Solved 'Dynamic Array' challenge",
      detail: "Earned 50 bonus points",
      time: "Yesterday",
      color: "amber"
    },
    {
      id: "act-4",
      type: "badge_earned",
      title: "Earned 'Network Master' Badge",
      detail: "Achieved perfect score in CN test",
      time: "2 days ago",
      color: "violet"
    }
  ]
};

export const contestsData = [
  {
    id: "contest-507",
    title: "Weekly Contest 507",
    subject: "Data Structures & Algorithms",
    faculty: "Dr. Anirban Sen",
    difficulty: "Medium",
    duration: "60 Mins",
    durationMinutes: 60,
    totalQuestions: 5,
    totalMarks: 100,
    passingCriteria: "50% Marks (50/100)",
    startTime: "Tue, Jun 23, 11:00 AM",
    endTime: "Tue, Jun 23, 12:30 PM",
    category: "DSA",
    status: "Completed",
    participationStatus: "Participated",
    date: "2026-06-23",
    rank: 42,
    score: "85/100",
    scoreNum: 85,
    problemsSolved: 4,
    totalProblems: 5,
    performanceBadge: "Top 5%",
    description: "Assess your skills in advanced algorithms, recursive data structures, and binary search trees. Standard university guidelines apply for Unfair Means (UFM) monitoring.",
    rules: [
      "Full-screen mode is mandatory during the entire exam session.",
      "Tab switching is prohibited and will trigger automatic warnings.",
      "Leaving full-screen mode or minimizing the browser window is prohibited.",
      "Multiple browser tabs or windows are strictly not allowed.",
      "Copy, paste, cut, and right-click actions are disabled on the interface.",
      "Any unfair activity detected by the UFM system will result in instant disqualification.",
      "Once disqualified, you will be locked out and not allowed to rejoin the contest."
    ],
    questions: [
      {
        id: "q-1",
        text: "What is the worst-case time complexity of inserting a node in a balanced Red-Black Tree?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)"
        ],
        correctAnswer: 1
      },
      {
        id: "q-2",
        text: "Which of the following algorithms is best suited to find the single-source shortest path in a weighted graph that contains negative edge weights (but no negative cycles)?",
        options: [
          "Dijkstra's Algorithm",
          "Prim's Algorithm",
          "Bellman-Ford Algorithm",
          "Kruskal's Algorithm"
        ],
        correctAnswer: 2
      },
      {
        id: "q-3",
        text: "In a dynamic programming algorithm, what does the technique of 'memoization' refer to?",
        options: [
          "Storing the results of expensive function calls to return cached results when the same inputs occur again",
          "A sorting method that relies on partitioning arrays recursively",
          "The process of cleaning up memory occupied by unreferenced tree objects",
          "Re-evaluating functions repeatedly from scratch to guarantee memory safety"
        ],
        correctAnswer: 0
      },
      {
        id: "q-4",
        text: "Which data structure is primarily utilized behind the scenes when executing a Depth-First Search (DFS) traversal on a graph?",
        options: [
          "Queue (FIFO)",
          "Stack (LIFO)",
          "Hash Map",
          "Priority Queue / Min-Heap"
        ],
        correctAnswer: 1
      },
      {
        id: "q-5",
        text: "What is the maximum number of edges in a simple undirected graph with 'N' vertices?",
        options: [
          "N * (N - 1)",
          "N * (N - 1) / 2",
          "N^2",
          "2^N"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "contest-dbms",
    title: "Database Systems Quiz",
    subject: "DBMS",
    faculty: "Dr. R. K. Prasad",
    difficulty: "Medium",
    duration: "30 Mins",
    durationMinutes: 30,
    totalQuestions: 5,
    totalMarks: 50,
    passingCriteria: "50% Marks (25/50)",
    startTime: "Mon, Jun 22, 02:00 PM",
    endTime: "Mon, Jun 22, 02:30 PM",
    category: "Database",
    status: "Active",
    participationStatus: "Not Participated",
    date: "2026-06-22",
    rank: null,
    score: null,
    scoreNum: 0,
    problemsSolved: null,
    totalProblems: 5,
    performanceBadge: null,
    description: "Relational model fundamentals, schema normalization standards (1NF, 2NF, 3NF, BCNF), transaction concurrency, and SQL Joins.",
    rules: [
      "Full-screen mode is mandatory.",
      "Tab switching is prohibited."
    ],
    questions: [
      {
        id: "db-1",
        text: "Which normal form handles transitive functional dependencies?",
        options: [
          "1NF",
          "2NF",
          "3NF",
          "BCNF"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "contest-185",
    title: "Biweekly Contest 185",
    subject: "Web Development",
    faculty: "Prof. Priya Nair",
    difficulty: "Easy",
    duration: "45 Mins",
    durationMinutes: 45,
    totalQuestions: 4,
    totalMarks: 40,
    passingCriteria: "40% Marks (16/40)",
    startTime: "Fri, Jun 19, 11:03 PM",
    endTime: "Fri, Jun 19, 11:59 PM",
    status: "Upcoming",
    participationStatus: "Not Participated",
    date: "2026-06-19",
    rank: null,
    score: null,
    scoreNum: 0,
    problemsSolved: null,
    totalProblems: 4,
    performanceBadge: null,
    category: "Web Development",
    description: "Evaluates your knowledge of HTML5 structure, CSS Grid/Flexbox layouts, ES6+ Javascript syntaxes, and basic DOM manipulation.",
    rules: [
      "Full-screen mode is mandatory.",
      "Tab switching is prohibited.",
      "Copy and paste actions are disabled.",
      "Any unfair activity may result in disqualification."
    ],
    questions: [
      {
        id: "wb-1",
        text: "Which CSS property is correct for making a display box layout as a 2-dimensional grid?",
        options: [
          "display: flex;",
          "display: grid;",
          "display: block-grid;",
          "grid-template: columns;"
        ],
        correctAnswer: 1
      },
      {
        id: "wb-2",
        text: "What is the return value of 'typeof null' in standard JavaScript?",
        options: [
          "\"null\"",
          "\"undefined\"",
          "\"object\"",
          "\"function\""
        ],
        correctAnswer: 2
      },
      {
        id: "wb-3",
        text: "Which HTML5 tag is appropriate for wrapping primary site-wide navigation links?",
        options: [
          "<navigation>",
          "<links>",
          "<nav>",
          "<section id=\"nav\">"
        ],
        correctAnswer: 2
      },
      {
        id: "wb-4",
        text: "Which of the following array methods creates a new array filled with all elements that pass the test implemented by the provided function?",
        options: [
          "map()",
          "forEach()",
          "filter()",
          "find()"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "contest-506",
    title: "Weekly Contest 506",
    subject: "Computer Networks",
    faculty: "Dr. Anirban Sen",
    difficulty: "Hard",
    duration: "90 Mins",
    durationMinutes: 90,
    totalQuestions: 4,
    totalMarks: 100,
    passingCriteria: "50% Marks (50/100)",
    startTime: "Mon, Jun 15, 11:03 PM",
    endTime: "Mon, Jun 15, 11:59 PM",
    category: "Java",
    status: "Completed",
    participationStatus: "Participated",
    date: "2026-06-15",
    rank: 12,
    score: "100/100",
    scoreNum: 100,
    problemsSolved: 4,
    totalProblems: 4,
    performanceBadge: "Top 1%",
    description: "Covers TCP/IP model protocols, Sliding Window sequence tracking, CIDR subnet routing calculations, and security configurations.",
    rules: []
  },
  {
    id: "contest-184",
    title: "Biweekly Contest 184",
    subject: "Data Structures & Algorithms",
    faculty: "Prof. Priya Nair",
    difficulty: "Medium",
    duration: "90 Mins",
    durationMinutes: 90,
    totalQuestions: 4,
    totalMarks: 100,
    passingCriteria: "50% Marks (50/100)",
    startTime: "Fri, Jun 12, 11:03 PM",
    endTime: "Fri, Jun 12, 11:59 PM",
    category: "DSA",
    status: "Completed",
    participationStatus: "Participated",
    date: "2026-06-12",
    rank: 88,
    score: "80/100",
    scoreNum: 80,
    problemsSolved: 3,
    totalProblems: 4,
    performanceBadge: "Top 10%",
    description: "A practical exam covering AVL Tree rotations, Dijkstra's algorithm, and Heap Sort operations.",
    rules: []
  },
  {
    id: "contest-505",
    title: "Weekly Contest 505",
    subject: "Operating Systems",
    faculty: "Dr. R. K. Prasad",
    difficulty: "Hard",
    duration: "90 Mins",
    durationMinutes: 90,
    totalQuestions: 5,
    totalMarks: 100,
    passingCriteria: "50% Marks (50/100)",
    startTime: "Mon, Jun 8, 11:03 PM",
    endTime: "Mon, Jun 8, 11:59 PM",
    status: "Completed",
    participationStatus: "Participated",
    date: "2026-06-08",
    rank: 145,
    score: "75/100",
    scoreNum: 75,
    problemsSolved: 3,
    totalProblems: 5,
    performanceBadge: "Top 15%",
    description: "Covers Semaphores, Readers-Writers synchronization, CPU scheduling, and LRU Page replacement algorithm details.",
    rules: []
  },
  {
    id: "contest-java-new",
    title: "Java OOPs Paradigm Challenge",
    subject: "Java OOPs Concepts",
    faculty: "Prof. Priya Nair",
    difficulty: "Medium",
    duration: "45 Mins",
    durationMinutes: 45,
    totalQuestions: 4,
    totalMarks: 40,
    passingCriteria: "50% Marks (20/40)",
    startTime: "Wed, Jun 24, 02:00 PM",
    endTime: "Wed, Jun 24, 03:00 PM",
    category: "Java",
    status: "Upcoming",
    participationStatus: "Not Participated",
    date: "2026-06-24",
    description: "Assess your concepts in Inheritance, Polymorphism, Encapsulation, Abstraction, Interfaces, and Exception Handling.",
    rules: ["Full-screen mode is mandatory.", "Tab switching is prohibited."]
  },
  {
    id: "contest-aptitude-new",
    title: "Quantitative Aptitude Assessment",
    subject: "General Aptitude",
    faculty: "Dr. R. K. Prasad",
    difficulty: "Easy",
    duration: "30 Mins",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 50,
    passingCriteria: "50% Marks (25/50)",
    startTime: "Tue, Jun 23, 04:00 PM",
    endTime: "Tue, Jun 23, 04:30 PM",
    category: "Aptitude",
    status: "Active",
    participationStatus: "Not Participated",
    date: "2026-06-23",
    description: "A fast-paced test evaluating logical reasoning, numerical analysis, probability, permutations, and time-work problems.",
    rules: ["Full-screen mode is mandatory."]
  }
];
