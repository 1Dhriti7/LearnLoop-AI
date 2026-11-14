import React, { useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import type { StudyBlock, StudyGoal } from "../types/learning";

interface StudyPlannerViewProps {
  schedule: StudyBlock[];
  goals: StudyGoal[];
  onToggleBlock: (id: string) => void;
  onAddBlock: (block: StudyBlock) => void;
  onDeleteBlock: (id: string) => void;
  onAddGoal: (goal: StudyGoal) => void;
  onIncrementGoal: (id: string, delta: number) => void;
}

const DAYS: StudyBlock["day"][] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  schedule,
  goals,
  onToggleBlock,
  onAddBlock,
  onDeleteBlock,
  onAddGoal,
  onIncrementGoal,
}) => {
  const [dayFilter, setDayFilter] = useState<"All" | StudyBlock["day"]>("All");

  // New session form state
  const [showAddSession, setShowAddSession] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionSubject, setSessionSubject] = useState("Computer Science");
  const [sessionDay, setSessionDay] = useState<StudyBlock["day"]>("Thu");
  const [sessionTime, setSessionTime] = useState("06:00 PM");
  const [sessionDuration, setSessionDuration] = useState(35);
  const [sessionMode, setSessionMode] =
    useState<StudyBlock["mode"]>("AI Tutor");

  // New goal form state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalSubject, setGoalSubject] = useState("Physics");
  const [goalTarget, setGoalTarget] = useState(5);
  const [goalUnit, setGoalUnit] = useState("lessons");
  const [goalDue, setGoalDue] = useState("Nov 24");

  const filteredBlocks =
    dayFilter === "All"
      ? schedule
      : schedule.filter((b) => b.day === dayFilter);

  const completedCount = schedule.filter((b) => b.completed).length;
  const totalScheduledMinutes = schedule.reduce(
    (sum, b) => sum + b.durationMinutes,
    0
  );

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;
    onAddBlock({
      id: `sched-${Date.now()}`,
      day: sessionDay,
      timeSlot: sessionTime.trim() || "05:00 PM",
      title: sessionTitle.trim(),
      subject: sessionSubject.trim() || "General",
      durationMinutes: Number(sessionDuration) || 30,
      mode: sessionMode,
      completed: false,
    });
    setSessionTitle("");
    setShowAddSession(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    onAddGoal({
      id: `goal-${Date.now()}`,
      title: goalTitle.trim(),
      subject: goalSubject.trim() || "General",
      targetValue: Math.max(1, Number(goalTarget) || 5),
      currentValue: 0,
      unit: goalUnit.trim() || "units",
      dueDate: goalDue.trim() || "Next Week",
    });
    setGoalTitle("");
    setShowAddGoal(false);
  };

  return (
    <div className="space-y-8">
      {/* Study Goals */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-[#161F42]">
              Active Study Goals
            </h1>
            <p className="text-sm text-[#475569]">
              Track weekly milestones and log progress directly as you study.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddGoal((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D5E9] bg-white px-3.5 py-2 text-xs font-medium text-[#161F42] hover:bg-[#F1F0FB] whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{showAddGoal ? "Cancel" : "Add Goal"}</span>
          </button>
        </div>

        {showAddGoal && (
          <form
            onSubmit={handleCreateGoal}
            className="grid grid-cols-1 gap-3 rounded-xl border border-[#E4E3F5] bg-white p-5 sm:grid-cols-12"
          >
            <div className="sm:col-span-5">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Goal Description
              </label>
              <input
                type="text"
                required
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Complete 5 Linear Algebra quizzes"
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-sm focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Subject
              </label>
              <input
                type="text"
                value={goalSubject}
                onChange={(e) => setGoalSubject(e.target.value)}
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-sm focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Target
              </label>
              <input
                type="number"
                min={1}
                value={goalTarget}
                onChange={(e) => setGoalTarget(Number(e.target.value))}
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-sm tabular-nums focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Unit
              </label>
              <input
                type="text"
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-sm focus:border-[#5B53E6] focus:bg-white focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#334175]">
                  Due
                </label>
                <input
                  type="text"
                  value={goalDue}
                  onChange={(e) => setGoalDue(e.target.value)}
                  className="w-full rounded-lg border border-[#D6D5E9] bg-[#F8F9FC] px-3 py-2 text-sm focus:border-[#5B53E6] focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-[38px] rounded-lg bg-[#161F42] px-3.5 text-xs font-medium text-white hover:bg-[#222E5E]"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {goals.map((goal) => {
            const pct = Math.min(
              100,
              Math.round((goal.currentValue / goal.targetValue) * 100)
            );
            const step = goal.unit === "min" ? 15 : goal.unit === "%" ? 5 : 1;

            return (
              <article
                key={goal.id}
                className="flex flex-col justify-between rounded-xl border border-[#E4E3F5] bg-white p-5 space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-medium text-[#5B53E6]">
                      {goal.subject}
                    </span>
                    <span>Due {goal.dueDate}</span>
                  </div>
                  <h2 className="font-display text-base font-semibold text-[#161F42]">
                    {goal.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs text-[#475569] tabular-nums">
                      <span>
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="font-semibold text-[#161F42]">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1F0FB]">
                      <div
                        className="h-full rounded-full bg-[#5B53E6] transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={goal.currentValue <= 0}
                      onClick={() => onIncrementGoal(goal.id, -step)}
                      className="rounded-md border border-[#E4E3F5] px-2.5 py-1 text-xs font-medium text-[#475569] hover:bg-[#F8F9FC] disabled:opacity-40 tabular-nums"
                    >
                      -{step} {goal.unit}
                    </button>
                    <button
                      type="button"
                      disabled={goal.currentValue >= goal.targetValue}
                      onClick={() => onIncrementGoal(goal.id, step)}
                      className="rounded-md bg-[#F1F0FB] px-2.5 py-1 text-xs font-medium text-[#161F42] hover:bg-[#E4E3F5] disabled:opacity-40 tabular-nums"
                    >
                      +{step} {goal.unit}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Daily Study Schedule */}
      <section className="rounded-xl border border-[#E4E3F5] bg-white p-6 space-y-5">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E3F5] pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#161F42]">
              Weekly Study Schedule
            </h2>
            <p className="text-xs text-[#64748B] tabular-nums">
              {completedCount} of {schedule.length} sessions completed ·{" "}
              {totalScheduledMinutes} min planned this week
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSession((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#161F42] px-4 py-2 text-xs font-medium text-white hover:bg-[#222E5E] whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{showAddSession ? "Close Form" : "Schedule Session"}</span>
          </button>
        </div>

        {showAddSession && (
          <form
            onSubmit={handleCreateSession}
            className="grid grid-cols-1 gap-3 rounded-xl border border-[#E4E3F5] bg-[#F8F9FC] p-4 sm:grid-cols-12"
          >
            <div className="sm:col-span-4">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Study Session Title
              </label>
              <input
                type="text"
                required
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g. Stokes' Theorem Problem Set"
                className="w-full rounded-lg border border-[#D6D5E9] bg-white px-3 py-2 text-sm focus:border-[#5B53E6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Subject
              </label>
              <input
                type="text"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                className="w-full rounded-lg border border-[#D6D5E9] bg-white px-3 py-2 text-sm focus:border-[#5B53E6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Day & Mode
              </label>
              <div className="flex gap-1.5">
                <select
                  value={sessionDay}
                  onChange={(e) =>
                    setSessionDay(e.target.value as StudyBlock["day"])
                  }
                  className="rounded-lg border border-[#D6D5E9] bg-white px-2 py-2 text-xs focus:border-[#5B53E6] focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={sessionMode}
                  onChange={(e) =>
                    setSessionMode(e.target.value as StudyBlock["mode"])
                  }
                  className="flex-1 rounded-lg border border-[#D6D5E9] bg-white px-2 py-2 text-xs focus:border-[#5B53E6] focus:outline-none"
                >
                  <option value="AI Tutor">AI Tutor</option>
                  <option value="Learning Path">Path</option>
                  <option value="Quiz Practice">Quiz</option>
                  <option value="Review">Review</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-[#334175]">
                Time Slot
              </label>
              <input
                type="text"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full rounded-lg border border-[#D6D5E9] bg-white px-3 py-2 text-sm focus:border-[#5B53E6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-[#334175]">
                  Minutes
                </label>
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#D6D5E9] bg-white px-3 py-2 text-sm tabular-nums focus:border-[#5B53E6] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-[38px] rounded-lg bg-[#5B53E6] px-3.5 text-xs font-medium text-white hover:bg-[#4B43D6]"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Day Filter Segmented Bar */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F1F0FB] p-1 w-fit">
          {(["All", ...DAYS] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setDayFilter(day)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                dayFilter === day
                  ? "bg-white text-[#161F42] shadow-xs"
                  : "text-[#475569] hover:text-[#161F42]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {filteredBlocks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D6D5E9] py-10 text-center text-sm text-[#64748B]">
            No study sessions scheduled for {dayFilter}. Click "Schedule Session" to add one.
          </div>
        ) : (
          <div className="divide-y divide-[#E4E3F5]">
            {filteredBlocks.map((block) => (
              <div
                key={block.id}
                className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleBlock(block.id)}
                    aria-label={
                      block.completed
                        ? `Mark ${block.title} incomplete`
                        : `Mark ${block.title} complete`
                    }
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      block.completed
                        ? "border-[#059669] bg-[#059669] text-white"
                        : "border-[#CBD5E1] bg-white hover:border-[#5B53E6]"
                    }`}
                  >
                    {block.completed && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        block.completed
                          ? "text-[#64748B] line-through"
                          : "text-[#161F42]"
                      }`}
                    >
                      {block.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {block.day} · {block.timeSlot}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{block.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{block.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[#334175] tabular-nums">
                    <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                    {block.durationMinutes} min
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteBlock(block.id)}
                    aria-label={`Remove ${block.title}`}
                    className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
