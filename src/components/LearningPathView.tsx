import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  Target,
} from "lucide-react";
import { generateLearningPath } from "../services/geminiClient";
import type {
  LearningPath,
  NavigationPrefill,
  PageId,
} from "../types/learning";

interface LearningPathViewProps {
  paths: LearningPath[];
  activePathId: string;
  prefill: NavigationPrefill | null;
  onClearPrefill: () => void;
  onSelectPath: (id: string) => void;
  onAddPath: (path: LearningPath) => void;
  onToggleLesson: (pathId: string, lessonId: string) => void;
  onNavigate: (page: PageId, prefill?: NavigationPrefill) => void;
}

const STAGE_META: {
  key: "beginner" | "intermediate" | "advanced";
  title: string;
  subtitle: string;
}[] = [
  {
    key: "beginner",
    title: "01. Beginner Foundations",
    subtitle: "Core intuition, key definitions, and base cases",
  },
  {
    key: "intermediate",
    title: "02. Intermediate Mechanics",
    subtitle: "Structured problem solving and multi-step derivations",
  },
  {
    key: "advanced",
    title: "03. Advanced Synthesis",
    subtitle: "Optimization, edge cases, and exam-level mastery",
  },
];

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  paths,
  activePathId,
  prefill,
  onClearPrefill,
  onSelectPath,
  onAddPath,
  onToggleLesson,
  onNavigate,
}) => {
  const [subject, setSubject] = useState(prefill?.subject || "Mathematics");
  const [topic, setTopic] = useState(prefill?.topic || "Linear Algebra Eigenvalues");
  const [goal, setGoal] = useState(
    "Build strong geometric intuition and solve diagonalization problems confidently"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prefill) {
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.topic) setTopic(prefill.topic);
      onClearPrefill();
    }
  }, [prefill, onClearPrefill]);

  const activePath =
    paths.find((p) => p.id === activePathId) || paths[0] || null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const created = await generateLearningPath({
        subject,
        topic,
        goal,
      });
      onAddPath(created);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate learning path."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const countProgress = (path: LearningPath) => {
    const all = [
      ...path.stages.beginner,
      ...path.stages.intermediate,
      ...path.stages.advanced,
    ];
    const done = all.filter((l) => l.completed).length;
    return { done, total: all.length };
  };

  return (
    <div className="space-y-8">
      {/* Generator Form */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6">
        <div className="mb-5">
          <h1 className="font-display text-xl font-bold text-[#161F42]">
            Generate a Personalized Learning Path
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Enter any subject and topic to build a structured Beginner, Intermediate, and Advanced curriculum powered by Gemini.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <label
              htmlFor="path-subject"
              className="mb-1.5 block text-xs font-medium text-[#334175]"
            >
              Subject
            </label>
            <input
              id="path-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3.5 py-2 text-sm text-[#111827] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="path-topic"
              className="mb-1.5 block text-xs font-medium text-[#334175]"
            >
              Topic
            </label>
            <input
              id="path-topic"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Reaction Mechanisms & Stereochemistry"
              className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3.5 py-2 text-sm text-[#111827] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="path-goal"
                className="mb-1.5 block text-xs font-medium text-[#334175]"
              >
                Learning Goal (optional)
              </label>
              <input
                id="path-goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Prepare for midterm exam"
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3.5 py-2 text-sm text-[#111827] focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !subject.trim() || !topic.trim()}
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-[#161F42] px-4 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Building Path...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Create Path</span>
                </>
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

      {/* Saved Paths Selector */}
      {paths.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {paths.map((p) => {
              const stats = countProgress(p);
              const isSelected = activePath?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPath(p.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "border-[#161F42] bg-[#161F42] text-white"
                      : "border-[#D6D5E9] bg-white text-[#334175] hover:bg-[#F1F0FB]"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{p.topic}</span>
                  <span
                    className={`font-mono tabular-nums ${
                      isSelected ? "text-[#CFCBF0]" : "text-[#64748B]"
                    }`}
                  >
                    {stats.done}/{stats.total}
                  </span>
                </button>
              );
            })}
          </div>

          {isGenerating ? (
            <div className="space-y-4 rounded-xl border border-[#E4E3F5] bg-white p-6">
              <div className="h-6 w-2/5 animate-pulse rounded bg-[#F1F0FB]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#F1F0FB]" />
              <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-44 animate-pulse rounded-xl border border-[#E4E3F5] bg-[#F8F9FC]"
                  />
                ))}
              </div>
            </div>
          ) : (
            activePath && (
              <div className="space-y-6">
                {/* Active Path Summary */}
                <div className="rounded-xl border border-[#E4E3F5] bg-white p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex items-center gap-2 text-xs text-[#5B53E6] font-medium">
                        <span>{activePath.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>Created {activePath.createdAt}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-[#161F42]">
                        {activePath.pathTitle}
                      </h2>
                      <p className="text-sm leading-relaxed text-[#475569]">
                        {activePath.overview}
                      </p>
                    </div>

                    {(() => {
                      const stats = countProgress(activePath);
                      const pct =
                        stats.total > 0
                          ? Math.round((stats.done / stats.total) * 100)
                          : 0;
                      return (
                        <div className="min-w-[180px] rounded-lg border border-[#E4E3F5] bg-[#F8F9FC] p-4">
                          <div className="flex items-center justify-between text-xs text-[#475569] tabular-nums">
                            <span>Path Completion</span>
                            <span className="font-semibold text-[#161F42]">
                              {pct}%
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E4E3F5]">
                            <div
                              className="h-full rounded-full bg-[#5B53E6] transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-[#64748B] tabular-nums">
                            {stats.done} of {stats.total} lessons completed
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 3 Progressive Stages */}
                <div className="space-y-6">
                  {STAGE_META.map((stage) => {
                    const lessons = activePath.stages[stage.key];
                    return (
                      <div
                        key={stage.key}
                        className="rounded-xl border border-[#E4E3F5] bg-white p-6"
                      >
                        <div className="mb-4 flex flex-col justify-between gap-2 border-b border-[#E4E3F5] pb-4 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="font-display text-lg font-semibold text-[#161F42]">
                              {stage.title}
                            </h3>
                            <p className="text-xs text-[#64748B]">
                              {stage.subtitle}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-[#475569] tabular-nums">
                            {lessons.filter((l) => l.completed).length}/
                            {lessons.length} completed
                          </span>
                        </div>

                        <div className="divide-y divide-[#E4E3F5]">
                          {lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex flex-col justify-between gap-4 py-4 first:pt-1 last:pb-0 lg:flex-row lg:items-center"
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onToggleLesson(activePath.id, lesson.id)
                                  }
                                  aria-label={
                                    lesson.completed
                                      ? `Mark ${lesson.title} incomplete`
                                      : `Mark ${lesson.title} complete`
                                  }
                                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                    lesson.completed
                                      ? "border-[#059669] bg-[#059669] text-white"
                                      : "border-[#CBD5E1] bg-white hover:border-[#5B53E6]"
                                  }`}
                                >
                                  {lesson.completed && (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </button>

                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                      className={`font-display text-base font-semibold ${
                                        lesson.completed
                                          ? "text-[#64748B] line-through"
                                          : "text-[#161F42]"
                                      }`}
                                    >
                                      {lesson.title}
                                    </h4>
                                    {lesson.completed && (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#059669]">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Completed
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-sm leading-relaxed text-[#475569]">
                                    {lesson.summary}
                                  </p>

                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                                    <span className="inline-flex items-center gap-1 tabular-nums">
                                      <Clock className="h-3.5 w-3.5" />
                                      {lesson.estimatedMinutes} min
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>
                                      {lesson.keyConcepts.join(" · ")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pl-8 lg:pl-0 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigate("tutor", {
                                      subject: activePath.subject,
                                      topic: lesson.title,
                                      prompt:
                                        lesson.practicePrompt ||
                                        `Teach me "${lesson.title}" (${lesson.summary}) step by step.`,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#161F42] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span>Tutor Me</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigate("quiz", {
                                      subject: activePath.subject,
                                      topic: lesson.title,
                                      difficulty: stage.key,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-1.5 text-xs font-medium text-[#161F42] transition-colors hover:bg-[#F1F0FB] whitespace-nowrap"
                                >
                                  <Target className="h-3.5 w-3.5" />
                                  <span>Quiz Lesson</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
};
