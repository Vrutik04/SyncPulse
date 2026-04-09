import type { TabParamList } from "@/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Text, View } from "react-native";

const items: {
  name: keyof TabParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "Home", label: "Home", icon: "home-outline" },
  { name: "CheckInOut", label: "Check-in / out", icon: "create-outline" },
  { name: "History", label: "History", icon: "albums-outline" },
  { name: "Profile", label: "Profile", icon: "person-outline" },
];

export const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation } = props;

  const go = (screen: keyof TabParamList) => {
    navigation.navigate("Main", { screen });
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 48, paddingBottom: 24 }}
    >
      <View className="border-b border-ink-200 px-4 pb-4 dark:border-ink-800">
        <Text className="text-xl font-bold text-ink-900 dark:text-ink-50">
          SyncPulse
        </Text>
        <Text className="mt-1 text-sm text-ink-500">
          Welcome to SyncPulse! 
        </Text>
      </View>
      {items.map(({ name, label, icon }) => (
        <DrawerItem
          key={name}
          label={label}
          icon={({ color, size }) => (
            <Ionicons name={icon} size={size} color={color} />
          )}
          onPress={() => go(name)}
          activeTintColor="#c45c3e"
          inactiveTintColor="#6b7280"
        />
      ))}
    </DrawerContentScrollView>
  );
};
