import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Flame,
  GraduationCap,
  MessageSquare,
  Target,
} from "lucide-react";
import type {
  NavigationPrefill,
  PageId,
  StudentState,
} from "../types/learning";

interface DashboardViewProps {
  state: StudentState;
  derivedMetrics: {
    totalStudyMinutes: number;
    averageQuizScore: number;
    aggregatedWeakTopics: { topic: string; subject: string; count: number }[];
    overallCourseProgress: number;
  };
  onNavigate: (page: PageId, prefill?: NavigationPrefill) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  derivedMetrics,
  onNavigate,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const firstName = state.studentName.split(" ")[0];
  const weeklyGoalPct = Math.min(
    100,
    Math.round((derivedMetrics.totalStudyMinutes / state.weeklyMinutesGoal) * 100)
  );
  const completedLessonsTotal = state.courses.reduce(
    (sum, c) => sum + c.completedLessons,
    0
  );
  const totalLessonsCount = state.courses.reduce(
    (sum, c) => sum + c.totalLessons,
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome & Primary Hero Strip */}
      <section className="flex flex-col justify-between gap-6 rounded-xl border border-[#E4E3F5] bg-white p-6 sm:flex-row sm:items-center sm:p-7">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5B53E6]">
            <span>{state.academicTrack}</span>
            <span aria-hidden="true">·</span>
            <span>{state.streakDays}-day active streak</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#161F42] sm:text-3xl text-balance">
            Welcome back, {firstName}. Ready to close your next mastery gap?
          </h1>
          <p className="text-[15px] leading-relaxed text-[#475569]">
            You have logged{" "}
            <span className="font-semibold text-[#161F42] tabular-nums">
              {derivedMetrics.totalStudyMinutes} min
            </span>{" "}
            this week ({weeklyGoalPct}% of your{" "}
            <span className="tabular-nums">{state.weeklyMinutesGoal} min</span>{" "}
            goal). Your priority focus is{" "}
            <span className="font-medium text-[#161F42]">
              {state.adaptiveInsight.weakAreaDiagnostics[0]?.topic ??
                "Quantum Potential Wells"}
            </span>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              onNavigate("tutor", {
                subject: "Physics",
                topic: "Quantum Potential Wells",
                prompt:
                  "Walk me through wavefunction normalization and boundary continuity step by step with an infinite square well example.",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Resume Priority Topic</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("learning-path")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-4 py-2.5 text-sm font-medium text-[#161F42] transition-colors hover:bg-[#F1F0FB] whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-4 w-4" />
            <span>Generate Path</span>
          </button>
        </div>
      </section>

      {/* 4-Column KPI Summary Grid */}
      <section aria-label="Learning Metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E4E3F5] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
            <span>Daily Streak</span>
            <Flame className="h-4 w-4 text-[#5B53E6]" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-[#161F42] tabular-nums">
            {state.streakDays} days
          </p>
          <p className="mt-1 text-xs text-[#475569]">
            Consistent daily study logged
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E3F5] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
            <span>Overall Course Progress</span>
            <GraduationCap className="h-4 w-4 text-[#5B53E6]" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-[#161F42] tabular-nums">
            {derivedMetrics.overallCourseProgress}%
          </p>
          <p className="mt-1 text-xs text-[#475569] tabular-nums">
            {completedLessonsTotal} of {totalLessonsCount} lessons completed
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E3F5] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
            <span>Average Quiz Score</span>
            <CheckCircle2 className="h-4 w-4 text-[#5B53E6]" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-[#161F42] tabular-nums">
            {derivedMetrics.averageQuizScore}%
          </p>
          <p className="mt-1 text-xs text-[#475569] tabular-nums">
            Across {state.quizHistory.length} completed assessments
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E3F5] bg-white p-5">
          <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
            <span>Weekly Study Volume</span>
            <Target className="h-4 w-4 text-[#5B53E6]" aria-hidden="true" />
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-[#161F42] tabular-nums">
            {derivedMetrics.totalStudyMinutes} min
          </p>
          <p className="mt-1 text-xs text-[#475569] tabular-nums">
            {weeklyGoalPct}% of {state.weeklyMinutesGoal} min weekly target
          </p>
        </div>
      </section>

      {/* Active Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#161F42]">
              Active Courses
            </h2>
            <p className="text-sm text-[#475569]">
              Jump straight into an AI tutoring session or targeted quiz for any course.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("learning-path")}
            className="text-sm font-medium text-[#5B53E6] hover:text-[#161F42] transition-colors whitespace-nowrap shrink-0"
          >
            View Learning Paths
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {state.courses.map((course) => {
            const masteryTextColor =
              course.masteryLevel === "Strong"
                ? "text-[#059669]"
                : course.masteryLevel === "Developing"
                  ? "text-[#D97706]"
                  : "text-[#DC2626]";

            return (
              <article
                key={course.id}
                className="flex flex-col overflow-hidden rounded-xl border border-[#E4E3F5] bg-white"
              >
                <div className="aspect-video w-full overflow-hidden bg-[#161F42]">
                  {!failedImages[course.id] ? (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [course.id]: true }))
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#161F42] to-[#334175] p-4 text-center text-white">
                      <BookOpen className="h-7 w-7 text-[#CFCBF0]" />
                      <span className="mt-2 font-display text-sm font-semibold">
                        {course.code}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-mono font-medium text-[#334175]">
                        {course.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{course.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-medium ${masteryTextColor}`}>
                        {course.masteryLevel}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-[#161F42] leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-sm text-[#475569]">
                      Next: {course.nextTopic}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs text-[#475569] tabular-nums">
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="font-semibold text-[#161F42]">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F0FB]">
                        <div
                          className="h-full rounded-full bg-[#5B53E6] transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate("tutor", {
                            subject: course.subject,
                            topic: course.nextTopic,
                            prompt: `Teach me "${course.nextTopic}" from ${course.title} (${course.code}) with intuition and a worked example.`,
                          })
                        }
                        className="flex-1 rounded-lg bg-[#161F42] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap"
                      >
                        Study in Tutor
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate("quiz", {
                            subject: course.subject,
                            topic: course.nextTopic,
                            difficulty:
                              course.masteryLevel === "Strong"
                                ? "advanced"
                                : "intermediate",
                          })
                        }
                        className="rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-xs font-medium text-[#161F42] transition-colors hover:bg-[#F1F0FB] whitespace-nowrap"
                      >
                        Quick Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Recommended Lessons + Recent Quiz Scores */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recommended Next Lessons */}
        <div className="lg:col-span-6 rounded-xl border border-[#E4E3F5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#161F42]">
                Recommended Next Lessons
              </h2>
              <p className="text-xs text-[#64748B]">
                Personalized from your recent quiz accuracy and course pace
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("adaptive")}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5B53E6] hover:text-[#161F42] whitespace-nowrap shrink-0"
            >
              <span>Adaptive Engine</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E4E3F5]">
            {state.adaptiveInsight.recommendedLessons.map((lesson, idx) => (
              <div
                key={`${lesson.title}-${idx}`}
                className="flex flex-col justify-between gap-3 py-4 first:pt-1 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span className="font-medium text-[#5B53E6]">
                      {lesson.subject}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {lesson.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-semibold text-[#161F42]">
                    {lesson.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#475569]">
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
                        prompt: `Help me master "${lesson.title}". Focus on: ${lesson.rationale}`,
                      });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-1.5 text-xs font-medium text-[#161F42] transition-colors hover:bg-[#F1F0FB] sm:self-center whitespace-nowrap shrink-0"
                >
                  <Compass className="h-3.5 w-3.5 text-[#5B53E6]" />
                  <span>
                    {lesson.recommendedMode === "quiz"
                      ? "Take Quiz"
                      : lesson.recommendedMode === "path"
                        ? "Open Path"
                        : "Start Lesson"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Scores */}
        <div className="lg:col-span-6 rounded-xl border border-[#E4E3F5] bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#161F42]">
                Recent Quiz Scores
              </h2>
              <p className="text-xs text-[#64748B]">
                Live performance record saved locally in your browser
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("quiz")}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5B53E6] hover:text-[#161F42] whitespace-nowrap shrink-0"
            >
              <span>New Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4E3F5] text-xs font-medium text-[#64748B]">
                  <th className="pb-2.5 pr-4 font-medium">Assessment</th>
                  <th className="pb-2.5 pr-4 font-medium">Difficulty</th>
                  <th className="pb-2.5 pr-4 text-right font-medium">Score</th>
                  <th className="pb-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E3F5]">
                {state.quizHistory.slice(0, 5).map((attempt) => {
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
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#161F42]">
                          {attempt.quizTitle}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {attempt.subject} · {attempt.completedAt}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-xs capitalize text-[#475569]">
                        {attempt.difficulty}
                      </td>
                      <td
                        className={`py-3 pr-4 text-right font-mono text-sm font-semibold tabular-nums ${scoreColor}`}
                      >
                        {attempt.percentage}%
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate("quiz", {
                              subject: attempt.subject,
                              topic: attempt.topic,
                              difficulty: attempt.difficulty,
                            })
                          }
                          className="text-xs font-medium text-[#5B53E6] hover:text-[#161F42] whitespace-nowrap"
                        >
                          Retake
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
