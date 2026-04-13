import { Text, View } from "react-native";

type WeeklyDots = {
  total: number;
  filled: number;
};

export const WeeklyDots = ({ total, filled }: WeeklyDots) => (
  <View className=" m-1">
    <Text className="mb-2 mt-2 text-xs font-medium uppercase tracking-wider text-ink-400 dark:text-ink-500 text-center ">
      This week
    </Text>
    <View className="flex-row items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`h-2.5 flex-1 rounded-full ${
            i < filled
              ? "bg-clay dark:bg-clay-muted"
              : "bg-ink-200 dark:bg-ink-800"
          }`}
        />
      ))}
    </View>
    <Text className="mt-2 text-xs text-ink-500 dark:text-ink-400 text-center " >
      {filled} of {total} days Checked-In&out 
    </Text>
  </View>
);
