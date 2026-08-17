import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getTodayDayNumber,
  getDayNumberForDate,
  getDayName,
  formatDate,
  parseDate,
  getDateRange,
  getWeekStart,
} from "../utils";

describe("getTodayDayNumber", () => {
  it("returns 1 on registration day", () => {
    const today = new Date();
    const regDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    expect(getTodayDayNumber(regDate)).toBe(1);
  });

  it("returns 2 on day after registration", () => {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    expect(getTodayDayNumber(yesterday)).toBe(2);
  });

  it("returns 7 on 6th day after registration", () => {
    const today = new Date();
    const sixDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    expect(getTodayDayNumber(sixDaysAgo)).toBe(7);
  });

  it("cycles back to 1 after 7 days", () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    expect(getTodayDayNumber(sevenDaysAgo)).toBe(1);
  });

  it("cycles correctly after 14 days", () => {
    const today = new Date();
    const fourteenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
    expect(getTodayDayNumber(fourteenDaysAgo)).toBe(1);
  });

  it("returns a value between 1 and 7", () => {
    const result = getTodayDayNumber(new Date(2020, 0, 1));
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(7);
  });
});

describe("getDayNumberForDate", () => {
  it("returns 1 for the registration date itself", () => {
    const regDate = new Date(2025, 0, 1);
    expect(getDayNumberForDate(new Date(2025, 0, 1), regDate)).toBe(1);
  });

  it("returns correct day for offset dates", () => {
    const regDate = new Date(2025, 0, 1);
    expect(getDayNumberForDate(new Date(2025, 0, 2), regDate)).toBe(2);
    expect(getDayNumberForDate(new Date(2025, 0, 3), regDate)).toBe(3);
    expect(getDayNumberForDate(new Date(2025, 0, 7), regDate)).toBe(7);
  });

  it("cycles after 7 days", () => {
    const regDate = new Date(2025, 0, 1);
    expect(getDayNumberForDate(new Date(2025, 0, 8), regDate)).toBe(1);
  });
});

describe("getDayName", () => {
  it("returns correct names for days 1-7", () => {
    expect(getDayName(1)).toBe("Chest");
    expect(getDayName(2)).toBe("Back");
    expect(getDayName(3)).toBe("Legs");
    expect(getDayName(4)).toBe("Shoulders");
    expect(getDayName(5)).toBe("Arms");
    expect(getDayName(6)).toBe("Core");
    expect(getDayName(7)).toBe("Rest");
  });

  it("returns 'Unknown' for invalid day numbers", () => {
    expect(getDayName(0)).toBe("Unknown");
    expect(getDayName(8)).toBe("Unknown");
    expect(getDayName(-1)).toBe("Unknown");
  });
});

describe("formatDate", () => {
  it("formats date as YYYY-MM-DD", () => {
    const date = new Date(2025, 0, 15); // Jan 15, 2025
    expect(formatDate(date)).toBe("2025-01-15");
  });

  it("pads single-digit months and days", () => {
    const date = new Date(2025, 2, 5); // Mar 5, 2025
    expect(formatDate(date)).toBe("2025-03-05");
  });

  it("handles December correctly", () => {
    const date = new Date(2025, 11, 31); // Dec 31, 2025
    expect(formatDate(date)).toBe("2025-12-31");
  });
});

describe("parseDate", () => {
  it("parses YYYY-MM-DD string to Date", () => {
    const result = parseDate("2025-01-15");
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(15);
  });

  it("round-trips with formatDate", () => {
    const original = "2025-06-20";
    const parsed = parseDate(original);
    const formatted = formatDate(parsed);
    expect(formatted).toBe(original);
  });
});

describe("getDateRange", () => {
  it("returns inclusive range of dates", () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 0, 5);
    const range = getDateRange(start, end);
    expect(range).toHaveLength(5);
    expect(formatDate(range[0])).toBe("2025-01-01");
    expect(formatDate(range[4])).toBe("2025-01-05");
  });

  it("returns single date when start === end", () => {
    const date = new Date(2025, 0, 1);
    const range = getDateRange(date, date);
    expect(range).toHaveLength(1);
  });

  it("returns empty array when start > end", () => {
    const start = new Date(2025, 0, 5);
    const end = new Date(2025, 0, 1);
    const range = getDateRange(start, end);
    expect(range).toHaveLength(0);
  });
});

describe("getWeekStart", () => {
  it("returns Monday for a Wednesday", () => {
    const wed = new Date(2025, 0, 8); // Wed Jan 8, 2025
    const monday = getWeekStart(wed);
    expect(monday.getDay()).toBe(1); // Monday
    expect(formatDate(monday)).toBe("2025-01-06");
  });

  it("returns the same day for Monday", () => {
    const mon = new Date(2025, 0, 6); // Mon Jan 6, 2025
    const result = getWeekStart(mon);
    expect(formatDate(result)).toBe("2025-01-06");
  });

  it("returns previous Monday for Sunday", () => {
    const sun = new Date(2025, 0, 12); // Sun Jan 12, 2025
    const monday = getWeekStart(sun);
    expect(monday.getDay()).toBe(1);
    expect(formatDate(monday)).toBe("2025-01-06");
  });
});
