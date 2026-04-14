import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minsStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minsStr} ${ampm}`;
};

const formatDate = (date: Date) => {
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

export const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let lastMinute = new Date().getMinutes();
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        setCurrentTime(now);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-orange-900 p-4">
      <Text className="text-xs text-ink-400 dark:text-ink-400 text-center uppercase tracking-widest mb-1">
        Today
      </Text>
      <Text className="text-2xl font-bold text-clay dark:text-clay-muted text-center">
        {formatTime(currentTime)}
      </Text>
      <Text className="text-sm font-semibold text-ink-500 dark:text-ink-400 text-center mt-1">
        {formatDate(currentTime)}
      </Text>
    </View>
  );
};