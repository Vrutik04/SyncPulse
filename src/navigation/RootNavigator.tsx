import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { DrawerNavigator } from "@/navigation/DrawerNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { useAuthStore } from "@/features/authentication/store/AuthStore";
import { useAuthListener } from "@/features/authentication/hooks/useAuthListener";
import { ProfileSetupModal } from "@/features/profile/components/ProfileSetupModal";
import { useProfileSetupGate } from "@/features/profile/hooks/useProfileSetupGate";
import { ActivityIndicator, View } from "react-native";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  useAuthListener();
  const { hasHydrated, isProfileSetupVisible, closeProfileSetupModal } =
    useProfileSetupGate({ user });

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
        onComplete={closeProfileSetupModal}
        onSkip={closeProfileSetupModal}
      />
    </>
  );
};
