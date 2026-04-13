import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "@/navigation/types";
import { CheckInOutScreen } from "@/features/checkincheckout/screens/CheckInOutScreen";
import { HistoryScreen } from "@/features/history/screens/HistoryScreen";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { Platform, useColorScheme } from "react-native";

const Tab = createBottomTabNavigator<TabParamList>();

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

export const TabNavigator = () => {
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home-outline", "home"),
        }}
      />
      <Tab.Screen
        name="CheckInOut"
        component={CheckInOutScreen}
        options={{
          title: "Check-in",
          tabBarIcon: tabIcon("create-outline", "create"),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: tabIcon("albums-outline", "albums"),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: tabIcon("person-outline", "person"),
        }}
      />
    </Tab.Navigator>
  );
};
