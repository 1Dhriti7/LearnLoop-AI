export type PageId =
  | "dashboard"
  | "tutor"
  | "learning-path"
  | "quiz"
  | "adaptive"
  | "planner"
  | "analytics";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type TutorStyle = "intuitive" | "step-by-step" | "exam-prep";

export interface Course {
  id: string;
  title: string;
  subject: string;
  code: string;
  instructorNote: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  masteryLevel: "Strong" | "Developing" | "Needs Focus";
  nextTopic: string;
  coverImage: string;
  lastStudied: string;
}

export interface PathLesson {
  id: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  estimatedMinutes: number;
  practicePrompt: string;
  completed: boolean;
}

export interface LearningPath {
  id: string;
  subject: string;
  topic: string;
  goal: string;
  pathTitle: string;
  overview: string;
  createdAt: string;
  stages: {
    beginner: PathLesson[];
    intermediate: PathLesson[];
    advanced: PathLesson[];
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface QuizAttempt {
  id: string;
  quizTitle: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakConcepts: string[];
  strongConcepts: string[];
  completedAt: string;
  durationSeconds: number;
}

export interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StudyBlock {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  timeSlot: string;
  title: string;
  subject: string;
  durationMinutes: number;
  mode: "AI Tutor" | "Learning Path" | "Quiz Practice" | "Review";
  completed: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: string;
}

export interface DailyActivity {
  day: string;
  minutes: number;
  quizzesCompleted: number;
  accuracy: number;
}

export interface WeakAreaDiagnostic {
  topic: string;
  subject: string;
  severity: string;
  rootCause: string;
  actionStep: string;
}

export interface RecommendedLesson {
  title: string;
  subject: string;
  topic: string;
  rationale: string;
  estimatedMinutes: number;
  recommendedMode: "tutor" | "quiz" | "path";
}

export interface AdaptiveInsight {
  generatedAt: string;
  diagnosticSummary: string;
  weakAreaDiagnostics: WeakAreaDiagnostic[];
  recommendedLessons: RecommendedLesson[];
}

export interface StudentState {
  studentName: string;
  academicTrack: string;
  streakDays: number;
  weeklyMinutesGoal: number;
  courses: Course[];
  learningPaths: LearningPath[];
  activePathId: string;
  quizHistory: QuizAttempt[];
  tutorHistory: TutorMessage[];
  studySchedule: StudyBlock[];
  studyGoals: StudyGoal[];
  dailyActivity: DailyActivity[];
  adaptiveInsight: AdaptiveInsight;
}

export interface NavigationPrefill {
  subject?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  prompt?: string;
}
