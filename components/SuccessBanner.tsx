import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type SuccessBanner = {
  message: string;
  visible: boolean;
};

export const SuccessBanner = ({ message, visible }: SuccessBanner) => {
  if (!visible) return null;
  return (
    <View className="mb-4 flex-row items-center gap-2 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-3">
      <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
      <Text className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
        {message}
      </Text>
    </View>
  );
};
