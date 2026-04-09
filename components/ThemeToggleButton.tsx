import { useZustandStore } from "@/store/useZustandStore";
import type { ThemePreference } from "@/types/checkIn";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

type Ion = keyof typeof Ionicons.glyphMap;

const Label: Record<ThemePreference, string> = {
  light: "Theme is light. Tap to switch to dark mode.",
  dark: "Theme is dark. Tap to use system appearance.",
  system: "Theme follows system. Tap to always use light mode.",
};

const iconFor: Record<ThemePreference, Ion> = {
  light: "moon",
  dark: "contrast-outline",
  system: "sunny",
};

const iconColor: Record<ThemePreference, string> = {
  light: "#fbbf24",
  dark: "#6b7280",
  system: "#fbbf24",
};

export const ThemeToggleButton = () => {
  const preference = useZustandStore((state) => state.theme);
  const ToggleTheme = useZustandStore((state) => state.toggleTheme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={Label[preference]}
      onPress={() => {
        void Haptics.selectionAsync();
        ToggleTheme();
      }}
      className="h-11 w-11 items-center justify-center rounded-2xl border border-ink-200 bg-white active:opacity-80 dark:border-ink-700 dark:bg-ink-900"
    >
      <Ionicons
        name={iconFor[preference]}
        size={22}
        color={iconColor[preference]}
      />
    </Pressable>
  );
};
