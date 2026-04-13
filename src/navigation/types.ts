import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  App: undefined;
};

export type DrawerParamList = {
  Main: undefined;
};

export type TabParamList = {
  Home: undefined;
  CheckInOut: { tab?: "Checkin" | "Checkout" } | undefined;
  History: undefined;
  Profile: undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, "Home">;
