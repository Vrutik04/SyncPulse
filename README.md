# Checksy — Daily check-in (Expo + React Native)

**Check-in** (entry) and **check-out** (exit) per calendar day, **timestamps** on save, **history** grouped by date, **progress** stats.

## Stack

- **Expo SDK 54** · **React Native** · **TypeScript**
- **React Navigation** — **Stack** (`App`) → **Drawer** (custom menu) → **Tabs** (4 screens)
- **Entry:** `App.tsx` + `expo/AppEntry.js`
- **NativeWind v4** · **Zustand** persist · **expo-haptics**

## Navigation

```
Stack: App
└─ Drawer (drawerContent = menu: Home, Check-in/out, History, Profile)
   └─ Screen "Main" → Bottom tabs
         Home | Check-in/out | History | Profile
```

- **Header:** drawer toggle (menu) + theme cycle.
- **Drawer** mirrors the same four destinations as the tab bar.

## Tabs

| Tab | Role |
| --- | --- |
| **Home** | Streak, weekly bar, shortcut to check-in/out, today’s entry & exit summary |
| **Check-in/out** | One screen: **Entry** (project, goal, note) + **Exit** (work, status); each save stores **real time** (`checkedInAt` / `checkedOutAt` ISO timestamps) for that calendar day |
| **History** | Progress + date-wise list; one entry & one exit per day; edit modal |
| **Profile** | App name & version |

## Data

- Day key: `YYYY-MM-DD` (local calendar).
- At most **one** morning record and **one** evening record per day (enforced by store).
- Timestamps set in the store on each successful save.

## Project layout

- `navigation/` — `RootNavigator.tsx`, `AppDrawerContent.tsx`, `types.ts`
- `screens/` — `HomeScreen`, `CheckInOutScreen`, `HistoryScreen`, `ProfileScreen`
