import type { StudentState } from "../types/learning";
import avatarStudentImg from "../assets/images/avatar_student_profile_1794637083080.jpg";
import calculusCoverImg from "../assets/images/course_calculus_cover_1794637082039.jpg";
import algorithmsCoverImg from "../assets/images/course_algorithms_cover_1794637082855.jpg";
import physicsCoverImg from "../assets/images/course_physics_cover_1794637083217.jpg";

export const STUDENT_AVATAR_URL = avatarStudentImg;

export const INITIAL_DEMO_STATE: StudentState = {
  studentName: "Maya Chen",
  academicTrack: "B.S. Computer Science & Applied Math",
  streakDays: 9,
  weeklyMinutesGoal: 420,
  courses: [
    {
      id: "course-calc",
      title: "Multivariable Calculus",
      subject: "Mathematics",
      code: "MATH 241",
      instructorNote: "Vector fields & Stokes' theorem module",
      progress: 72,
      completedLessons: 13,
      totalLessons: 18,
      masteryLevel: "Strong",
      nextTopic: "Divergence Theorem & Flux Integrals",
      coverImage: calculusCoverImg,
      lastStudied: "2 hours ago",
    },
    {
      id: "course-algo",
      title: "Data Structures & Algorithms",
      subject: "Computer Science",
      code: "CS 310",
      instructorNote: "Dynamic programming & graph optimization",
      progress: 58,
      completedLessons: 11,
      totalLessons: 19,
      masteryLevel: "Developing",
      nextTopic: "Dynamic Programming State Transitions",
      coverImage: algorithmsCoverImg,
      lastStudied: "Yesterday",
    },
    {
      id: "course-phys",
      title: "Waves, Optics & Quantum Foundations",
      subject: "Physics",
      code: "PHYS 215",
      instructorNote: "Wave-particle duality & Schrödinger equation",
      progress: 44,
      completedLessons: 7,
      totalLessons: 16,
      masteryLevel: "Needs Focus",
      nextTopic: "Potential Wells & Eigenfunctions",
      coverImage: physicsCoverImg,
      lastStudied: "2 days ago",
    },
  ],
  activePathId: "path-dp",
  learningPaths: [
    {
      id: "path-dp",
      subject: "Computer Science",
      topic: "Dynamic Programming & Memoization",
      goal: "Master recurrence relations and transition tables for technical interviews and CS 310 midterms",
      pathTitle: "Mastering Dynamic Programming from Recursion to Tabulation",
      overview:
        "A progressive 3-stage curriculum bridging naive overlapping recursion, top-down memoization, bottom-up 1D/2D tabulation, and state compression.",
      createdAt: "2026-11-11",
      stages: {
        beginner: [
          {
            id: "dp-b1",
            title: "Overlapping Subproblems & Optimal Substructure",
            summary:
              "Identify when a brute-force recursion tree repeats identical work and how caching eliminates exponential branching.",
            keyConcepts: [
              "Recursion trees",
              "Time complexity reduction",
              "Base case invariants",
            ],
            estimatedMinutes: 20,
            practicePrompt:
              "Explain why naive Fibonacci takes O(2^n) time and show how a hash map reduces it to O(n).",
            completed: true,
          },
          {
            id: "dp-b2",
            title: "Top-Down Memoization Patterns",
            summary:
              "Convert standard recursive functions into memoized solutions using explicit state keys and cache lookup guards.",
            keyConcepts: ["Memo table", "State tuple", "Call stack depth"],
            estimatedMinutes: 25,
            practicePrompt:
              "Walk me through converting Climbing Stairs with variable step costs into a memoized function.",
            completed: true,
          },
        ],
        intermediate: [
          {
            id: "dp-i1",
            title: "Bottom-Up Tabulation & Dependency Order",
            summary:
              "Determine topological evaluation order to replace recursive stack frames with iterative DP arrays.",
            keyConcepts: [
              "Iteration order",
              "Transition equations",
              "0/1 Knapsack",
            ],
            estimatedMinutes: 30,
            practicePrompt:
              "Derive the 2D transition formula for 0/1 Knapsack and show why we iterate capacity backwards in 1D.",
            completed: false,
          },
          {
            id: "dp-i2",
            title: "Grid & String Edit Distance States",
            summary:
              "Model two-sequence alignments such as Longest Common Subsequence and Levenshtein Edit Distance.",
            keyConcepts: [
              "2D DP matrices",
              "Prefix alignment",
              "Backtracking optimal path",
            ],
            estimatedMinutes: 35,
            practicePrompt:
              "Step through building the DP table for Edit Distance between 'INTENTION' and 'EXECUTION'.",
            completed: false,
          },
        ],
        advanced: [
          {
            id: "dp-a1",
            title: "Space Compression & Rolling Arrays",
            summary:
              "Reduce O(N*M) memory footprints to O(min(N, M)) using two-row or single-row state overwrite techniques.",
            keyConcepts: [
              "Rolling buffer",
              "Memory locality",
              "In-place constraints",
            ],
            estimatedMinutes: 30,
            practicePrompt:
              "Show how to compress the Longest Common Subsequence table from O(mn) space to O(min(m,n)).",
            completed: false,
          },
          {
            id: "dp-a2",
            title: "Bitmask & Interval DP Formulations",
            summary:
              "Encode subset selections with bitmasks and solve partition problems over sub-intervals.",
            keyConcepts: [
              "Subset bitmasks",
              "Interval length loop",
              "Matrix chain order",
            ],
            estimatedMinutes: 40,
            practicePrompt:
              "Explain interval DP using Matrix Chain Multiplication as a step-by-step example.",
            completed: false,
          },
        ],
      },
    },
    {
      id: "path-quantum",
      subject: "Physics",
      topic: "1D Quantum Potential Wells",
      goal: "Understand boundary conditions, standing de Broglie waves, and energy quantization for PHYS 215",
      pathTitle: "Foundations of Quantum Potential Wells & Wavefunctions",
      overview:
        "Build physical intuition for probability amplitudes, boundary continuity, and discrete energy eigenvalues in bound quantum systems.",
      createdAt: "2026-11-10",
      stages: {
        beginner: [
          {
            id: "qw-b1",
            title: "Probability Density & Born's Rule",
            summary:
              "Connect complex wavefunctions ψ(x) to measurable position probabilities via |ψ(x)|² and normalization.",
            keyConcepts: [
              "Normalization integral",
              "Probability density",
              "Square-integrable functions",
            ],
            estimatedMinutes: 20,
            practicePrompt:
              "Why must a physical wavefunction vanish at infinity and integrate to 1 over all space?",
            completed: true,
          },
        ],
        intermediate: [
          {
            id: "qw-i1",
            title: "Infinite Square Well Eigenstates",
            summary:
              "Solve the time-independent Schrödinger equation inside rigid walls and see why energy levels scale as n².",
            keyConcepts: [
              "Boundary nodes",
              "Zero-point energy",
              "Orthogonal eigenfunctions",
            ],
            estimatedMinutes: 30,
            practicePrompt:
              "Derive the quantized energy formula E_n for an infinite well of width L step by step.",
            completed: false,
          },
        ],
        advanced: [
          {
            id: "qw-a1",
            title: "Finite Wells & Quantum Tunneling",
            summary:
              "Analyze exponential evanescent tails in classically forbidden regions and transmission probability.",
            keyConcepts: [
              "Continuity of ψ and ψ'",
              "Evanescent decay",
              "Barrier penetration",
            ],
            estimatedMinutes: 35,
            practicePrompt:
              "Explain intuitively and mathematically how a particle tunnels through a finite potential barrier.",
            completed: false,
          },
        ],
      },
    },
  ],
  quizHistory: [
    {
      id: "quiz-1",
      quizTitle: "Stokes' Theorem & Curl Intuition",
      subject: "Mathematics",
      topic: "Vector Calculus",
      difficulty: "intermediate",
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      weakConcepts: [],
      strongConcepts: ["Surface Orientation", "Curl Calculation", "Boundary Curves"],
      completedAt: "2026-11-13",
      durationSeconds: 245,
    },
    {
      id: "quiz-2",
      quizTitle: "Dynamic Programming Transitions",
      subject: "Computer Science",
      topic: "Dynamic Programming",
      difficulty: "intermediate",
      score: 3,
      totalQuestions: 5,
      percentage: 60,
      weakConcepts: ["1D Space Compression", "Base Case Indexing"],
      strongConcepts: ["Memoization Overhead", "Optimal Substructure"],
      completedAt: "2026-11-12",
      durationSeconds: 320,
    },
    {
      id: "quiz-3",
      quizTitle: "Wavefunctions & Infinite Square Wells",
      subject: "Physics",
      topic: "Quantum Foundations",
      difficulty: "intermediate",
      score: 2,
      totalQuestions: 5,
      percentage: 40,
      weakConcepts: [
        "Boundary Continuity",
        "Zero-Point Energy",
        "Normalization Constants",
      ],
      strongConcepts: ["de Broglie Wavelength"],
      completedAt: "2026-11-11",
      durationSeconds: 290,
    },
    {
      id: "quiz-4",
      quizTitle: "Graph Traversal & Shortest Paths",
      subject: "Computer Science",
      topic: "Graph Algorithms",
      difficulty: "beginner",
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      weakConcepts: ["Negative Edge Detection"],
      strongConcepts: ["BFS Complexity", "Dijkstra Priority Queue", "Topological Sort"],
      completedAt: "2026-11-09",
      durationSeconds: 210,
    },
    {
      id: "quiz-5",
      quizTitle: "Partial Derivatives & Gradient Vectors",
      subject: "Mathematics",
      topic: "Multivariable Derivatives",
      difficulty: "beginner",
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      weakConcepts: [],
      strongConcepts: ["Directional Derivative", "Tangent Planes", "Chain Rule"],
      completedAt: "2026-11-08",
      durationSeconds: 195,
    },
  ],
  tutorHistory: [
    {
      id: "msg-welcome-1",
      role: "assistant",
      content:
        "Welcome back, Maya. Based on your recent **Waves, Optics & Quantum Foundations** quiz (40%), we can focus on **Boundary Continuity & Normalization Constants**, or jump into **Dynamic Programming State Transitions** for CS 310.\n\nWhat would you like to unpack step by step today?",
      timestamp: "10:15 AM",
    },
  ],
  studySchedule: [
    {
      id: "sched-1",
      day: "Mon",
      timeSlot: "09:00 AM",
      title: "Infinite Square Well Normalization Practice",
      subject: "Physics",
      durationMinutes: 40,
      mode: "AI Tutor",
      completed: true,
    },
    {
      id: "sched-2",
      day: "Tue",
      timeSlot: "04:30 PM",
      title: "0/1 Knapsack Tabulation & Space Optimization",
      subject: "Computer Science",
      durationMinutes: 45,
      mode: "Learning Path",
      completed: true,
    },
    {
      id: "sched-3",
      day: "Wed",
      timeSlot: "07:00 PM",
      title: "Flux Integrals Diagnostic Quiz",
      subject: "Mathematics",
      durationMinutes: 25,
      mode: "Quiz Practice",
      completed: true,
    },
    {
      id: "sched-4",
      day: "Thu",
      timeSlot: "05:00 PM",
      title: "Quantum Boundary Conditions Checkpoint",
      subject: "Physics",
      durationMinutes: 35,
      mode: "Quiz Practice",
      completed: false,
    },
    {
      id: "sched-5",
      day: "Fri",
      timeSlot: "03:30 PM",
      title: "Edit Distance & 2D DP Grid Walkthrough",
      subject: "Computer Science",
      durationMinutes: 50,
      mode: "Learning Path",
      completed: false,
    },
    {
      id: "sched-6",
      day: "Sat",
      timeSlot: "11:00 AM",
      title: "Divergence Theorem Visual Review",
      subject: "Mathematics",
      durationMinutes: 40,
      mode: "Review",
      completed: false,
    },
  ],
  studyGoals: [
    {
      id: "goal-1",
      title: "Raise Quantum Foundations Quiz Average above 80%",
      subject: "Physics",
      targetValue: 80,
      currentValue: 40,
      unit: "%",
      dueDate: "Nov 20",
    },
    {
      id: "goal-2",
      title: "Complete Dynamic Programming Intermediate Stage",
      subject: "Computer Science",
      targetValue: 4,
      currentValue: 2,
      unit: "lessons",
      dueDate: "Nov 18",
    },
    {
      id: "goal-3",
      title: "Weekly Focused Study Target",
      subject: "All Subjects",
      targetValue: 420,
      currentValue: 305,
      unit: "min",
      dueDate: "Sun",
    },
  ],
  dailyActivity: [
    { day: "Nov 7", minutes: 38, quizzesCompleted: 1, accuracy: 80 },
    { day: "Nov 8", minutes: 52, quizzesCompleted: 1, accuracy: 100 },
    { day: "Nov 9", minutes: 44, quizzesCompleted: 1, accuracy: 80 },
    { day: "Nov 10", minutes: 30, quizzesCompleted: 0, accuracy: 76 },
    { day: "Nov 11", minutes: 55, quizzesCompleted: 1, accuracy: 40 },
    { day: "Nov 12", minutes: 46, quizzesCompleted: 1, accuracy: 60 },
    { day: "Nov 13", minutes: 60, quizzesCompleted: 1, accuracy: 100 },
  ],
  adaptiveInsight: {
    generatedAt: "2026-11-13",
    diagnosticSummary:
      "Your multivariable calculus accuracy is strong (100% across your last two assessments), while recent quiz telemetry indicates conceptual friction in Physics wavefunction normalization and CS 1D dynamic programming state compression.",
    weakAreaDiagnostics: [
      {
        topic: "Boundary Continuity & Normalization Constants",
        subject: "Physics",
        severity: "High Priority",
        rootCause:
          "Errors occurred when setting ∫|ψ(x)|² dx = 1 over asymmetric limits and matching ψ'(x) at finite well walls.",
        actionStep:
          "Work through 2 worked normalization integrals in the AI Tutor before taking an intermediate Physics checkpoint.",
      },
      {
        topic: "1D Space Compression & Base Case Indexing",
        subject: "Computer Science",
        severity: "Moderate Priority",
        rootCause:
          "Forward iteration overwrote previous row states in 0/1 Knapsack, and dp[0] initialization caused off-by-one counts.",
        actionStep:
          "Complete the Bottom-Up Tabulation lesson and trace a 4-item capacity table backwards.",
      },
    ],
    recommendedLessons: [
      {
        title: "Infinite Square Well Normalization & Boundary Nodes",
        subject: "Physics",
        topic: "Quantum Potential Wells",
        rationale: "Directly addresses your 40% score on the Quantum Foundations quiz.",
        estimatedMinutes: 25,
        recommendedMode: "tutor",
      },
      {
        title: "Bottom-Up Tabulation & Reverse Capacity Iteration",
        subject: "Computer Science",
        topic: "Dynamic Programming",
        rationale: "Builds the exact mental model needed to fix 1D DP overwrite bugs.",
        estimatedMinutes: 30,
        recommendedMode: "path",
      },
      {
        title: "Quantum Foundations Targeted Retest",
        subject: "Physics",
        topic: "Quantum Potential Wells",
        rationale: "Verify mastery of normalization constants after tutoring.",
        estimatedMinutes: 12,
        recommendedMode: "quiz",
      },
    ],
  },
};
