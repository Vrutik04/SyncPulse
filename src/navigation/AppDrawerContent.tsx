import { useRouter } from "expo-router";
import { useAuthStore } from "@/features/auth/store/AuthStore";
import type { TabParamList } from "@/navigation/types";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, Text, View } from "react-native";


const items: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
    { name: "Home", label: "Home", icon: "home-outline", route: "/(app)/(tabs)" },
    { name: "CheckInOut", label: "Check-in / out", icon: "create-outline", route: "/(app)/(tabs)/check-in-out" },
    { name: "History", label: "History", icon: "albums-outline", route: "/(app)/(tabs)/history" },
    { name: "Profile", label: "Profile", icon: "person-outline", route: "/(app)/(tabs)/profile" },
  ];

export const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const { navigation } = props;

  const user = useProfileStore((s) => s.user);
  const profileImage = useProfileStore((s) => s.profileImage);
  const authUser = useAuthStore((s) => s.authUser);

  const name = user?.name ?? "User";
  const email = user?.email ?? authUser?.email ?? "";
  const role = user?.role ?? "";

  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const go = (route: string) => {
    router.push(route as import('expo-router').Href);
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


      <View className="rounded-2xl bg-white p-5 dark:bg-ink-900">

        {/* Avatar */}
        <View className="h-20 w-20 rounded-full overflow-hidden border-2 border-clay/30 bg-clay/10 items-center justify-center">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-2xl font-bold text-clay">{initials || "U"}</Text>
          )}
        </View>

        {/* Name */}
        <Text
          className="mt-3 text-base font-bold text-ink-900 dark:text-ink-50"
          numberOfLines={1}
        >
          {name}
        </Text>

        {/* Role badge — same style as Profile screen */}
        {role ? (
          <View className="bg-clay/10 dark:bg-clay/20 self-start px-3 py-1 rounded-full mt-1 border border-clay/30 dark:border-clay/40">
            <Text className="text-xs font-bold text-clay dark:text-clay-muted tracking-widest uppercase">
              {role}
            </Text>
          </View>
        ) : null}

        {/* Email */}
        <Text
          className="mt-1 text-xs text-ink-400 dark:text-ink-500"
          numberOfLines={1}
        >
          {email}
        </Text>
      </View>


      {items.map(({ name, label, icon, route }) => (
        <DrawerItem
          key={name}
          label={label}
          icon={({ color, size }) => (
            <Ionicons name={icon} size={size} color={color} />
          )}
          onPress={() => go(route)}
          activeTintColor="#c45c3e"
          inactiveTintColor="#6b7280"
        />
      ))}
    </DrawerContentScrollView>
  );
};
