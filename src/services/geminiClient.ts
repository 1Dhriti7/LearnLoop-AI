import type {
  AdaptiveInsight,
  Course,
  DifficultyLevel,
  LearningPath,
  PathLesson,
  QuizAttempt,
  QuizQuestion,
  TutorStyle,
} from "../types/learning";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  let parsed: (T & { error?: string }) | null = null;
  try {
    parsed = JSON.parse(rawText) as T & { error?: string };
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    throw new Error(
      parsed?.error || `Request failed (HTTP ${response.status}). Please try again.`
    );
  }

  if (!parsed) {
    throw new Error("Received an unexpected response format from the server.");
  }

  return parsed;
}

export async function generateTutorReply(params: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  subject: string;
  topic: string;
  style: TutorStyle;
}): Promise<string> {
  const data = await postJson<{ reply?: string }>("/api/tutor/chat", params);
  if (!data.reply) {
    throw new Error("Unable to reach the AI Tutor right now. Please try again.");
  }
  return data.reply;
}

export async function generateLearningPath(params: {
  subject: string;
  topic: string;
  goal?: string;
}): Promise<LearningPath> {
  const data = await postJson<{
    pathTitle?: string;
    overview?: string;
    stages?: {
      beginner?: Omit<PathLesson, "id" | "completed">[];
      intermediate?: Omit<PathLesson, "id" | "completed">[];
      advanced?: Omit<PathLesson, "id" | "completed">[];
    };
  }>("/api/learning-path/generate", params);

  if (!data.stages) {
    throw new Error("Unable to generate learning path. Please try again.");
  }

  const timestamp = Date.now();
  const mapStage = (
    list: Omit<PathLesson, "id" | "completed">[] | undefined,
    prefix: string
  ): PathLesson[] =>
    (list ?? []).map((lesson, idx) => ({
      ...lesson,
      id: `${prefix}-${timestamp}-${idx}`,
      completed: false,
    }));

  return {
    id: `path-${timestamp}`,
    subject: params.subject.trim(),
    topic: params.topic.trim(),
    goal: (params.goal ?? "").trim(),
    pathTitle: data.pathTitle || `${params.topic.trim()} Roadmap`,
    overview: data.overview || "",
    createdAt: new Date().toISOString().slice(0, 10),
    stages: {
      beginner: mapStage(data.stages.beginner, "beg"),
      intermediate: mapStage(data.stages.intermediate, "int"),
      advanced: mapStage(data.stages.advanced, "adv"),
    },
  };
}

export async function generateQuiz(params: {
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionCount: number;
}): Promise<{ quizTitle: string; questions: QuizQuestion[] }> {
  const data = await postJson<{
    quizTitle?: string;
    questions?: Omit<QuizQuestion, "id">[];
  }>("/api/quiz/generate", params);

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("Unable to generate quiz questions. Please retry.");
  }

  const questions: QuizQuestion[] = data.questions.map((q, idx) => ({
    ...q,
    id: `q-${Date.now()}-${idx}`,
    correctIndex: Math.min(
      Math.max(Number(q.correctIndex) || 0, 0),
      (q.options?.length ?? 4) - 1
    ),
  }));

  return {
    quizTitle: data.quizTitle || `${params.topic.trim()} Assessment`,
    questions,
  };
}

export async function generateAdaptiveAnalysis(params: {
  quizHistory: QuizAttempt[];
  courses: Course[];
  weakTopics: string[];
}): Promise<AdaptiveInsight> {
  const data = await postJson<Partial<AdaptiveInsight>>("/api/adaptive/analyze", {
    quizHistory: params.quizHistory,
    courses: params.courses.map((c) => ({
      title: c.title,
      subject: c.subject,
      progress: c.progress,
      masteryLevel: c.masteryLevel,
    })),
    weakTopics: params.weakTopics,
  });

  if (!data.diagnosticSummary || !data.recommendedLessons) {
    throw new Error("Unable to refresh adaptive analysis right now.");
  }

  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    diagnosticSummary: data.diagnosticSummary,
    weakAreaDiagnostics: data.weakAreaDiagnostics ?? [],
    recommendedLessons: data.recommendedLessons,
  };
}
