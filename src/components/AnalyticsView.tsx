import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Target } from "lucide-react";
import type {
  Course,
  DailyActivity,
  NavigationPrefill,
  PageId,
  QuizAttempt,
} from "../types/learning";

interface AnalyticsViewProps {
  dailyActivity: DailyActivity[];
  quizHistory: QuizAttempt[];
  courses: Course[];
  weakTopics: { topic: string; subject: string; count: number }[];
  onNavigate: (page: PageId, prefill?: NavigationPrefill) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  dailyActivity,
  quizHistory,
  courses,
  weakTopics,
  onNavigate,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const maxMinutes = Math.max(
    60,
    ...dailyActivity.map((d) => d.minutes)
  );

  // Quiz trajectory ordered oldest -> newest
  const orderedQuizzes = [...quizHistory].reverse();

  // Aggregate unique strengths from quiz history
  const strengthCounts = new Map<string, { concept: string; subject: string; count: number }>();
  for (const attempt of quizHistory) {
    for (const c of attempt.strongConcepts) {
      const key = `${attempt.subject}::${c}`;
      const prev = strengthCounts.get(key);
      strengthCounts.set(key, {
        concept: c,
        subject: attempt.subject,
        count: (prev?.count ?? 0) + 1,
      });
    }
  }
  const topStrengths = Array.from(strengthCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // SVG line chart dimensions
  const chartW = 540;
  const chartH = 190;
  const padX = 36;
  const padY = 24;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const points = orderedQuizzes.map((q, idx) => {
    const x =
      orderedQuizzes.length === 1
        ? padX + plotW / 2
        : padX + (idx / (orderedQuizzes.length - 1)) * plotW;
    const y = padY + ((100 - q.percentage) / 100) * plotH;
    return { x, y, attempt: q };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints =
    points.length > 0
      ? `${points[0].x},${padY + plotH} ${polylinePoints} ${points[points.length - 1].x},${padY + plotH}`
      : "";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#161F42]">
            Learning Progress & Performance Analytics
          </h1>
          <p className="text-sm text-[#475569]">
            Live metrics computed from your completed lessons, study time, and quiz responses.
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Study Minutes Bar Chart */}
        <article className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#161F42]">
                Daily Study Volume (Last 7 Days)
              </h2>
              <p className="text-xs text-[#64748B]">
                Minutes spent across tutoring, paths, and quizzes
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-[#5B53E6] tabular-nums">
              {dailyActivity.reduce((a, b) => a + b.minutes, 0)} min total
            </span>
          </div>

          <div className="pt-2">
            <div className="flex h-48 items-end justify-between gap-2 border-b border-[#E4E3F5] pb-2">
              {dailyActivity.map((d, idx) => {
                const heightPct = Math.max(8, Math.round((d.minutes / maxMinutes) * 100));
                const isHovered = hoveredDay === idx;
                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => setHoveredDay(idx)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                  >
                    <span
                      className={`font-mono text-[11px] font-semibold tabular-nums transition-opacity ${
                        isHovered ? "text-[#161F42] opacity-100" : "text-[#64748B] opacity-85"
                      }`}
                    >
                      {d.minutes}m
                    </span>
                    <div
                      className={`w-full max-w-[38px] rounded-t-md transition-colors ${
                        isHovered ? "bg-[#161F42]" : "bg-[#5B53E6]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              {dailyActivity.map((d) => (
                <span
                  key={d.day}
                  className="flex-1 text-center text-[11px] font-medium text-[#64748B] tabular-nums"
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Quiz Score Trend Line Chart */}
        <article className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#161F42]">
                Quiz Score Trajectory
              </h2>
              <p className="text-xs text-[#64748B]">
                Accuracy progression across your chronological assessments
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-[#161F42] tabular-nums">
              {orderedQuizzes.length} quizzes
            </span>
          </div>

          {orderedQuizzes.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-[#64748B]">
              Complete a quiz to visualize your accuracy trend.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="h-48 w-full min-w-[380px]"
                role="img"
                aria-label="Quiz score trajectory chart"
              >
                {/* Horizontal gridlines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = padY + ((100 - val) / 100) * plotH;
                  return (
                    <g key={val}>
                      <line
                        x1={padX}
                        y1={y}
                        x2={padX + plotW}
                        y2={y}
                        stroke="#E4E3F5"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padX - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#64748B"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {areaPoints && (
                  <polygon
                    points={areaPoints}
                    fill="#5B53E6"
                    fillOpacity="0.1"
                  />
                )}

                {polylinePoints && (
                  <polyline
                    fill="none"
                    stroke="#5B53E6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                  />
                )}

                {points.map((pt) => (
                  <g key={pt.attempt.id}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#161F42"
                      strokeWidth="2.5"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#161F42"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {pt.attempt.percentage}%
                    </text>
                    <text
                      x={pt.x}
                      y={chartH - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748B"
                    >
                      {pt.attempt.subject.slice(0, 6)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </article>
      </section>

      {/* Course Progress Breakdown */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-[#161F42]">
          Course Mastery Breakdown
        </h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-[#5B53E6]">
                    {course.code}
                  </span>
                  <span className="font-semibold text-[#161F42]">
                    {course.title}
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#161F42] tabular-nums">
                  {course.progress}% ({course.completedLessons}/{course.totalLessons} lessons)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F0FB]">
                <div
                  className="h-full rounded-full bg-[#161F42] transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths vs Topics Needing Improvement */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#059669]" />
            <h2 className="font-display text-lg font-semibold text-[#161F42]">
              Demonstrated Strengths
            </h2>
          </div>
          {topStrengths.length === 0 ? (
            <p className="text-sm text-[#64748B]">
              Complete quizzes to build your verified concept strengths.
            </p>
          ) : (
            <div className="divide-y divide-[#E4E3F5]">
              {topStrengths.map((s) => (
                <div
                  key={`${s.subject}-${s.concept}`}
                  className="flex items-center justify-between py-3 first:pt-1 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#161F42]">
                      {s.concept}
                    </p>
                    <p className="text-xs text-[#64748B]">{s.subject}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#059669] tabular-nums">
                    Mastered
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#D97706]" />
            <h2 className="font-display text-lg font-semibold text-[#161F42]">
              Topics Needing Improvement
            </h2>
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-sm text-[#64748B]">
              No weak topics currently flagged. Great consistency!
            </p>
          ) : (
            <div className="divide-y divide-[#E4E3F5]">
              {weakTopics.map((w) => (
                <div
                  key={`${w.subject}-${w.topic}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#161F42]">
                      {w.topic}
                    </p>
                    <p className="text-xs text-[#64748B] tabular-nums">
                      {w.subject} · Flagged in {w.count}{" "}
                      {w.count === 1 ? "assessment" : "assessments"}
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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#161F42] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#222E5E] whitespace-nowrap shrink-0"
                  >
                    <Target className="h-3.5 w-3.5" />
                    <span>Practice</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
