import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  //  Update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //  Format date
  const date = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  //  Format time
  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 rounded-xl border border-gray-300 p-4">
      <Text className="text-sm text-gray-600 text-center">Today</Text>

      <Text className="text-2xl font-bold text-gray-500  text-center">
        {time}
      </Text>
      <Text className="text-md font-semibold text-gray-500  text-center">
        {date}
      </Text>
    </View>
  );
};