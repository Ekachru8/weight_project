/**
 * Day names for the 6-day split + rest day
 */
const DAY_NAMES: Record<number, string> = {
  1: "Chest",
  2: "Back",
  3: "Legs",
  4: "Shoulders",
  5: "Arms",
  6: "Core",
  7: "Rest",
};

/**
 * Get the day number (1–7) in the rotating weekly cycle
 * based on user registration date.
 */
export function getTodayDayNumber(registrationDate: Date): number {
  const now = new Date();
  const regDay = new Date(
    registrationDate.getFullYear(),
    registrationDate.getMonth(),
    registrationDate.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today.getTime() - regDay.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  // Day 1 on registration day, cycles 1–7
  return ((diffDays % 7) + 7) % 7 + 1;
}

/**
 * Get the day number for a specific date
 */
export function getDayNumberForDate(
  date: Date,
  registrationDate: Date
): number {
  const regDay = new Date(
    registrationDate.getFullYear(),
    registrationDate.getMonth(),
    registrationDate.getDate()
  );
  const targetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffMs = targetDay.getTime() - regDay.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return ((diffDays % 7) + 7) % 7 + 1;
}

/**
 * Get the name for a given day number
 */
export function getDayName(dayNumber: number): string {
  return DAY_NAMES[dayNumber] || "Unknown";
}

/**
 * Format a date as YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string to a Date (at midnight local time)
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get array of dates between start and end (inclusive)
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Get the Monday of the week containing the given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
