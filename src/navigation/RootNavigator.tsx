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
  const authUser = useAuthStore((state) => state.authUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  useAuthListener();
  const { isProfileSetupVisible, closeProfileSetupModal } = useProfileSetupGate({
    user: authUser,
  });

  if (isLoading && authUser === null) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#c45c3e" />
      </View>
    );
  }

  return (
    <>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authUser ? (
          <RootStack.Screen name="App" component={DrawerNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
      <ProfileSetupModal
        visible={Boolean(authUser) && isProfileSetupVisible}
        initialEmail={authUser?.email}
        onComplete={closeProfileSetupModal}
        onSkip={closeProfileSetupModal}
      />
    </>
  );
};
