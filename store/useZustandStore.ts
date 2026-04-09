import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkInPersistStorage } from "@/lib/persistStorage";
import type {
  DailyRecord,
  EveningEntry,
  MorningEntry,
  ThemePreference,
} from "@/types/checkIn";


export type UserProfile = {
  name: string;
  position: string;
  email: string;
  ProfilePhoto: string | null;
};

//  Theme change 
const ThemeOptions: ThemePreference[] = ["system","light", "dark"];

type ZustandStore = {
  entries: Record<string, DailyRecord>;
  theme: ThemePreference;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
  saveCheckIn: (date: string, data: MorningEntry) => void;
  saveCheckOut: (date: string, data: EveningEntry) => void;
  getEntry: (date: string) => DailyRecord | undefined;
  getAllDates: () => string[];
};

export const useZustandStore = create<ZustandStore>()(
  persist(
    (set, get) => ({
      entries: {},

      userProfile: {
        name: "user",
        position: "position/role",
        email: "user-email@gmail.com",
        ProfilePhoto: null,
      },
      updateUserProfile: (data) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...data },
        })),

      theme: "system",
      setTheme: (theme) => set({ theme }),

      //  Toggle theme
      toggleTheme: () =>
        set((state) => {
          const index = ThemeOptions.indexOf(state.theme);
          const nextTheme = ThemeOptions[(index + 1) % ThemeOptions.length];
          return { theme: nextTheme };
        }),

      //  Check-in
      saveCheckIn: (date, data) =>
        set((state) => {
          const existing = state.entries[date] || { date };

          return {
            entries: {
              ...state.entries,
              [date]: {
                ...existing,
                date,
                morning: {
                  ...data,
                  checkedInAt:
                    existing.morning?.checkedInAt || new Date().toISOString(),
                },
              },
            },
          };
        }),

      // Check-out
      saveCheckOut: (date, data) =>
        set((state) => {
          const existing = state.entries[date] || { date };

          return {
            entries: {
              ...state.entries,
              [date]: {
                ...existing,
                date,
                evening: {
                  ...data,
                  checkedOutAt:
                    existing.evening?.checkedOutAt || new Date().toISOString(),
                },
              },
            },
          };
        }),

      getEntry: (date) => get().entries[date],

      getAllDates: () =>
        Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
    }),
    {
      name: "daily-checkin-storage",
      storage: checkInPersistStorage,
      partialize: (state) => ({
        entries: state.entries,
        theme: state.theme,
        userProfile: state.userProfile,
      }),
    },
  ),
);
