import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/types";
import Login from "@/features/auth/screens/Login";
import Signup from "@/features/auth/screens/Signup";
import ForgotPassword from "@/features/auth/screens/ForgotPassword";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};
