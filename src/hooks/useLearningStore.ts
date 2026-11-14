import { useCallback, useEffect, useMemo, useState } from "react";
import { INITIAL_DEMO_STATE } from "../data/demoData";
import type {
  AdaptiveInsight,
  LearningPath,
  NavigationPrefill,
  PageId,
  QuizAttempt,
  StudentState,
  StudyBlock,
  StudyGoal,
  TutorMessage,
} from "../types/learning";

const STORAGE_KEY = "learnloop_ai_student_state_v1";

function loadInitialState(): StudentState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DEMO_STATE;
    const parsed = JSON.parse(raw) as Partial<StudentState>;
    if (!parsed || !Array.isArray(parsed.courses) || !Array.isArray(parsed.quizHistory)) {
      return INITIAL_DEMO_STATE;
    }
    return {
      ...INITIAL_DEMO_STATE,
      ...parsed,
    };
  } catch {
    return INITIAL_DEMO_STATE;
  }
}

export function useLearningStore() {
  const [state, setState] = useState<StudentState>(loadInitialState);
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [prefill, setPrefill] = useState<NavigationPrefill | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const navigateWithContext = useCallback(
    (page: PageId, nextPrefill?: NavigationPrefill) => {
      setPrefill(nextPrefill ?? null);
      setActivePage(page);
    },
    []
  );

  const clearPrefill = useCallback(() => {
    setPrefill(null);
  }, []);

  const addTutorMessages = useCallback((newMessages: TutorMessage[]) => {
    setState((prev) => ({
      ...prev,
      tutorHistory: [...prev.tutorHistory, ...newMessages].slice(-40),
    }));
  }, []);

  const clearTutorHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tutorHistory: [
        {
          id: `msg-reset-${Date.now()}`,
          role: "assistant",
          content:
            "Started a fresh tutoring session. Tell me which concept, formula, or problem you want to break down.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));
  }, []);

  const addLearningPath = useCallback((path: LearningPath) => {
    setState((prev) => ({
      ...prev,
      learningPaths: [path, ...prev.learningPaths],
      activePathId: path.id,
    }));
  }, []);

  const setActivePathId = useCallback((pathId: string) => {
    setState((prev) => ({
      ...prev,
      activePathId: pathId,
    }));
  }, []);

  const toggleLessonComplete = useCallback((pathId: string, lessonId: string) => {
    setState((prev) => {
      let deltaMinutes = 0;
      const updatedPaths = prev.learningPaths.map((p) => {
        if (p.id !== pathId) return p;
        const toggleStage = (lessons: typeof p.stages.beginner) =>
          lessons.map((l) => {
            if (l.id !== lessonId) return l;
            const nextDone = !l.completed;
            deltaMinutes = nextDone ? Math.min(l.estimatedMinutes, 30) : 0;
            return { ...l, completed: nextDone };
          });
        return {
          ...p,
          stages: {
            beginner: toggleStage(p.stages.beginner),
            intermediate: toggleStage(p.stages.intermediate),
            advanced: toggleStage(p.stages.advanced),
          },
        };
      });

      const updatedActivity =
        deltaMinutes > 0
          ? prev.dailyActivity.map((d, idx) =>
              idx === prev.dailyActivity.length - 1
                ? { ...d, minutes: d.minutes + deltaMinutes }
                : d
            )
          : prev.dailyActivity;

      return {
        ...prev,
        learningPaths: updatedPaths,
        dailyActivity: updatedActivity,
      };
    });
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttempt) => {
    setState((prev) => {
      const updatedCourses = prev.courses.map((course) => {
        if (course.subject.toLowerCase() !== attempt.subject.toLowerCase()) {
          return course;
        }
        const nextProgress = Math.min(100, course.progress + (attempt.percentage >= 70 ? 6 : 2));
        const nextCompleted = Math.min(
          course.totalLessons,
          course.completedLessons + (attempt.percentage >= 70 ? 1 : 0)
        );
        const nextMastery: typeof course.masteryLevel =
          attempt.percentage >= 80
            ? "Strong"
            : attempt.percentage >= 60
              ? "Developing"
              : "Needs Focus";
        return {
          ...course,
          progress: nextProgress,
          completedLessons: nextCompleted,
          masteryLevel: nextMastery,
          lastStudied: "Just now",
        };
      });

      const addedMinutes = Math.max(5, Math.round(attempt.durationSeconds / 60));
      const updatedActivity = prev.dailyActivity.map((d, idx) => {
        if (idx !== prev.dailyActivity.length - 1) return d;
        const totalQuizzes = d.quizzesCompleted + 1;
        const blendedAccuracy = Math.round(
          (d.accuracy * d.quizzesCompleted + attempt.percentage) / totalQuizzes
        );
        return {
          ...d,
          minutes: d.minutes + addedMinutes,
          quizzesCompleted: totalQuizzes,
          accuracy: blendedAccuracy,
        };
      });

      return {
        ...prev,
        quizHistory: [attempt, ...prev.quizHistory],
        courses: updatedCourses,
        dailyActivity: updatedActivity,
      };
    });
  }, []);

  const toggleStudyBlock = useCallback((blockId: string) => {
    setState((prev) => ({
      ...prev,
      studySchedule: prev.studySchedule.map((b) =>
        b.id === blockId ? { ...b, completed: !b.completed } : b
      ),
    }));
  }, []);

  const addStudyBlock = useCallback((block: StudyBlock) => {
    setState((prev) => ({
      ...prev,
      studySchedule: [...prev.studySchedule, block],
    }));
  }, []);

  const deleteStudyBlock = useCallback((blockId: string) => {
    setState((prev) => ({
      ...prev,
      studySchedule: prev.studySchedule.filter((b) => b.id !== blockId),
    }));
  }, []);

  const addStudyGoal = useCallback((goal: StudyGoal) => {
    setState((prev) => ({
      ...prev,
      studyGoals: [goal, ...prev.studyGoals],
    }));
  }, []);

  const incrementGoalProgress = useCallback((goalId: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      studyGoals: prev.studyGoals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              currentValue: Math.max(0, Math.min(g.targetValue, g.currentValue + delta)),
            }
          : g
      ),
    }));
  }, []);

  const updateAdaptiveInsight = useCallback((insight: AdaptiveInsight) => {
    setState((prev) => ({
      ...prev,
      adaptiveInsight: insight,
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(INITIAL_DEMO_STATE);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_STATE));
    } catch {
      // Ignore
    }
  }, []);

  const derivedMetrics = useMemo(() => {
    const totalStudyMinutes = state.dailyActivity.reduce((acc, d) => acc + d.minutes, 0);
    const averageQuizScore =
      state.quizHistory.length > 0
        ? Math.round(
            state.quizHistory.reduce((acc, q) => acc + q.percentage, 0) /
              state.quizHistory.length
          )
        : 0;

    const weakTopicCounts = new Map<string, { topic: string; subject: string; count: number }>();
    for (const attempt of state.quizHistory) {
      for (const concept of attempt.weakConcepts) {
        const key = `${attempt.subject}::${concept}`;
        const existing = weakTopicCounts.get(key);
        weakTopicCounts.set(key, {
          topic: concept,
          subject: attempt.subject,
          count: (existing?.count ?? 0) + 1,
        });
      }
    }

    const aggregatedWeakTopics = Array.from(weakTopicCounts.values()).sort(
      (a, b) => b.count - a.count
    );

    const overallCourseProgress =
      state.courses.length > 0
        ? Math.round(
            state.courses.reduce((acc, c) => acc + c.progress, 0) / state.courses.length
          )
        : 0;

    return {
      totalStudyMinutes,
      averageQuizScore,
      aggregatedWeakTopics,
      overallCourseProgress,
    };
  }, [state]);

  return {
    state,
    activePage,
    setActivePage,
    prefill,
    clearPrefill,
    navigateWithContext,
    addTutorMessages,
    clearTutorHistory,
    addLearningPath,
    setActivePathId,
    toggleLessonComplete,
    recordQuizAttempt,
    toggleStudyBlock,
    addStudyBlock,
    deleteStudyBlock,
    addStudyGoal,
    incrementGoalProgress,
    updateAdaptiveInsight,
    resetDemoData,
    derivedMetrics,
  };
}
