import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { DrawerNavigator } from "@/navigation/DrawerNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { useAuthStore } from "@/features/authentication/store/AuthStore";
import { useAuthListener } from "@/features/authentication/hooks/useAuthListener";
import { useZustandStore } from "@/store/useZustandStore";
import { ProfileSetupModal } from "@/features/profile/components/ProfileSetupModal";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const ISO_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

const getSafeIsoTime = (value?: string) => {
  if (!value || !ISO_DATE_TIME_REGEX.test(value)) return null;
  const parsedTime = Date.parse(value);
  return Number.isNaN(parsedTime) ? null : parsedTime;
};

export const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasHydrated = useZustandStore((state) => state.hasHydrated);
  const hasSeenProfileSetup = useZustandStore((state) => state.hasSeenProfileSetup);
  const markProfileSetupSeen = useZustandStore((state) => state.markProfileSetupSeen);
  const [isProfileSetupVisible, setIsProfileSetupVisible] = useState(false);

  useAuthListener();

  const isFirstSignIn = useMemo(() => {
    if (!user) return false;
    const createdAt = getSafeIsoTime(user.metadata.creationTime);
    const lastSignInAt = getSafeIsoTime(user.metadata.lastSignInTime);

    if (createdAt === null || lastSignInAt === null) return false;
    return createdAt === lastSignInAt;
  }, [user]);

  useEffect(() => {
    if (!hasHydrated || !user) {
      setIsProfileSetupVisible(false);
      return;
    }

    if (isFirstSignIn && !hasSeenProfileSetup(user.uid)) {
      setIsProfileSetupVisible(true);
    } else {
      setIsProfileSetupVisible(false);
    }
  }, [hasHydrated, hasSeenProfileSetup, isFirstSignIn, user]);

  const closeSetupModal = () => {
    if (!user) return;
    markProfileSetupSeen(user.uid);
    setIsProfileSetupVisible(false);
  };

  if (isLoading && user === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#c45c3e" />
      </View>
    );
  }

  return (
    <>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={DrawerNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
      <ProfileSetupModal
        visible={Boolean(user) && hasHydrated && isProfileSetupVisible}
        initialEmail={user?.email}
        onComplete={closeSetupModal}
        onSkip={closeSetupModal}
      />
    </>
  );
};
