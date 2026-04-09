import { createDrawerNavigator } from "@react-navigation/drawer";
import { AppDrawerContent } from "@/navigation/AppDrawerContent";
import type { DrawerParamList } from "@/navigation/types";
import { TabNavigator } from "@/navigation/TabNavigator";

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#c45c3e",
        drawerInactiveTintColor: "#6b7280",
        drawerLabelStyle: { fontWeight: "600", fontSize: 15 },
        drawerStyle: { width: 300 },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          drawerLabel: "Daily",
          title: "Checksy",
        }}
      />
    </Drawer.Navigator>
  );
};
