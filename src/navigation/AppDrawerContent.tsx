import { useAuthStore } from "@/features/auth/store/AuthStore";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface DrawerItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem = ({ label, icon, isActive, onPress }: DrawerItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`mt-2 mb-1 flex-row items-center rounded-xl px-3.5 py-2.5 ${isActive ? "bg-clay" : "bg-transparent"
        }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        className={`mr-3 items-center justify-center rounded-lg p-1.5 ${isActive ? "bg-white/20" : "bg-ink-100 dark:bg-ink-800"
          }`}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? "#FFFFFF" : "#64748b"}
        />
      </View>
      <Text
        className={`text-sm font-bold ${isActive ? "text-white" : "text-ink-600 dark:text-ink-400"
          }`}
      >
        {label}
      </Text>
      {isActive && (
        <View className="ml-auto">
          <Ionicons name="chevron-forward" size={14} color="white" />
        </View>
      )}
    </Pressable>
  );
};


const items: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
    { name: "Home", label: "Dashboard", icon: "grid-outline", route: "/" },
    {
      name: "CheckInOut",
      label: "Check In / Out",
      icon: "time-outline",
      route: "/check-in-out",
    },
    {
      name: "History",
      label: "Attendance History",
      icon: "calendar-outline",
      route: "/history",
    },
    {
      name: "Profile",
      label: "My Profile",
      icon: "person-outline",
      route: "/profile",
    },
  ];

export const AppDrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { navigation } = props;

  const user = useProfileStore((s) => s.user);
  const profileImage = useProfileStore((s) => s.profileImage);
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);

  const name = user?.name ?? "User";
  const email = user?.email ?? authUser?.email ?? "";
  const role = user?.role ?? "Employee";

  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const handleNavigate = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await logout();
  };

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >

        <View className="bg-clay pb-8 pt-14 rounded-br-[90px]  px-4 shadow-2xl shadow-clay/30">

          <View className="flex-row mb-9">
            <View className="flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Ionicons name="pulse" size={26} color="#c45c3e" />
              </View>
              <Text className="text-2xl font-black tracking-tight text-white">
                SyncPulse
              </Text>
            </View>

          </View>

          {/* Profile Section Row */}
          <View className="flex-row items-center">
            {/* Avatar with Thick Squircle Border */}
            <View className="p-1 rounded-[24px] border-2 border-white/30 bg-white/10">
              <View className="h-20 w-20 overflow-hidden rounded-[18px] bg-white/20">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-2xl font-bold text-white">{initials || "U"}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Profile Info */}
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-black text-white leading-tight" numberOfLines={1}>
                {name}
              </Text>

              <View className="mt-2 self-start rounded-full bg-white px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-clay">
                  {role}
                </Text>
              </View>


              {/* Email */}
              <Text className="mt-2.5 text-[11px] font-semibold text-white/80" numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>


        {/* Navigation Items */}
        <View className="mt-8 px-4">
          <View className="mb-4 ml-1 flex-row items-center">
            <View className="h-1 w-4 rounded-full bg-clay" />
            <Text className="ml-2 text-[11px] font-black uppercase tracking-[2.5px] text-ink-400 dark:text-ink-500">
              main menu
            </Text>
          </View>
          {items.map((item) => (
            <NavItem
              key={item.name}
              label={item.label}
              icon={item.icon}
              route={item.route}
              isActive={pathname === item.route}
              onPress={() => handleNavigate(item.route)}
            />
          ))}
        </View>
      </DrawerContentScrollView>


      {/* Professional Footer Section */}
      <View className="border-t border-ink-100 p-6 dark:border-ink-800">
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-between rounded-2xl bg-red-500/5 px-5 py-4 dark:bg-red-400/5 border border-red-500/10"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View className="flex-row items-center ">
            <View className="mr-4 h-7 w-8 items-center justify-center rounded-lg bg-red-500/10 dark:bg-red-400/10">
              <Ionicons name="log-out" size={25} color="#ef4444" />
            </View>
            <View>
              <Text className="txt-md font-black text-clay  dark:text-red-400 tracking-tight">
                Logout
              </Text>

            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#ef4444" />
        </Pressable>

        <View className="mt-6 flex-row items-center justify-center opacity-40">
          <Text className="text-[10px] font-black uppercase tracking-widest text-ink-400 dark:text-ink-600">
            SyncPulse • v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
};



