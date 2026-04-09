import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { DrawerNavigator } from "@/navigation/DrawerNavigator";


const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="App" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
};
