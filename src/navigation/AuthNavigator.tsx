import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "@/navigation/types";
import Login from "@/features/authentication/screens/Login";
import Signup from "@/features/authentication/screens/Signup";
import ForgotPassword from "@/features/authentication/screens/ForgotPassword";

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
