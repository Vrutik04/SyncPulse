import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const date = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 p-4">
      <Text className="text-xs text-ink-400 dark:text-ink-400 text-center uppercase tracking-widest mb-1">
        Today
      </Text>
      <Text className="text-2xl font-bold text-clay dark:text-clay-muted text-center">
        {time}
      </Text>
      <Text className="text-sm font-semibold text-ink-500 dark:text-ink-400 text-center mt-1">
        {date}
      </Text>
    </View>
  );
};