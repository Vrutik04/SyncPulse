import type { TabParamList } from "@/navigation/types";
import { useZustandStore } from "@/store/useZustandStore";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, Text, View } from "react-native";


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


  const { name, position, email, ProfilePhoto } = useZustandStore(
    (s) => s.userProfile
  );


  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

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
        <Text className="text-sm text-ink-500">Welcome to SyncPulse!</Text>
      </View>


      <View className=" rounded-2xl bg-white p-5  dark:bg-ink-900">

        <View className="h-20 w-20 rounded-full overflow-hidden border-2 border-clay/30 bg-clay/10 items-center justify-center">
          {ProfilePhoto ? (
            <Image
              source={{ uri: ProfilePhoto }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-2xl font-bold text-clay">
              {initials || "U"}
            </Text>
          )}
        </View>


        <Text
          className="mt-3 text-base font-bold text-ink-900 dark:text-ink-50 "
          numberOfLines={1}
        >
          {name}
        </Text>


        {position ? (
          <Text
            className="mt-0.5 text-xs font-semibold text-clay uppercase tracking-wide "
            numberOfLines={1}
          >
            {position}
          </Text>
        ) : null}


        <Text
          className="mt-1 text-xs text-ink-400 dark:text-ink-500 "
          numberOfLines={1}
        >
          {email}
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
