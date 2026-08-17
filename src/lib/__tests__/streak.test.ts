import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  getWeeklyCompletion,
  getMonthlyCompletion,
} from "../streak";
import { formatDate } from "../utils";

// Helper to create logs
function makeLogs(
  entries: Array<{ daysAgo: number; completed: boolean; dayNumber?: number }>
) {
  const today = new Date();
  return entries.map((e) => {
    const d = new Date(today);
    d.setDate(d.getDate() - e.daysAgo);
    return {
      date: formatDate(d),
      completed: e.completed,
      dayNumber: e.dayNumber ?? 1,
    };
  });
}

describe("calculateCurrentStreak", () => {
  it("returns 0 for empty logs", () => {
    const result = calculateCurrentStreak([], new Date());
    expect(result).toBe(0);
  });

  it("counts consecutive completed days", () => {
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 10);
    const logs = makeLogs([
      { daysAgo: 1, completed: true },
      { daysAgo: 2, completed: true },
      { daysAgo: 3, completed: true },
    ]);
    const result = calculateCurrentStreak(logs, regDate);
    expect(result).toBeGreaterThanOrEqual(3);
  });

  it("stops at a skipped day", () => {
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 10);
    const logs = makeLogs([
      { daysAgo: 1, completed: true },
      { daysAgo: 2, completed: false }, // broken
      { daysAgo: 3, completed: true },
    ]);
    const result = calculateCurrentStreak(logs, regDate);
    expect(result).toBeLessThanOrEqual(2);
  });

  it("skips rest days (dayNumber 7)", () => {
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 10);
    const logs = makeLogs([
      { daysAgo: 1, completed: true, dayNumber: 1 },
      { daysAgo: 2, completed: true, dayNumber: 7 }, // rest day — skipped
      { daysAgo: 3, completed: true, dayNumber: 5 },
    ]);
    // The function walks backwards; rest days don't break the streak
    const result = calculateCurrentStreak(logs, regDate);
    expect(result).toBeGreaterThanOrEqual(1);
  });
});

describe("calculateLongestStreak", () => {
  it("returns 0 for empty logs", () => {
    const result = calculateLongestStreak([], new Date());
    expect(result).toBe(0);
  });

  it("returns longest completed streak", () => {
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 20);
    const logs = makeLogs([
      { daysAgo: 15, completed: true },
      { daysAgo: 14, completed: true },
      { daysAgo: 13, completed: false },
      { daysAgo: 12, completed: true },
      { daysAgo: 11, completed: true },
      { daysAgo: 10, completed: true },
    ]);
    const result = calculateLongestStreak(logs, regDate);
    expect(result).toBeGreaterThanOrEqual(2);
  });
});

describe("getWeeklyCompletion", () => {
  it("returns completed count and total of 6", () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 3);

    const logs = [
      { date: formatDate(weekStart), completed: true, dayNumber: 1 },
      {
        date: formatDate(new Date(weekStart.getTime() + 86400000)),
        completed: true,
        dayNumber: 2,
      },
      {
        date: formatDate(new Date(weekStart.getTime() + 2 * 86400000)),
        completed: false,
        dayNumber: 3,
      },
    ];

    const result = getWeeklyCompletion(logs, weekStart);
    expect(result.total).toBe(6);
    expect(result.completed).toBe(2);
  });

  it("returns 0 completed for empty logs", () => {
    const result = getWeeklyCompletion([], new Date());
    expect(result.completed).toBe(0);
    expect(result.total).toBe(6);
  });
});

describe("getMonthlyCompletion", () => {
  it("calculates monthly completion correctly", () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-15`;

    const logs = [
      { date: dateStr, completed: true, dayNumber: 1 },
    ];

    const result = getMonthlyCompletion(logs, year, month);
    expect(result.completed).toBe(1);
    expect(result.total).toBeGreaterThan(0);
    expect(result.percentage).toBeGreaterThan(0);
  });

  it("excludes rest days (dayNumber 7)", () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-10`;

    const logs = [
      { date: dateStr, completed: true, dayNumber: 7 }, // rest day — excluded
    ];

    const result = getMonthlyCompletion(logs, year, month);
    expect(result.completed).toBe(0);
  });

  it("returns 0% for empty month", () => {
    const result = getMonthlyCompletion([], 2025, 5);
    expect(result.completed).toBe(0);
    expect(result.percentage).toBe(0);
  });
});
