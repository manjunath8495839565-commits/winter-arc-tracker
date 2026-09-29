import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HeroStreak } from './components/HeroStreak';
import { QuoteBlock } from './components/QuoteBlock';
import { TodayWorkoutCard } from './components/TodayWorkoutCard';
import { GymMode } from './components/GymMode';
import { StreakResetScreen } from './components/StreakResetScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { StatsScreen } from './components/StatsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ArcCompleteScreen, CelebrationModal } from './components/ArcCompleteScreen';

import { getQuoteForDay, getRandomQuote } from './data/quotes';
import { getWorkoutForDay } from './data/workoutPlan';
import {
  computeArcDay,
  isWorkoutWindowOpen,
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
import { playLockInSound, playFireCrackleSound } from './utils/audio';

export function App() {
  const [settings, setSettingsState] = useState(getSettings());
  const [logs, setLogsState] = useState(getWorkoutLogs());
  const [bodyMetrics, setBodyMetricsState] = useState(getBodyMetrics());
  const [bestRecords, setBestRecordsState] = useState(getBestRecords());

  const [activeTab, setActiveTab] = useState('home');
  const [isGymMode, setIsGymMode] = useState(false);
  const [showResetScreen, setShowResetScreen] = useState(false);
  const [celebrationDay, setCelebrationDay] = useState(null);

  // PWA Install prompt state
  const [installPrompt, setInstallPrompt] = useState(null);

  // Compute active arc day (1-90 or beyond)
  const arcDay = computeArcDay(settings.simulatedArcDay);

  // Streak calculations
  const streakData = calculateStreakData(arcDay, logs, settings);

  // Quote state
  const [activeQuote, setActiveQuote] = useState(() => getQuoteForDay(arcDay));

  // Today & Tomorrow workout templates
  const todayWorkout = getWorkoutForDay(arcDay);
  const tomorrowWorkout = getWorkoutForDay(arcDay + 1);
  const isCompletedToday = Boolean(logs[arcDay] && logs[arcDay].completionTimestamp);

  // Update quote when arcDay changes
  useEffect(() => {
    setActiveQuote(getQuoteForDay(arcDay));
  }, [arcDay]);

  // Listen for PWA beforeinstallprompt
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
      alert("To install Winter Arc:\n\n• On iOS (Safari): Tap the Share icon -> 'Add to Home Screen'\n• On Android/Chrome: Tap the 3-dots menu -> 'Install App'");
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Launch Gym Mode with intense Lock In sound
  const handleLockIn = () => {
    if (settings.soundEnabled) {
      playLockInSound();
    }
    setIsGymMode(true);
  };

  // Complete Workout Flow
  const handleCompleteWorkout = (durationSecs) => {
    const updatedLogs = saveWorkoutLog({
      dayNumber: arcDay,
      date: new Date().toISOString().split('T')[0],
      duration: durationSecs,
      exercisesCompleted: todayWorkout.exercises.map(e => e.id),
      completionTimestamp: new Date().toISOString()
    });

    if (updatedLogs) {
      setLogsState({ ...updatedLogs });
    }

    setIsGymMode(false);

    // Play Fire Crackle Sound
    if (settings.soundEnabled) {
      playFireCrackleSound();
    }

    // Trigger 200ms ember vignette flash & 2-second celebration banner
    setCelebrationDay(arcDay);
    setTimeout(() => {
      setCelebrationDay(null);
    }, 2200);
  };

  // Shuffle Quote
  const handleShuffleQuote = () => {
    setActiveQuote(getRandomQuote());
  };

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  // Simulate Day (for testing Days 1-90)
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

  // Save Body Metric
  const handleSaveBodyMetric = (entry) => {
    const updated = saveBodyMetricEntry(entry);
    setBodyMetricsState([...updated]);
  };

  // Save Best Record
  const handleSaveRecord = (key, val) => {
    const updated = saveBestRecord(key, val);
    if (updated) setBestRecordsState({ ...updated });
  };

  // Begin Again after streak reset
  const handleBeginAgain = () => {
    setShowResetScreen(false);
    // Restart from Day 1
    handleSimulateDay(1);
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
      {/* Top Bar Header */}
      <Header
        arcDay={arcDay}
        onOpenSettings={() => setActiveTab('settings')}
        onInstallClick={handleInstallClick}
        canInstall={Boolean(installPrompt)}
      />

      {/* Main Tab Screens */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'home' && (
          <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Hero Streak Block with Circular Progress Ring & Flicker Flame */}
            <HeroStreak
              arcDay={arcDay}
              streakCount={streakData.currentStreak}
              totalDays={90}
            />

            {/* Stoic Quote Block with thin dividers */}
            <QuoteBlock
              quote={activeQuote}
              onShuffle={handleShuffleQuote}
            />

            {/* Today's Workout Card with massive "LOCK IN — 6:00 AM" */}
            <TodayWorkoutCard
              workout={todayWorkout}
              tomorrowWorkout={tomorrowWorkout}
              isCompletedToday={isCompletedToday}
              onLockIn={handleLockIn}
              showTomorrowPreview={isCompletedToday || !isWorkoutWindowOpen()}
            />
          </div>
        )}

        {activeTab === 'plan' && (
          <CalendarScreen
            arcDay={arcDay}
            logs={logs}
            streakData={streakData}
            onToggleDayStatus={handleToggleDayStatus}
          />
        )}

        {activeTab === 'stats' && (
          <StatsScreen
            streakData={streakData}
            bodyMetrics={bodyMetrics}
            onSaveBodyMetric={handleSaveBodyMetric}
            bestRecords={bestRecords}
            onSaveRecord={handleSaveRecord}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            streakData={streakData}
            arcDay={arcDay}
            onSimulateDay={handleSimulateDay}
            onTriggerResetScreen={() => setShowResetScreen(true)}
            canInstall={Boolean(installPrompt)}
            onInstallClick={handleInstallClick}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Gym Mode Screen (Full screen black, one-handed) */}
      {isGymMode && (
        <GymMode
          workout={todayWorkout}
          arcDay={arcDay}
          onCompleteWorkout={handleCompleteWorkout}
          onCloseGym={() => setIsGymMode(false)}
          restTimerConfig={settings.restTimerDuration}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {/* 200ms Ember Vignette Flash & 2-Second Victory Banner */}
      {celebrationDay && (
        <CelebrationModal arcDay={celebrationDay} />
      )}
    </div>
  );
}

export default App;
