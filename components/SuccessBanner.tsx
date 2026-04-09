import { Text, View } from "react-native";

type SuccessBanner = {
  message: string;
  visible: boolean;
};

export const SuccessBanner = ({ message, visible }: SuccessBanner) => {

  if (!visible) return null;

  return (
    <View className="mb-4 rounded-2xl border border-emerald-300/80 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/80">
      <Text className="text-center text-sm font-medium text-emerald-900 dark:text-emerald-100">
        {message}
      </Text>
    </View>
  );
};
