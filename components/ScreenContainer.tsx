import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@react-navigation/native";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainer = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showThemeToggle?: boolean;
  showDrawerToggle?: boolean;
};

export const ScreenContainer = ({
  title,
  subtitle,
  children,
  footer,
  showThemeToggle = true,
  showDrawerToggle = true,
}: ScreenContainer) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-paper dark:bg-ink-950"
      edges={["top", "left", "right"]}
    >
      <View
        className="flex-1 px-5"
      
      >
        <View className="flex-row items-start gap-2 border-b border-ink-200/90 pb-5 pt-1 dark:border-ink-800/90">
          {showDrawerToggle ? (
            <View className="pt-1">
              <DrawerToggleButton tintColor={colors.text} />
            </View>
          ) : null}
          <View className="min-w-0 flex-1 pr-1">
            <Text className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-1 text-base leading-6 text-ink-500 dark:text-ink-400">
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showThemeToggle ? <ThemeToggleButton /> : null}
        </View>
        <ScrollView 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="pt-4">{children}</View>
        </ScrollView>
      </View>
      
      {footer}
    </SafeAreaView>
  );
};
