import React, { useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  Flame,
  LayoutDashboard,
  Menu,
  MessageSquare,
  RotateCcw,
  Target,
  X,
} from "lucide-react";
import { STUDENT_AVATAR_URL } from "../data/demoData";
import type { PageId } from "../types/learning";

interface AppShellProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  studentName: string;
  academicTrack: string;
  streakDays: number;
  onResetDemo: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tutor", label: "AI Tutor", icon: MessageSquare },
  { id: "learning-path", label: "Learning Path", icon: BookOpen },
  { id: "quiz", label: "Quiz Generator", icon: CheckCircle2 },
  { id: "adaptive", label: "Adaptive Learning", icon: Compass },
  { id: "planner", label: "Study Planner", icon: CalendarDays },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: "Dashboard",
  tutor: "AI Tutor",
  "learning-path": "Learning Path",
  quiz: "Quiz Generator",
  adaptive: "Adaptive Learning",
  planner: "Study Planner",
  analytics: "Analytics",
};

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  onSelectPage,
  studentName,
  academicTrack,
  streakDays,
  onResetDemo,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleNavClick = (page: PageId) => {
    onSelectPage(page);
    setMobileMenuOpen(false);
  };

  const handleReset = () => {
    onResetDemo();
    setResetConfirmed(true);
    window.setTimeout(() => setResetConfirmed(false), 2200);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#161F42] text-white">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <button
            type="button"
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B74F5] rounded-md"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="28" height="28" rx="7" fill="#5B53E6" />
              <path
                d="M8.5 14C8.5 10.9624 10.9624 8.5 14 8.5C16.25 8.5 18.18 9.85 19.04 11.79"
                stroke="white"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              <path
                d="M19.5 14C19.5 17.0376 17.0376 19.5 14 19.5C11.75 19.5 9.82 18.15 8.96 16.21"
                stroke="#CFCBF0"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              <circle cx="14" cy="14" r="2.2" fill="white" />
            </svg>
            <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              LearnLoop AI
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-5" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B74F5] ${
                  isActive
                    ? "bg-[#5B53E6] text-white"
                    : "text-[#C7CBE1] hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          {!avatarError ? (
            <img
              src={STUDENT_AVATAR_URL}
              alt={studentName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="h-10 w-10 rounded-full object-cover border border-white/20 shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5B53E6] font-display text-sm font-semibold text-white shrink-0">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {studentName}
            </p>
            <p className="truncate text-xs text-[#A5ACCE]">{academicTrack}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-[#D5D8EC] transition-colors hover:bg-white/10 hover:text-white whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{resetConfirmed ? "Demo Data Restored" : "Reset Demo Progress"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] text-[#111827]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#0D132B]/50 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[80vw]">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Frame */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-8 border-b border-[#E4E3F5] bg-white/95 px-4 backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-[#E4E3F5] p-2 text-[#161F42] hover:bg-[#F1F0FB] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-[#64748B] whitespace-nowrap">
                LearnLoop AI
              </span>
              <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">
                /
              </span>
              <span className="truncate font-display text-base font-semibold text-[#161F42]">
                {PAGE_TITLES[activePage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#334175] tabular-nums whitespace-nowrap shrink-0">
              <Flame className="h-4 w-4 text-[#5B53E6]" aria-hidden="true" />
              <span>{streakDays}-day streak</span>
            </div>

            {activePage !== "tutor" ? (
              <button
                type="button"
                onClick={() => onSelectPage("tutor")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B53E6]"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Ask AI Tutor</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectPage("quiz")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#161F42] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#222E5E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B53E6]"
              >
                <Target className="h-4 w-4" />
                <span>Practice Quiz</span>
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1220px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
