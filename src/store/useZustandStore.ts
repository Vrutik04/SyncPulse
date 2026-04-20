import type {
  CheckinEntry,
  CheckoutEntry,
  DailyRecord,
  ThemePreference,
} from "@/features/checkincheckout/types/Checkinout";
import {
  formatDisplayDate,
  formatTime,
  getDateKey,
} from "@/shared/utils/date";
import {
  getUserProfile,
  saveUserProfile,
  syncUserProfile,
  updateUserProfile as updateUserProfileService,
  type UserProfile,
} from "@/services/user.service";
import {
  saveCheckIn as saveCheckInService,
  saveCheckOut as saveCheckOutService,
  getAllActivities,
} from "@/services/activity.service";
import { create } from "zustand";

const ThemeOptions: ThemePreference[] = ["system", "light", "dark"];

type ZustandStore = {
  user: UserProfile | null;
  isUserLoading: boolean;
  profileImage: string | null;
  entries: Record<string, DailyRecord>;
  theme: ThemePreference;
  setUser: (user: UserProfile | null) => void;
  fetchUser: (userId: string) => Promise<UserProfile | null>;
  createUser: (userId: string, data: UserProfile) => Promise<void>;
  syncUserFromAuth: (
    userId: string,
    data: { name?: string | null; email?: string | null },
  ) => Promise<UserProfile>;
  updateUser: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  clearUser: () => void;
  setProfileImage: (imageUri: string) => void;
  clearProfileImage: () => void;
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
  loadActivities: (userId: string) => Promise<void>;
  saveCheckIn: (userId: string, date: string, data: CheckinEntry) => Promise<void>;
  saveCheckOut: (userId: string, date: string, data: CheckoutEntry) => Promise<void>;
  getEntry: (date: string) => DailyRecord | undefined;
  getAllDates: () => string[];
};

export const useZustandStore = create<ZustandStore>((set, get) => ({
  user: null,
  isUserLoading: false,
  profileImage: null,
  entries: {},
  theme: "system",

  setUser: (user) => set({ user }),

  fetchUser: async (userId) => {
    set({ isUserLoading: true });
    try {
      const profile = await getUserProfile(userId);
      set({ user: profile });
      return profile;
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  createUser: async (userId, data) => {
    set({ isUserLoading: true });
    try {
      await saveUserProfile(userId, data);
      set({ user: data });
    } catch (error) {
      console.error("Failed to create user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  syncUserFromAuth: async (userId, data) => {
    set({ isUserLoading: true });
    try {
      const profile = await syncUserProfile(userId, data);
      set({ user: profile });
      return profile;
    } catch (error) {
      console.error("Failed to sync user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },

  updateUser: async (userId, data) => {
    const currentUser = get().user;
    if (!currentUser) {
      throw new Error("Cannot update user profile before profile is loaded");
    }

    const payload: Partial<UserProfile> = {};
    if (typeof data.name === "string") payload.name = data.name;
    if (typeof data.email === "string") payload.email = data.email;
    if (typeof data.role === "string") payload.role = data.role;

    if (Object.keys(payload).length === 0) {
      return;
    }

    set({ isUserLoading: true });
    try {
      await updateUserProfileService(userId, payload);
      set({ user: { ...currentUser, ...payload } });
    } catch (error) {
      console.error("Failed to update user profile", error);
      throw error;
    } finally {
      set({ isUserLoading: false });
    }
  },


  clearUser: () => set({ user: null, profileImage: null, entries: {} }),

  setProfileImage: (imageUri) => set({ profileImage: imageUri }),

  clearProfileImage: () => set({ profileImage: null }),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => {
      const index = ThemeOptions.indexOf(state.theme);
      const nextTheme = ThemeOptions[(index + 1) % ThemeOptions.length];
      return { theme: nextTheme };
    }),

  loadActivities: async (userId) => {
    try {
      const activities = await getAllActivities(userId);
      const entries: Record<string, DailyRecord> = {};
      for (const activity of activities) {
        entries[activity.date] = activity;
      }
      set({ entries });
    } catch (error) {
      console.error("Failed to load activities", error);
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
    } catch (error) {
      console.error("Failed to save check-in to Firestore", error);
    }

    set((state) => ({
      entries: {
        ...state.entries,
        [date]: {
          ...existing,
          date,
          Checkin: newCheckin,
        },
      },
    }));
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
    } catch (error) {
      console.error("Failed to save check-out to Firestore", error);
    }

    set((state) => ({
      entries: {
        ...state.entries,
        [date]: {
          ...existing,
          date,
          Checkout: newCheckout,
        },
      },
    }));
  },

  getEntry: (date) => get().entries[date],

  getAllDates: () => Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
}));
