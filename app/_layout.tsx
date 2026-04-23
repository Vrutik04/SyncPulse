import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/AuthStore";
import { useAuthListener } from "@/features/auth/hooks/useAuthListener";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { ProfileSetupModal } from "@/features/profile/components/ProfileSetupModal";
import { useProfileSetupGate } from "@/features/profile/hooks/useProfileSetupGate";
import { ActivityIndicator, View, Appearance, useColorScheme as useRnColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "../global.css";

export default function RootLayout() {
  const authUser = useAuthStore((state) => state.authUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const segments = useSegments();
  const router = useRouter();

  useAuthListener();
  
  const theme = useProfileStore((s) => s.theme);
  const systemScheme = useRnColorScheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
    if (theme === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
  }, [theme, setColorScheme]);

  const isDark = theme === "dark" || (theme === "system" && systemScheme === "dark");
  const navTheme = isDark ? DarkTheme : DefaultTheme;
  const appTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      primary: "#c45c3e",
      background: isDark ? "#12151c" : "#faf7f2",
      card: isDark ? "#161922" : "#ffffff",
      text: isDark ? "#f4f5f7" : "#1e222c",
      border: isDark ? "#353b4a" : "#e8eaef",
    },
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!authUser && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (authUser && inAuthGroup) {
      router.replace("/(app)/(tabs)");
    }
  }, [authUser, segments, isLoading, router]);

  const { isProfileSetupVisible, closeProfileSetupModal } = useProfileSetupGate({
    user: authUser,
  });

  if (isLoading && authUser === null) {
    return (
      <View style={{ flex: 1, backgroundColor: appTheme.colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#c45c3e" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={appTheme}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <Slot />
          <ProfileSetupModal
            visible={Boolean(authUser) && isProfileSetupVisible}
            initialEmail={authUser?.email}
            onComplete={closeProfileSetupModal}
            onSkip={closeProfileSetupModal}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
