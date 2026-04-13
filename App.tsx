import { RootNavigator } from "@/navigation/RootNavigator";
import { useZustandStore as useDailyRecordsStore } from "@/store/useZustandStore";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Appearance, useColorScheme as useRnColorScheme } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

const App = () => {
  const theme = useDailyRecordsStore((s) => s.theme);
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

  const isDark =
    theme === "dark" || (theme === "system" && systemScheme === "dark");

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={appTheme}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
