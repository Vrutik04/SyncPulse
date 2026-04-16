import { checkInPersistStorage } from "@/lib/persistStorage";
import type {
  CheckinEntry,
  CheckoutEntry,
  DailyRecord,
  ThemePreference,
} from "@/features/checkincheckout/types/Checkinout";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  name: string;
  position: string;
  email: string;
  ProfilePhoto: string | null;
};

//  Theme change
const ThemeOptions: ThemePreference[] = ["system", "light", "dark"];

type ZustandStore = {
  entries: Record<string, DailyRecord>;
  theme: ThemePreference;
  userProfile: UserProfile;
  profileSetupSeenByUid: Record<string, boolean>;
  hasHydrated: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  markProfileSetupSeen: (uid: string) => void;
  hasSeenProfileSetup: (uid: string) => boolean;
  setHasHydrated: (value: boolean) => void;
  setTheme: (value: ThemePreference) => void;
  toggleTheme: () => void;
  saveCheckIn: (date: string, data: CheckinEntry) => void;
  saveCheckOut: (date: string, data: CheckoutEntry) => void;
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
      profileSetupSeenByUid: {},
      hasHydrated: false,
      updateUserProfile: (data) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...data },
        })),
      markProfileSetupSeen: (uid) =>
        set((state) => ({
          profileSetupSeenByUid: {
            ...state.profileSetupSeenByUid,
            [uid]: true,
          },
        })),
      hasSeenProfileSetup: (uid) => Boolean(get().profileSetupSeenByUid[uid]),
      setHasHydrated: (value) => set({ hasHydrated: value }),

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
                Checkin: {
                  ...data,
                  checkedInAt:
                    existing.Checkin?.checkedInAt || new Date().toISOString(),
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

      getAllDates: () =>
        Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
    }),
    {
      name: "daily-checkin-storage",
      storage: checkInPersistStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        entries: state.entries,
        theme: state.theme,
        userProfile: state.userProfile,
        profileSetupSeenByUid: state.profileSetupSeenByUid,
      }),
    },
  ),
);
