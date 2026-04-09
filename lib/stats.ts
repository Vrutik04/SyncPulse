import type { DailyRecord } from "@/types/checkIn";
import { getDateKey } from "@/lib/date";

const isFullDay = (entries: Record<string, DailyRecord>, date: Date) => {
  const key = getDateKey(date);
  const entry = entries[key];
  return !!(entry?.morning && entry?.evening);
};

export const computeStreak = (entries: Record<string, DailyRecord>) => {
  const cursor = new Date();
  if (!isFullDay(entries, cursor)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    if (isFullDay(entries, cursor)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const weeklyCompletionCount = (
  entries: Record<string, DailyRecord>,
  days = 7,
) => {
  const date = new Date();
  let n = 0;
  for (let i = 0; i < days; i++) {
    if (isFullDay(entries, date)) n += 1;
    date.setDate(date.getDate() - 1);
  }
  return n;
};
