import React, { useState, useEffect } from 'react';
import { Screen0Boot } from './screens/Screen0Boot';
import { Screen1Vigil } from './screens/Screen1Vigil';
import { Screen2Briefing } from './screens/Screen2Briefing';
import { Screen3Battle } from './screens/Screen3Battle';
import { Screen4Debrief } from './screens/Screen4Debrief';
import { Screen5Archive } from './screens/Screen5Archive';
import { StreakResetScreen } from './components/StreakResetScreen';
import { ArcCompleteScreen } from './components/ArcCompleteScreen';

import { getQuoteForDay, getRandomQuote } from './data/quotes';
import { getWorkoutForDay } from './data/workoutPlan';
import {
  computeArcDay,
  getWorkoutLogs,
  saveWorkoutLog,
  getSettings,
  saveSettings,
  calculateStreakData,
  getBodyMetrics,
  saveBodyMetricEntry,
  getBestRecords,
  saveBestRecord
} from './utils/storage';
import { playLockInSound } from './utils/audio';

export function App() {
  const [settings, setSettingsState] = useState(getSettings());
  const [logs, setLogsState] = useState(getWorkoutLogs());
  const [bodyMetrics, setBodyMetricsState] = useState(getBodyMetrics());
  const [bestRecords, setBestRecordsState] = useState(getBestRecords());

  // MISSION-SEQUENCE ACTIVE SCREEN (0: BOOT, 1: VIGIL, 2: BRIEFING, 3: BATTLE, 4: DEBRIEF, 5: ARCHIVE)
  const [activeScreen, setActiveScreen] = useState(0);
  const [lastSummaryData, setLastSummaryData] = useState(null);
  const [showResetScreen, setShowResetScreen] = useState(false);

  // PWA Install prompt state
  const [installPrompt, setInstallPrompt] = useState(null);

  // Compute active arc day
  const arcDay = computeArcDay(settings.simulatedArcDay);
  const streakData = calculateStreakData(arcDay, logs, settings);

  // Quote State
  const [activeQuote, setActiveQuote] = useState(() => getQuoteForDay(arcDay));
  const todayWorkout = getWorkoutForDay(arcDay);
  const isWorkoutDoneToday = Boolean(logs[arcDay] && logs[arcDay].completionTimestamp);

  useEffect(() => {
    setActiveQuote(getQuoteForDay(arcDay));
  }, [arcDay]);

  // Check for PWA install capability
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert("To install Winter Arc:\n\n• On iOS (Safari): Tap the Share icon -> 'Add to Home Screen'\n• On Android/Chrome: Tap menu -> 'Install App'");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Launch Workout from Briefing -> Battle
  const handleLockIn = () => {
    if (settings.soundEnabled) {
      playLockInSound();
    }
    setActiveScreen(3); // Screen 3: THE BATTLE
  };

  // Implicit or explicit completion from Battle -> Debrief
  const handleCompleteWorkout = (summary) => {
    const duration = summary.duration || 3600;
    const updatedLogs = saveWorkoutLog({
      dayNumber: arcDay,
      date: new Date().toISOString().split('T')[0],
      duration: duration,
      exercisesCompleted: todayWorkout.exercises.map(e => e.id),
      completionTimestamp: new Date().toISOString()
    });

    if (updatedLogs) {
      setLogsState({ ...updatedLogs });
    }

    setLastSummaryData(summary);
    setActiveScreen(4); // Screen 4: THE DEBRIEF
  };

  // Shuffle Quote (Hold quote)
  const handleShuffleQuote = () => {
    setActiveQuote(getRandomQuote());
  };

  // Settings
  const handleUpdateSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const handleSimulateDay = (day) => {
    handleUpdateSettings({
      ...settings,
      simulatedArcDay: day
    });
  };

  // Toggle Day in Calendar view
  const handleToggleDayStatus = (dayNum) => {
    const newLogs = { ...logs };
    if (newLogs[dayNum] && newLogs[dayNum].completionTimestamp) {
      delete newLogs[dayNum];
    } else {
      newLogs[dayNum] = {
        dayNumber: dayNum,
        date: new Date().toISOString().split('T')[0],
        duration: 3600,
        exercisesCompleted: [],
        completionTimestamp: new Date().toISOString()
      };
    }
    localStorage.setItem("winter_arc_logs_v1", JSON.stringify(newLogs));
    setLogsState(newLogs);
  };

  const handleSaveBodyMetric = (entry) => {
    const updated = saveBodyMetricEntry(entry);
    setBodyMetricsState([...updated]);
  };

  const handleSaveRecord = (key, val) => {
    const updated = saveBestRecord(key, val);
    if (updated) setBestRecordsState({ ...updated });
  };

  const handleBeginAgain = () => {
    setShowResetScreen(false);
    handleSimulateDay(1);
    setActiveScreen(1);
  };

  // Check if Arc is completely finished (arcDay > 90)
  if (arcDay > 90) {
    return (
      <div className="app-viewport">
        <ArcCompleteScreen
          streakData={streakData}
          onStartNewArc={() => {
            localStorage.clear();
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Check if Streak Reset screen is triggered
  if (showResetScreen) {
    return (
      <div className="app-viewport">
        <StreakResetScreen
          missedDay={streakData.missedDayDetected || arcDay - 1}
          onBeginAgain={handleBeginAgain}
          soundEnabled={settings.soundEnabled}
        />
      </div>
    );
  }

  return (
    <div className="app-viewport">
      {/* SCREEN 0: BOOT / CHECK-IN */}
      {activeScreen === 0 && (
        <Screen0Boot
          isWorkoutDoneToday={isWorkoutDoneToday}
          soundEnabled={settings.soundEnabled}
          onComplete={() => setActiveScreen(1)}
        />
      )}

      {/* SCREEN 1: THE VIGIL (Status screen — giant streak ring ONLY) */}
      {activeScreen === 1 && (
        <Screen1Vigil
          arcDay={arcDay}
          streakCount={streakData.currentStreak}
          totalDays={90}
          onProceedToBriefing={() => setActiveScreen(2)}
          onOpenArchive={() => setActiveScreen(5)}
        />
      )}

      {/* SCREEN 2: THE BRIEFING (Quote + today's mission card + Lock In) */}
      {activeScreen === 2 && (
        <Screen2Briefing
          quote={activeQuote}
          workout={todayWorkout}
          onShuffleQuote={handleShuffleQuote}
          onLockIn={handleLockIn}
          onBackToVigil={() => setActiveScreen(1)}
        />
      )}

      {/* SCREEN 3: THE BATTLE (Workout mode — one exercise at a time, zero scrolling) */}
      {activeScreen === 3 && (
        <Screen3Battle
          workout={todayWorkout}
          arcDay={arcDay}
          restTimerConfig={settings.restTimerDuration}
          soundEnabled={settings.soundEnabled}
          onCompleteWorkout={handleCompleteWorkout}
          onExitWorkout={() => setActiveScreen(1)}
        />
      )}

      {/* SCREEN 4: THE DEBRIEF (Post-workout victory beat + quick stats) */}
      {activeScreen === 4 && (
        <Screen4Debrief
          arcDay={arcDay}
          summaryData={lastSummaryData}
          streakCount={streakData.currentStreak}
          soundEnabled={settings.soundEnabled}
          onReturnToVigil={() => setActiveScreen(1)}
        />
      )}

      {/* SCREEN 5: THE ARCHIVE (Secondary content hub: Heatmap, Stats, Plan, Settings) */}
      {activeScreen === 5 && (
        <Screen5Archive
          arcDay={arcDay}
          logs={logs}
          streakData={streakData}
          bodyMetrics={bodyMetrics}
          bestRecords={bestRecords}
          settings={settings}
          onSaveBodyMetric={handleSaveBodyMetric}
          onSaveRecord={handleSaveRecord}
          onUpdateSettings={handleUpdateSettings}
          onSimulateDay={handleSimulateDay}
          onToggleDayStatus={handleToggleDayStatus}
          onTriggerResetScreen={() => setShowResetScreen(true)}
          onBackToVigil={() => setActiveScreen(1)}
          canInstall={Boolean(installPrompt)}
          onInstallClick={handleInstallClick}
        />
      )}
    </div>
  );
}

export default App;
