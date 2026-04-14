import type { DailyRecord } from "@/features/checkincheckout/types/Checkinout";

/**
 * Counts how many consecutive days (ending today) have both
 * a Checkin AND a Checkout entry.
 */
export const computeStreak = (
  entries: Record<string, DailyRecord>
): number => {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const entry = entries[key];
    if (entry?.Checkin && entry?.Checkout) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Returns how many of the last `days` days have both a Checkin and Checkout.
 */
export const weeklyCompletionCount = (
  entries: Record<string, DailyRecord>,
  days: number
): number => {
  let count = 0;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const entry = entries[key];
    if (entry?.Checkin && entry?.Checkout) {
      count++;
    }
  }

  return count;
};
