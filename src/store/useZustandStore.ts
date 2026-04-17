import type {
  CheckinEntry,
  CheckoutEntry,
  DailyRecord,
  ThemePreference,
} from "@/features/checkincheckout/types/Checkinout";
import {
  getUserProfile,
  saveUserProfile,
  syncUserProfile,
  updateUserProfile as updateUserProfileService,
  type UserProfile,
} from "@/services/user.service";
import { create } from "zustand";

const ThemeOptions: ThemePreference[] = ["system", "light", "dark"];

type ZustandStore = {
  user: UserProfile | null;
  isUserLoading: boolean;
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
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
  saveCheckIn: (date: string, data: CheckinEntry) => void;
  saveCheckOut: (date: string, data: CheckoutEntry) => void;
  getEntry: (date: string) => DailyRecord | undefined;
  getAllDates: () => string[];
};

export const useZustandStore = create<ZustandStore>((set, get) => ({
  user: null,
  isUserLoading: false,
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


  clearUser: () => set({ user: null }),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => {
      const index = ThemeOptions.indexOf(state.theme);
      const nextTheme = ThemeOptions[(index + 1) % ThemeOptions.length];
      return { theme: nextTheme };
    }),

  saveCheckIn: (date, data) =>
    set((state) => {
      const existing = state.entries[date] || { date };
      return {
        entries: {
          ...state.entries,
          [date]: {
            ...existing,
            date,
            Checkin: {
              ...data,
              checkedInAt: existing.Checkin?.checkedInAt || new Date().toISOString(),
            },
          },
        },
      };
    }),

  saveCheckOut: (date, data) =>
    set((state) => {
      const existing = state.entries[date] || { date };
      return {
        entries: {
          ...state.entries,
          [date]: {
            ...existing,
            date,
            Checkout: {
              ...data,
              checkedOutAt:
                existing.Checkout?.checkedOutAt || new Date().toISOString(),
            },
          },
        },
      };
    }),

  getEntry: (date) => get().entries[date],

  getAllDates: () => Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
}));
