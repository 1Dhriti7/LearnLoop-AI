import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type {
  DifficultyLevel,
  NavigationPrefill,
  PageId,
  QuizAttempt,
  QuizQuestion,
} from "../types/learning";

interface QuizViewProps {
  quizHistory: QuizAttempt[];
  prefill: NavigationPrefill | null;
  onClearPrefill: () => void;
  onRecordAttempt: (attempt: QuizAttempt) => void;
  onNavigate: (page: PageId, prefill?: NavigationPrefill) => void;
}

type QuizPhase = "setup" | "active" | "results";

export const QuizView: React.FC<QuizViewProps> = ({
  quizHistory,
  prefill,
  onClearPrefill,
  onRecordAttempt,
  onNavigate,
}) => {
  const [subject, setSubject] = useState(prefill?.subject || "Physics");
  const [topic, setTopic] = useState(prefill?.topic || "Quantum Potential Wells");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    prefill?.difficulty || "intermediate"
  );
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startedAt, setStartedAt] = useState<number>(0);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefill) {
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.topic) setTopic(prefill.topic);
      if (prefill.difficulty) setDifficulty(prefill.difficulty);
      setPhase("setup");
      onClearPrefill();
    }
  }, [prefill, onClearPrefill]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          topic: topic.trim(),
          difficulty,
          questionCount,
        }),
      });

      const data = (await response.json()) as {
        quizTitle?: string;
        questions?: Omit<QuizQuestion, "id">[];
        error?: string;
      };

      if (!response.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(
          data.error || "Unable to generate quiz questions. Please retry."
        );
      }

      const formattedQuestions: QuizQuestion[] = data.questions.map((q, idx) => ({
        ...q,
        id: `q-${Date.now()}-${idx}`,
        correctIndex: Math.min(
          Math.max(Number(q.correctIndex) || 0, 0),
          (q.options?.length ?? 4) - 1
        ),
      }));

      setQuizTitle(data.quizTitle || `${topic.trim()} Assessment`);
      setQuestions(formattedQuestions);
      setAnswers({});
      setCurrentIndex(0);
      setStartedAt(Date.now());
      setLastAttempt(null);
      setPhase("active");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate quiz."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    const weakSet = new Set<string>();
    const strongSet = new Set<string>();

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctIndex) {
        correct += 1;
        if (q.conceptTag) strongSet.add(q.conceptTag);
      } else if (q.conceptTag) {
        weakSet.add(q.conceptTag);
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const durationSeconds = Math.max(
      15,
      Math.round((Date.now() - startedAt) / 1000)
    );

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizTitle,
      subject: subject.trim(),
      topic: topic.trim(),
      difficulty,
      score: correct,
      totalQuestions: total,
      percentage,
      weakConcepts: Array.from(weakSet),
      strongConcepts: Array.from(strongSet),
      completedAt: new Date().toISOString().slice(0, 10),
      durationSeconds,
    };

    onRecordAttempt(attempt);
    setLastAttempt(attempt);
    setPhase("results");
  };

  if (phase === "active" && questions.length > 0) {
    const q = questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E3F5] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#5B53E6] font-medium">
                <span>{subject}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>{q.conceptTag}</span>
              </div>
              <h1 className="mt-1 font-display text-lg font-bold text-[#161F42]">
                {quizTitle}
              </h1>
            </div>

            <div className="text-right text-xs text-[#475569] tabular-nums">
              <p className="font-semibold text-[#161F42]">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p>{answeredCount} answered</p>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F0FB]">
            <div
              className="h-full rounded-full bg-[#5B53E6] transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="font-display text-lg font-semibold leading-snug text-[#111827]">
              {q.question}
            </h2>

            <div className="space-y-2.5" role="radiogroup" aria-label="Answer choices">
              {q.options.map((option, optIdx) => {
                const isSelected = answers[q.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                    }
                    className={`flex w-full items-start gap-3.5 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
                      isSelected
                        ? "border-[#5B53E6] bg-[#F1F0FB] text-[#161F42]"
                        : "border-[#E4E3F5] bg-white text-[#1F2937] hover:bg-[#F8F9FC]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold ${
                        isSelected
                          ? "bg-[#5B53E6] text-white"
                          : "bg-[#F1F0FB] text-[#334175]"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E3F5] pt-4">
            <button
              type="button"
              onClick={() => setPhase("setup")}
              className="text-xs font-medium text-[#64748B] hover:text-[#161F42]"
            >
              Cancel Quiz
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D5E9] bg-white px-3.5 py-2 text-xs font-medium text-[#161F42] hover:bg-[#F8F9FC] disabled:opacity-40 whitespace-nowrap"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#161F42] px-4 py-2 text-xs font-medium text-white hover:bg-[#222E5E] whitespace-nowrap"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={answeredCount < questions.length}
                  onClick={handleSubmitQuiz}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B53E6] px-4 py-2 text-xs font-medium text-white hover:bg-[#4B43D6] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {answeredCount < questions.length
                      ? `Answer All (${answeredCount}/${questions.length})`
                      : "Submit & Grade Quiz"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results" && lastAttempt) {
    const scoreColor =
      lastAttempt.percentage >= 80
        ? "text-[#059669]"
        : lastAttempt.percentage >= 60
          ? "text-[#D97706]"
          : "text-[#DC2626]";

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="flex flex-col justify-between gap-6 rounded-xl border border-[#E4E3F5] bg-white p-6 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5B53E6]">
              <span>{lastAttempt.subject}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{lastAttempt.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {Math.round(lastAttempt.durationSeconds / 60)} min{" "}
                {lastAttempt.durationSeconds % 60}s
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#161F42]">
              {lastAttempt.quizTitle}
            </h1>
            <p className="text-sm text-[#475569]">
              Your score and concept breakdown have been saved to Adaptive Learning and Analytics.
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <p className={`font-display text-4xl font-bold tabular-nums ${scoreColor}`}>
                {lastAttempt.percentage}%
              </p>
              <p className="text-xs font-medium text-[#475569] tabular-nums">
                {lastAttempt.score} of {lastAttempt.totalQuestions} correct
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          {lastAttempt.weakConcepts.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onNavigate("tutor", {
                  subject: lastAttempt.subject,
                  topic: lastAttempt.weakConcepts[0],
                  prompt: `I just scored ${lastAttempt.percentage}% on "${lastAttempt.quizTitle}" and missed questions on: ${lastAttempt.weakConcepts.join(", ")}. Please explain these concepts clearly with examples.`,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-4 py-2 text-sm font-medium text-white hover:bg-[#222E5E] whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Review Missed Concepts in AI Tutor</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPhase("setup")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6D5E9] bg-white px-4 py-2 text-sm font-medium text-[#161F42] hover:bg-[#F8F9FC] whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Generate Another Quiz</span>
          </button>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-[#161F42]">
            Answer Explanations
          </h2>
          {questions.map((q, idx) => {
            const userIdx = answers[q.id];
            const isCorrect = userIdx === q.correctIndex;
            return (
              <article
                key={q.id}
                className="rounded-xl border border-[#E4E3F5] bg-white p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#64748B] tabular-nums">
                    Question {idx + 1} · {q.conceptTag}
                  </span>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669]">
                      <CheckCircle2 className="h-4 w-4" />
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DC2626]">
                      <XCircle className="h-4 w-4" />
                      Incorrect
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-semibold text-[#161F42]">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                  {q.options.map((opt, optIdx) => {
                    const isRight = optIdx === q.correctIndex;
                    const isPicked = optIdx === userIdx;
                    let cls = "border-[#E4E3F5] bg-[#F8F9FC] text-[#475569]";
                    if (isRight) {
                      cls = "border-[#059669]/40 bg-[#ECFDF5] text-[#065F46] font-medium";
                    } else if (isPicked && !isRight) {
                      cls = "border-[#DC2626]/40 bg-[#FEF2F2] text-[#991B1B]";
                    }
                    return (
                      <div
                        key={optIdx}
                        className={`rounded-lg border px-3.5 py-2.5 ${cls}`}
                      >
                        <span className="mr-2 font-mono text-xs font-semibold">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-lg bg-[#F1F0FB] px-4 py-3 text-sm leading-relaxed text-[#1E293B]">
                  <span className="font-semibold text-[#161F42]">
                    Explanation:{" "}
                  </span>
                  {q.explanation}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quiz Setup Card */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6">
        <div className="mb-5">
          <h1 className="font-display text-xl font-bold text-[#161F42]">
            AI Quiz Generator
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Create targeted multiple-choice quizzes with instant grading, concept tagging, and step-by-step explanations.
          </p>
        </div>

        <form onSubmit={handleGenerateQuiz} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="quiz-subject"
                className="mb-1.5 block text-xs font-medium text-[#334175]"
              >
                Subject
              </label>
              <input
                id="quiz-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3.5 py-2 text-sm text-[#111827] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="quiz-topic"
                className="mb-1.5 block text-xs font-medium text-[#334175]"
              >
                Topic
              </label>
              <input
                id="quiz-topic"
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Dynamic Programming"
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3.5 py-2 text-sm text-[#111827] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="mb-1.5 block text-xs font-medium text-[#334175]">
                  Difficulty
                </span>
                <div className="flex items-center gap-1 rounded-lg bg-[#F1F0FB] p-1">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                          difficulty === lvl
                            ? "bg-white text-[#161F42] shadow-xs"
                            : "text-[#475569] hover:text-[#161F42]"
                        }`}
                      >
                        {lvl}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-[#334175]">
                  Questions
                </span>
                <div className="flex items-center gap-1 rounded-lg bg-[#F1F0FB] p-1">
                  {[3, 5, 7].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors tabular-nums ${
                        questionCount === count
                          ? "bg-white text-[#161F42] shadow-xs"
                          : "text-[#475569] hover:text-[#161F42]"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !subject.trim() || !topic.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <span>Start AI Quiz</span>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Quiz History Table */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold text-[#161F42]">
            Completed Quizzes
          </h2>
          <p className="text-xs text-[#64748B]">
            Retake any past assessment or drill weak concepts identified from your answers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4E3F5] text-xs font-medium text-[#64748B]">
                <th className="pb-3 pr-4 font-medium">Quiz</th>
                <th className="pb-3 pr-4 font-medium">Difficulty</th>
                <th className="pb-3 pr-4 font-medium">Weak Concepts</th>
                <th className="pb-3 pr-4 text-right font-medium">Score</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E3F5]">
              {quizHistory.map((attempt) => {
                const scoreColor =
                  attempt.percentage >= 80
                    ? "text-[#059669]"
                    : attempt.percentage >= 60
                      ? "text-[#D97706]"
                      : "text-[#DC2626]";

                return (
                  <tr
                    key={attempt.id}
                    className="transition-colors hover:bg-[#F8F9FC]"
                  >
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-[#161F42]">
                        {attempt.quizTitle}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {attempt.subject} · {attempt.completedAt}
                      </p>
                    </td>
                    <td className="py-3.5 pr-4 text-xs capitalize text-[#475569]">
                      {attempt.difficulty}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-[#475569]">
                      {attempt.weakConcepts.length > 0
                        ? attempt.weakConcepts.join(" · ")
                        : "None detected"}
                    </td>
                    <td
                      className={`py-3.5 pr-4 text-right font-mono text-sm font-semibold tabular-nums ${scoreColor}`}
                    >
                      {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSubject(attempt.subject);
                          setTopic(attempt.topic);
                          setDifficulty(attempt.difficulty);
                        }}
                        className="text-xs font-medium text-[#5B53E6] hover:text-[#161F42] whitespace-nowrap"
                      >
                        Load Topic
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
