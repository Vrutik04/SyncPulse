import { AppDrawerContent } from "@/navigation/AppDrawerContent";
import { Drawer } from "expo-router/drawer";

export default function AppDrawerLayout() {
  return (
    <Drawer
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
        name="(tabs)"
        options={{
          drawerLabel: "Daily",
          title: "Checksy",
        }}
      />
    </Drawer>
  );
}
