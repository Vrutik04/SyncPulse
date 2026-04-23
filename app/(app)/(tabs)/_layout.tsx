import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, useColorScheme } from "react-native";

const tabIcon = (
  outline: keyof typeof Ionicons.glyphMap,
  filled: keyof typeof Ionicons.glyphMap
) => {
  const Icon = ({
    color,
    focused,
  }: {
    color: string;
    focused: boolean;
  }) => (
    <Ionicons name={focused ? filled : outline} size={24} color={color} />
  );
  Icon.displayName = "TabIcon";
  return Icon;
};

export default function TabLayout() {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#c45c3e",
        tabBarInactiveTintColor: dark ? "#6b7280" : "#9ca3af",
        tabBarStyle: {
          backgroundColor: dark ? "#161922" : "#ffffff",
          borderTopColor: dark ? "#272b38" : "#e5e7eb",
          height: Platform.OS === "ios" ? 86 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home-outline", "home"),
        }}
      />
      <Tabs.Screen
        name="check-in-out"
        options={{
          title: "Check-in",
          tabBarIcon: tabIcon("create-outline", "create"),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: tabIcon("albums-outline", "albums"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: tabIcon("person-outline", "person"),
        }}
      />
    </Tabs>
  );
}
