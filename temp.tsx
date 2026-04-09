// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { Appearance } from "react-native";

// import type {
//   DailyRecord,
//   MorningEntry,
//   EveningEntry,
//   ThemePreference,
// } from "@/types/checkIn";

// import { checkInPersistStorage } from "@/lib/persistStorage";

// // 🎨 Theme options
// const themes: ThemePreference[] = ["light", "dark", "system"];

// type ZustandStore = {
//   entries: Record<string, DailyRecord>;
//   theme: ThemePreference;

//   // actions
//   setTheme: (value: ThemePreference) => void;
//   toggleTheme: () => void;

//   saveCheckIn: (date: string, data: MorningEntry) => void;
//   saveCheckOut: (date: string, data: EveningEntry) => void;

//   getEntryByDate: (date: string) => DailyRecord | undefined;
//   getAllDates: () => string[];
// };

// export const useZustandStore = create<ZustandStore>()(
//   persist(
//     (set, get) => ({
//       entries: {},

//       // 👉 default system theme
//       theme: Appearance.getColorScheme() || "light",

//       // 🎨 Set theme manually
//       setTheme: (value) => {
//         if (value === "system") {
//           const systemTheme = Appearance.getColorScheme() || "light";
//           set({ theme: systemTheme });
//         } else {
//           set({ theme: value });
//         }
//       },

//       // 🔁 Toggle theme
//       toggleTheme: () =>
//         set((state) => {
//           const index = themes.indexOf(state.theme);
//           const next = themes[(index + 1) % themes.length];

//           if (next === "system") {
//             const systemTheme = Appearance.getColorScheme() || "light";
//             return { theme: systemTheme };
//           }

//           return { theme: next };
//         }),

//       // 🌅 Check-in
//       saveCheckIn: (date, data) =>
//         set((state) => {
//           const existing = state.entries[date] || { date };

//           return {
//             entries: {
//               ...state.entries,
//               [date]: {
//                 ...existing,
//                 date,
//                 morning: {
//                   ...data,
//                   checkedInAt: new Date().toISOString(),
//                 },
//               },
//             },
//           };
//         }),

//       // 🌙 Check-out
//       saveCheckOut: (date, data) =>
//         set((state) => {
//           const existing = state.entries[date] || { date };

//           return {
//             entries: {
//               ...state.entries,
//               [date]: {
//                 ...existing,
//                 date,
//                 evening: {
//                   ...data,
//                   checkedOutAt: new Date().toISOString(),
//                 },
//               },
//             },
//           };
//         }),

//       getEntryByDate: (date) => get().entries[date],

//       getAllDates: () =>
//         Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
//     }),
//     {
//       name: "daily-checkin-storage",
//       storage: checkInPersistStorage,
//       partialize: (state) => ({
//         entries: state.entries,
//         theme: state.theme,
//       }),
//     }
//   )
// );

import { checkInPersistStorage } from "@/lib/persistStorage";
import type {
    DailyRecord,
    EveningEntry,
    MorningEntry,
    ThemePreference,
} from "@/types/checkIn";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type {
    CheckoutStatus,
    DailyRecord,
    EveningEntry,
    MorningEntry,
    ThemePreference
} from "@/types/checkIn";

const THEME_SWITCH: ThemePreference[] = ["light", "dark", "system"];

type CheckInState = {
  entries: Record<string, DailyRecord>;
  themePreference: ThemePreference;
  setThemePreference: (t: ThemePreference) => void;
  cycleTheme: () => void;
  saveMorning: (date: string, data: MorningEntry) => void;
  saveEvening: (date: string, data: EveningEntry) => void;
  getEntry: (date: string) => DailyRecord | undefined;
  getSortedDateKeys: () => string[];
};

const ensureRecord = (
  entries: Record<string, DailyRecord>,
  date: string,
): DailyRecord => entries[date] ?? { date };

export const useZustandStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      entries: {},

      themePreference: "system",
      setThemePreference: (themePreference) => set({ themePreference }),
      cycleTheme: () =>
        set((s) => {
          const i = THEME_SWITCH.indexOf(s.themePreference);
          const next = THEME_SWITCH[(i + 1) % THEME_SWITCH.length];
          return { themePreference: next };
        }),
      saveMorning: (date, data) =>
        set((s) => {
          const next = { ...s.entries };
          const prev = ensureRecord(next, date);
          const now = new Date().toISOString();
          next[date] = {
            ...prev,
            date,
            morning: { ...data, checkedInAt: now },
          };
          return { entries: next };
        }),
      saveEvening: (date, data) =>
        set((s) => {
          const next = { ...s.entries };
          const prev = ensureRecord(next, date);
          const now = new Date().toISOString();
          next[date] = {
            ...prev,
            date,
            evening: { ...data, checkedOutAt: now },
          };
          return { entries: next };
        }),
      getEntry: (date) => get().entries[date],
      getSortedDateKeys: () =>
        Object.keys(get().entries).sort((a, b) => b.localeCompare(a)),
    }),
    {
      name: "checksy-daily-v1",
      storage: checkInPersistStorage,
      partialize: (s) => ({
        entries: s.entries,
        themePreference: s.themePreference,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error && __DEV__) {
          console.warn("[checksy] Failed to restore saved data:", error);
        }
      },
    },
  ),
);
