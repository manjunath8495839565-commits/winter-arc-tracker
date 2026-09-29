/**
 * WINTER ARC — STORAGE & ENGINE LOGIC
 * Manages 90-day arc progression, streak calculation, logs, body metrics, and best records.
 * 100% offline, persistent via localStorage.
 */

const STORAGE_KEYS = {
  LOGS: "winter_arc_logs_v1",
  SETTINGS: "winter_arc_settings_v1",
  BODY_METRICS: "winter_arc_body_metrics_v1",
  BEST_RECORDS: "winter_arc_records_v1",
  WARRIOR_SAVE: "winter_arc_warrior_save_v1",
  RESET_OCCURRED: "winter_arc_reset_occurred_v1"
};

// Start date of the Winter Arc: October 1 of the current year (or 2026 as per system context)
export function getArcStartDate() {
  const now = new Date();
  const year = now.getFullYear();
  // Month is 0-indexed in JS (9 = October)
  return new Date(year, 9, 1, 0, 0, 0, 0);
}

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculate the Arc Day from real system date or simulated override
 */
export function computeArcDay(simulatedDay = null) {
  if (simulatedDay !== null && simulatedDay !== undefined && Number(simulatedDay) >= 1) {
    return Number(simulatedDay);
  }

  const startDate = getArcStartDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Number of days between Oct 1 and today
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const arcDay = diffDays + 1;

  // If before Oct 1, default to Day 1 preview or actual calculation
  if (arcDay < 1) return 1;
  return arcDay;
}

/**
 * Check if the current time is within the allowed workout window (5:00 AM - 11:59 PM)
 */
export function isWorkoutWindowOpen() {
  const now = new Date();
  const hours = now.getHours();
  // Allowed between 5:00 AM and 11:59 PM (5 to 23)
  return hours >= 5;
}

/**
 * Get all workout logs
 * Structure: { [dayNumber]: { date, dayNumber, duration, exercisesCompleted, completionTimestamp } }
 */
export function getWorkoutLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load logs", e);
    return {};
  }
}

/**
 * Save a completed workout log
 */
export function saveWorkoutLog(logData) {
  try {
    const logs = getWorkoutLogs();
    logs[logData.dayNumber] = {
      ...logData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return logs;
  } catch (e) {
    console.error("Failed to save log", e);
    return null;
  }
}

/**
 * Get user settings
 */
export function getSettings() {
  const defaults = {
    restTimerDuration: 60,       // 30, 45, 60, 90, 120
    warriorSaveEnabled: true,    // 1 grace pass per arc
    warriorSaveUsed: false,      // whether grace pass was consumed
    soundEnabled: true,
    vibrationEnabled: true,
    simulatedArcDay: null        // Can override current day for testing
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch (e) {
    return defaults;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

/**
 * Calculate Streaks & Completion Status
 */
export function calculateStreakData(currentDay, logs, settings) {
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  let missedDayDetected = null;
  let graceUsedOnDay = null;

  const warriorSaveAvailable = settings.warriorSaveEnabled && !settings.warriorSaveUsed;
  let usedGraceThisCheck = false;

  // We check days from 1 up to currentDay - 1
  for (let d = 1; d <= 90; d++) {
    if (d > currentDay) break;

    const isToday = d === currentDay;
    const isCompleted = Boolean(logs[d] && logs[d].completionTimestamp);

    if (isCompleted) {
      runningStreak += 1;
      if (runningStreak > longestStreak) longestStreak = runningStreak;
    } else if (!isToday) {
      // Past day not completed = MISSED DAY!
      if (warriorSaveAvailable && !usedGraceThisCheck) {
        // Protected by Warrior Save grace card!
        usedGraceThisCheck = true;
        graceUsedOnDay = d;
        // Streak remains alive
      } else {
        // STRICT RULE: miss even ONE day -> streak resets to 0/1
        missedDayDetected = d;
        runningStreak = 0;
      }
    } else {
      // It is today and not yet completed: streak holds previous days
    }
  }

  // Current streak is the active consecutive chain
  currentStreak = runningStreak;

  // Total completed workouts
  const totalWorkouts = Object.keys(logs).filter(k => logs[k] && logs[k].completionTimestamp).length;

  // Total hours trained (sum duration in seconds / 3600)
  const totalSeconds = Object.values(logs).reduce((acc, curr) => acc + (curr.duration || 3600), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalWorkouts,
    totalHours,
    missedDayDetected,
    graceUsedOnDay,
    usedGraceThisCheck
  };
}

/**
 * Body Metrics (Weight, Waist, Photo)
 */
export function getBodyMetrics() {
  const defaults = [
    { week: 1, date: "2026-10-04", weight: 78.5, waist: 84, photo: null }
  ];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BODY_METRICS);
    return raw ? JSON.parse(raw) : defaults;
  } catch (e) {
    return defaults;
  }
}

export function saveBodyMetricEntry(entry) {
  try {
    const list = getBodyMetrics();
    const existingIndex = list.findIndex(e => e.week === entry.week);
    if (existingIndex >= 0) {
      list[existingIndex] = entry;
    } else {
      list.push(entry);
    }
    // Sort by week
    list.sort((a, b) => a.week - b.week);
    localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error("Failed to save body metric", e);
    return [];
  }
}

/**
 * Beat-Your-Best Records
 */
export function getBestRecords() {
  const defaults = {
    pushups: { value: 45, date: "Oct 24", unit: "reps" },
    plank: { value: 180, date: "Nov 12", unit: "sec" },
    run5k: { value: "22:40", date: "Dec 01", unit: "time" }
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BEST_RECORDS);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch (e) {
    return defaults;
  }
}

export function saveBestRecord(key, value, date) {
  try {
    const records = getBestRecords();
    records[key] = {
      ...records[key],
      value,
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };
    localStorage.setItem(STORAGE_KEYS.BEST_RECORDS, JSON.stringify(records));
    return records;
  } catch (e) {
    console.error("Failed to save best record", e);
    return null;
  }
}

/**
 * Export Arc Data as JSON
 */
export function exportArcData() {
  const data = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    logs: getWorkoutLogs(),
    settings: getSettings(),
    metrics: getBodyMetrics(),
    records: getBestRecords()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `winter-arc-backup-${formatDateKey(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import Arc Data from JSON
 */
export function importArcData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.logs) localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(parsed.logs));
    if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
    if (parsed.metrics) localStorage.setItem(STORAGE_KEYS.BODY_METRICS, JSON.stringify(parsed.metrics));
    if (parsed.records) localStorage.setItem(STORAGE_KEYS.BEST_RECORDS, JSON.stringify(parsed.records));
    return true;
  } catch (e) {
    console.error("Import error", e);
    return false;
  }
}

/**
 * Wipe all data (Discipline has no rewind button)
 */
export function clearAllArcData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}
