import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type NoParams = undefined;

export type RootStackParamList = {
  Auth: NoParams;
  App: NoParams;
};

export type AuthStackParamList = {
  Login: NoParams;
  Signup: NoParams;
  ForgotPassword: NoParams;
};

export type DrawerParamList = {
  Main: NoParams;
};

export type TabParamList = {
  Home: NoParams;
  CheckInOut: { tab?: "Checkin" | "Checkout" } | NoParams;
  History: NoParams;
  Profile: NoParams;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<
  TabParamList,
  "Home"
>;
