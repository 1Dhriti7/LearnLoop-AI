import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Compass,
  Loader2,
  MessageSquare,
  RefreshCw,
  Target,
} from "lucide-react";
import type {
  AdaptiveInsight,
  Course,
  NavigationPrefill,
  PageId,
  QuizAttempt,
} from "../types/learning";

interface AdaptiveLearningViewProps {
  insight: AdaptiveInsight;
  quizHistory: QuizAttempt[];
  courses: Course[];
  weakTopics: { topic: string; subject: string; count: number }[];
  onUpdateInsight: (insight: AdaptiveInsight) => void;
  onNavigate: (page: PageId, prefill?: NavigationPrefill) => void;
}

export const AdaptiveLearningView: React.FC<AdaptiveLearningViewProps> = ({
  insight,
  quizHistory,
  courses,
  weakTopics,
  onUpdateInsight,
  onNavigate,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/adaptive/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizHistory,
          courses: courses.map((c) => ({
            title: c.title,
            subject: c.subject,
            progress: c.progress,
            masteryLevel: c.masteryLevel,
          })),
          weakTopics: weakTopics.map((w) => `${w.subject}: ${w.topic}`),
        }),
      });

      const data = (await response.json()) as Partial<AdaptiveInsight> & {
        error?: string;
      };

      if (!response.ok || !data.diagnosticSummary || !data.recommendedLessons) {
        throw new Error(
          data.error || "Unable to refresh adaptive analysis right now."
        );
      }

      onUpdateInsight({
        generatedAt: new Date().toISOString().slice(0, 10),
        diagnosticSummary: data.diagnosticSummary,
        weakAreaDiagnostics: data.weakAreaDiagnostics || [],
        recommendedLessons: data.recommendedLessons,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to run adaptive performance analysis."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Diagnostic Summary */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E3F5] pb-5 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5B53E6]">
              <span>Adaptive Diagnostic Engine</span>
              <span aria-hidden="true">·</span>
              <span>Last updated {insight.generatedAt}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#161F42]">
              Personalized Mastery Diagnostics
            </h1>
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Quizzes...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Re-Analyze Performance</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-[#334175]">
          {insight.diagnosticSummary}
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Weak Topic Breakdown + Telemetry */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-lg font-semibold text-[#161F42]">
            Identified Weak Topics & Root Causes
          </h2>

          <div className="space-y-4">
            {insight.weakAreaDiagnostics.map((item, idx) => (
              <article
                key={`${item.topic}-${idx}`}
                className="rounded-xl border border-[#E4E3F5] bg-white p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#5B53E6]">
                    {item.subject}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {item.severity}
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-[#161F42]">
                  {item.topic}
                </h3>

                <p className="text-sm leading-relaxed text-[#475569]">
                  {item.rootCause}
                </p>

                <div className="flex flex-col justify-between gap-3 rounded-lg bg-[#F8F9FC] p-3.5 sm:flex-row sm:items-center">
                  <p className="text-xs leading-relaxed text-[#334175]">
                    <span className="font-semibold text-[#161F42]">
                      Action:{" "}
                    </span>
                    {item.actionStep}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate("tutor", {
                        subject: item.subject,
                        topic: item.topic,
                        prompt: `I need help fixing my mistakes on "${item.topic}". ${item.rootCause} Can you walk me through this step by step?`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#161F42] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#222E5E] whitespace-nowrap shrink-0"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Fix in Tutor</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Quiz Missed Concept Frequency */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-[#161F42]">
            Missed Concepts from Quiz History
          </h2>

          <div className="rounded-xl border border-[#E4E3F5] bg-white p-5">
            {weakTopics.length === 0 ? (
              <p className="text-sm text-[#475569]">
                No missed concepts recorded yet. Take a quiz to surface diagnostic gaps.
              </p>
            ) : (
              <div className="divide-y divide-[#E4E3F5]">
                {weakTopics.map((w) => (
                  <div
                    key={`${w.subject}-${w.topic}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#161F42]">
                        {w.topic}
                      </p>
                      <p className="text-xs text-[#64748B] tabular-nums">
                        {w.subject} · {w.count}{" "}
                        {w.count === 1 ? "missed quiz" : "missed quizzes"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate("quiz", {
                          subject: w.subject,
                          topic: w.topic,
                          difficulty: "intermediate",
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-2.5 py-1.5 text-xs font-medium text-[#161F42] hover:bg-[#F1F0FB] whitespace-nowrap shrink-0"
                    >
                      <Target className="h-3.5 w-3.5 text-[#5B53E6]" />
                      <span>Drill</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Prioritized Next Lessons */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-[#161F42]">
          Recommended Next Sequence
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {insight.recommendedLessons.map((lesson, idx) => (
            <article
              key={`${lesson.title}-${idx}`}
              className="flex flex-col justify-between rounded-xl border border-[#E4E3F5] bg-white p-5 space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span className="font-mono font-semibold text-[#5B53E6]">
                    0{idx + 1}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {lesson.estimatedMinutes} min
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-[#161F42]">
                  {lesson.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#475569]">
                  {lesson.rationale}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (lesson.recommendedMode === "quiz") {
                    onNavigate("quiz", {
                      subject: lesson.subject,
                      topic: lesson.topic,
                      difficulty: "intermediate",
                    });
                  } else if (lesson.recommendedMode === "path") {
                    onNavigate("learning-path", {
                      subject: lesson.subject,
                      topic: lesson.topic,
                    });
                  } else {
                    onNavigate("tutor", {
                      subject: lesson.subject,
                      topic: lesson.topic,
                      prompt: `Guide me through "${lesson.title}". ${lesson.rationale}`,
                    });
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#161F42] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>
                  {lesson.recommendedMode === "quiz"
                    ? "Launch Targeted Quiz"
                    : lesson.recommendedMode === "path"
                      ? "Generate Learning Path"
                      : "Start AI Tutor Session"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
