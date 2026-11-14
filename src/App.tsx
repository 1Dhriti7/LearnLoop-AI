import { MotionConfig } from "motion/react";
import { AdaptiveLearningView } from "./components/AdaptiveLearningView";
import { AnalyticsView } from "./components/AnalyticsView";
import { AppShell } from "./components/AppShell";
import { DashboardView } from "./components/DashboardView";
import { LearningPathView } from "./components/LearningPathView";
import { QuizView } from "./components/QuizView";
import { StudyPlannerView } from "./components/StudyPlannerView";
import { TutorView } from "./components/TutorView";
import { useLearningStore } from "./hooks/useLearningStore";

export default function App() {
  const {
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
  } = useLearningStore();

  return (
    <MotionConfig reducedMotion="user">
      <AppShell
        activePage={activePage}
        onSelectPage={(page) => navigateWithContext(page)}
        studentName={state.studentName}
        academicTrack={state.academicTrack}
        streakDays={state.streakDays}
        onResetDemo={resetDemoData}
      >
        {activePage === "dashboard" && (
          <DashboardView
            state={state}
            derivedMetrics={derivedMetrics}
            onNavigate={navigateWithContext}
          />
        )}

        {activePage === "tutor" && (
          <TutorView
            messages={state.tutorHistory}
            prefill={prefill}
            onClearPrefill={clearPrefill}
            onAddMessages={addTutorMessages}
            onResetChat={clearTutorHistory}
          />
        )}

        {activePage === "learning-path" && (
          <LearningPathView
            paths={state.learningPaths}
            activePathId={state.activePathId}
            prefill={prefill}
            onClearPrefill={clearPrefill}
            onSelectPath={setActivePathId}
            onAddPath={addLearningPath}
            onToggleLesson={toggleLessonComplete}
            onNavigate={navigateWithContext}
          />
        )}

        {activePage === "quiz" && (
          <QuizView
            quizHistory={state.quizHistory}
            prefill={prefill}
            onClearPrefill={clearPrefill}
            onRecordAttempt={recordQuizAttempt}
            onNavigate={navigateWithContext}
          />
        )}

        {activePage === "adaptive" && (
          <AdaptiveLearningView
            insight={state.adaptiveInsight}
            quizHistory={state.quizHistory}
            courses={state.courses}
            weakTopics={derivedMetrics.aggregatedWeakTopics}
            onUpdateInsight={updateAdaptiveInsight}
            onNavigate={navigateWithContext}
          />
        )}

        {activePage === "planner" && (
          <StudyPlannerView
            schedule={state.studySchedule}
            goals={state.studyGoals}
            onToggleBlock={toggleStudyBlock}
            onAddBlock={addStudyBlock}
            onDeleteBlock={deleteStudyBlock}
            onAddGoal={addStudyGoal}
            onIncrementGoal={incrementGoalProgress}
          />
        )}

        {activePage === "analytics" && (
          <AnalyticsView
            dailyActivity={state.dailyActivity}
            quizHistory={state.quizHistory}
            courses={state.courses}
            weakTopics={derivedMetrics.aggregatedWeakTopics}
            onNavigate={navigateWithContext}
          />
        )}
      </AppShell>
    </MotionConfig>
  );
}
