import type { DailyRecord } from "@/features/checkin/types/Checkinout";

/**
 * Returns the date key for yesterday (YYYY-MM-DD).
 */
export const getYesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Returns true if yesterday had a Checkin but no Checkout.
 */
export const isMissedCheckout = (
  entries: Record<string, DailyRecord>
): boolean => {
  const yesterday = getYesterday();
  const entry = entries[yesterday];
  return !!entry?.Checkin && !entry?.Checkout;
};
