/**
 * Streak and completion calculation logic.
 * Rest days (day 7) do NOT break the streak.
 */

import { getDayNumberForDate, formatDate } from "./utils";

interface WorkoutLogEntry {
  date: string;
  completed: boolean;
  dayNumber: number;
}

/**
 * Calculate the current streak: consecutive completed workout days
 * going backwards from today. Rest days are skipped (not counted
 * as breaking the streak).
 */
export function calculateCurrentStreak(
  logs: WorkoutLogEntry[],
  registrationDate: Date
): number {
  const logMap = new Map<string, boolean>();
  for (const log of logs) {
    logMap.set(log.date, log.completed);
  }

  let streak = 0;
  const today = new Date();
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Walk backwards from today
  while (current >= registrationDate) {
    const dateStr = formatDate(current);
    const dayNum = getDayNumberForDate(current, registrationDate);

    if (dayNum === 7) {
      // Rest day — skip, doesn't break or add to streak
      current.setDate(current.getDate() - 1);
      continue;
    }

    const completed = logMap.get(dateStr);
    if (completed === true) {
      streak++;
    } else if (completed === false) {
      // Explicitly skipped — streak broken
      break;
    } else {
      // No log entry — if it's today, skip (hasn't logged yet)
      // If it's a past day, streak is broken
      if (dateStr === formatDate(today)) {
        current.setDate(current.getDate() - 1);
        continue;
      }
      break;
    }

    current.setDate(current.getDate() - 1);
  }

  return streak;
}

/**
 * Calculate the longest streak ever achieved.
 */
export function calculateLongestStreak(
  logs: WorkoutLogEntry[],
  registrationDate: Date
): number {
  const logMap = new Map<string, boolean>();
  for (const log of logs) {
    logMap.set(log.date, log.completed);
  }

  let longest = 0;
  let current = 0;
  const today = new Date();
  const day = new Date(
    registrationDate.getFullYear(),
    registrationDate.getMonth(),
    registrationDate.getDate()
  );

  while (day <= today) {
    const dateStr = formatDate(day);
    const dayNum = getDayNumberForDate(day, registrationDate);

    if (dayNum === 7) {
      // Rest day — skip
      day.setDate(day.getDate() + 1);
      continue;
    }

    const completed = logMap.get(dateStr);
    if (completed === true) {
      current++;
      longest = Math.max(longest, current);
    } else if (completed === false) {
      current = 0;
    }
    // undefined (no log) for past days = missed = reset
    else if (dateStr !== formatDate(today)) {
      current = 0;
    }

    day.setDate(day.getDate() + 1);
  }

  return longest;
}

/**
 * Get weekly completion: X out of 6 workout days completed this week.
 */
export function getWeeklyCompletion(
  logs: WorkoutLogEntry[],
  weekStartDate: Date
): { completed: number; total: number } {
  const weekEnd = new Date(weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 6);

  let completed = 0;
  let total = 0;

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStartDate);
    day.setDate(day.getDate() + i);
    const dateStr = formatDate(day);

    const log = logs.find((l) => l.date === dateStr);
    if (log && log.dayNumber !== 7) {
      total++;
      if (log.completed) completed++;
    } else if (!log) {
      // Check if today or future — don't count yet
      const today = new Date();
      if (day <= today) {
        // Past workout day without a log — counts toward total
        // We'd need registrationDate to check dayNumber, but simplified:
        // Only count days that have logs
      }
    }
  }

  // Simplified: count completed logs in this week vs 6 possible workout days
  const weekLogs = logs.filter((l) => {
    return l.date >= formatDate(weekStartDate) && l.date <= formatDate(weekEnd);
  });

  completed = weekLogs.filter((l) => l.completed && l.dayNumber !== 7).length;
  total = 6; // Always 6 workout days in a week

  return { completed, total };
}

/**
 * Get monthly completion percentage.
 */
export function getMonthlyCompletion(
  logs: WorkoutLogEntry[],
  year: number,
  month: number
): { completed: number; total: number; percentage: number } {
  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthLogs = logs.filter(
    (l) => l.date.startsWith(monthStr) && l.dayNumber !== 7
  );

  const completed = monthLogs.filter((l) => l.completed).length;

  // Count workout days in the month (approximate: ~26 workout days per month)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.round((daysInMonth / 7) * 6);

  const percentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
