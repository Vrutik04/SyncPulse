import { create } from "zustand";
import { 
  getAllActivities, 
  saveCheckIn as saveCheckInService, 
  saveCheckOut as saveCheckOutService 
} from "../api/activity.service";
import { formatTime } from "@/shared/utils/date";
import type { 
  CheckinEntry, 
  CheckoutEntry, 
  DailyRecord 
} from "../types/Checkinout";

interface CheckinState {
  entries: Record<string, DailyRecord>;
  isActivitiesLoading: boolean;
  isActivitiesLoaded: boolean;
  loadActivities: (userId: string) => Promise<void>;
  saveCheckIn: (userId: string, date: string, data: CheckinEntry) => Promise<void>;
  saveCheckOut: (userId: string, date: string, data: CheckoutEntry) => Promise<void>;
  getEntry: (date: string) => DailyRecord | undefined;
  getAllDates: () => string[];
  clearActivities: () => void;
}

export const useCheckinStore = create<CheckinState>((set, get) => ({
  entries: {},
  isActivitiesLoading: false,
  isActivitiesLoaded: false,

  loadActivities: async (userId) => {
    set({ isActivitiesLoading: true });
    try {
      const activities = await getAllActivities(userId);
      const entries: Record<string, DailyRecord> = {};
      activities.forEach(a => entries[a.date] = a);
      set({ entries, isActivitiesLoaded: true });
    } catch (error) {
      console.error("Failed to load activities", error);
    } finally {
      set({ isActivitiesLoading: false });
    }
  },

  saveCheckIn: async (userId, date, data) => {
    const existing = get().entries[date] || { date };
    const now = new Date().toISOString();
    const newCheckin = {
      ...existing.Checkin,
      ...data,
      checkedInAt: existing.Checkin?.checkedInAt || now,
      checkInTime: existing.Checkin?.checkInTime || formatTime(now),
    };

    try {
      await saveCheckInService(userId, date, newCheckin);
      set((state) => ({
        entries: {
          ...state.entries,
          [date]: { ...existing, date, Checkin: newCheckin },
        },
      }));
    } catch (error) {
      console.error("Failed to save check-in", error);
    }
  },

  saveCheckOut: async (userId, date, data) => {
    const existing = get().entries[date] || { date };
    const now = new Date().toISOString();
    const newCheckout = {
      ...existing.Checkout,
      ...data,
      checkedOutAt: existing.Checkout?.checkedOutAt || now,
      checkOutTime: existing.Checkout?.checkOutTime || formatTime(now),
    };

    try {
      await saveCheckOutService(userId, date, newCheckout);
      set((state) => ({
        entries: {
          ...state.entries,
          [date]: { ...existing, date, Checkout: newCheckout },
        },
      }));
    } catch (error) {
      console.error("Failed to save check-out", error);
    }
  },

  getEntry: (date) => get().entries[date],
  getAllDates: () => Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
  clearActivities: () => set({ entries: {}, isActivitiesLoaded: false }),
}));
