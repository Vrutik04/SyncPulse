import { ScreenContainer } from "@/components/ScreenContainer";
import { formatDisplayDate, formatTime, getDateKey } from "@/lib/date";
import { computeStreak } from "@/lib/stats";
import { useZustandStore } from "@/store/useZustandStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import { DateTimeCard } from "@/components/DateTimeCard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const HomeScreen = () => {
  const navigation = useNavigation();

  //  Get today's date
  const today = getDateKey();

  //  Get data from store
  const entries = useZustandStore((state) => state.entries);
  const todayEntry = entries[today];

  //  Stats
  const streak = computeStreak(entries);

  //  Check status
  const isCheckinDone = todayEntry?.morning ? true : false;
  const isCheckoutDone = todayEntry?.evening ? true : false;

  // progress bar
  const progress =
    todayEntry?.morning && todayEntry?.evening
      ? 1
      : todayEntry?.morning
        ? 0.5
        : 0;

  // streak animation
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1.2);
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 500);
  }, [streak]);

  return (
    <ScreenContainer title="Home" subtitle={formatDisplayDate(today)}>
      {/*  Today Summary */}
      <View className="mb-6 rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#ea580c" />
          <Text className="text-base font-bold text-orange-800 ml-2">
            Today's Overview
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-orange-100 flex-row justify-between">
          <View className="flex-1">
            <Text className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">
              Morning
            </Text>
            {todayEntry?.morning?.checkedInAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-gray-800 ml-2">
                  {formatTime(todayEntry.morning.checkedInAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="ellipse-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-gray-400 ml-2">Pending</Text>
              </View>
            )}
          </View>
          <View className="w-px bg-gray-100 mx-4" />
          <View className="flex-1">
            <Text className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">
              Evening
            </Text>
            {todayEntry?.evening?.checkedOutAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-gray-800 ml-2">
                  {formatTime(todayEntry.evening.checkedOutAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-gray-400 ml-2">Pending</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/*  Top Card */}
      <View className="mb-4 flex-row gap-3">
        {/* streak   */}
        <View className="mb-5 p-4 rounded-2xl bg-orange-100 border border-orange-200">
          <Text className="text-sm text-orange-600">Current Streak</Text>

          <Animated.View
            style={useAnimatedStyle(() => ({
              transform: [{ scale: scale.value }],
            }))}
          >
            <Text className="text-2xl font-bold text-orange-700 mt-1">
              🔥 {streak} days
            </Text>
          </Animated.View>
          <Text className="text-xs text-orange-500 mt-1">
            Keep going! You're doing great 💪
          </Text>
        </View>
        {/* today date and time  */}
        <DateTimeCard />
      </View>

      {/*  Check In Button */}
      <Text className="mb-2 text-xs text-gray-400 uppercase">
        Check In / Check Out
      </Text>

      <Pressable
        onPress={() => (navigation as any).navigate("CheckInOut")}
        className="mb-5 flex-row items-center p-3 rounded-xl border border-gray-300 bg-white"
      >
        <View className="mr-3 h-12 w-12 items-center justify-center bg-orange-100 rounded-xl">
          <Ionicons name="create" size={24} color="#ea580c" />
        </View>

        <View className="flex-1">
          <Text className="font-semibold">Check In</Text>
          <Text className="text-sm text-gray-500">Mark your Check-in</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="gray" />
      </Pressable>

      {/* Today Section */}
      <Text className="mb-2 text-xs text-gray-400 uppercase">Today</Text>

      {/*  Morning */}
      <View className="mb-3 p-3 rounded-xl border border-gray-300 bg-white">
        <Text className="text-xs text-gray-500">Check-in</Text>

        {isCheckinDone ? (
          <>
            <Text className="font-semibold">
              {todayEntry?.morning?.projectName}
            </Text>
            <Text className="text-sm text-gray-600">
              {todayEntry?.morning?.goal}
            </Text>
            <Text className="text-xs text-gray-400">
              {formatTime(todayEntry?.morning?.checkedInAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-gray-400">Not filled yet</Text>
        )}
      </View>

      {/*  Evening */}
      <View className="p-3 rounded-xl border border-gray-300 bg-white">
        <Text className="text-xs text-gray-500">Check-out</Text>

        {isCheckoutDone ? (
          <>
            <Text className="text-sm">
              {todayEntry?.evening?.workCompleted}
            </Text>
            <Text className="text-xs text-gray-400">
              {formatTime(todayEntry?.evening?.checkedOutAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-gray-400">Not filled yet</Text>
        )}
      </View>
      <View className="mb-5 mt-5">
        <Text className="text-xs text-gray-500 mb-1 text-center">
          Today's Progress
        </Text>

        <View className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress * 100}%` }}
            className="h-full bg-green-500"
          />
        </View>

        <Text className="text-xs text-gray-400 mt-1 text-center">
          {progress === 1
            ? "Completed"
            : progress === 0.5
              ? "Half done"
              : "Not started"}
        </Text>
      </View>
    </ScreenContainer>
  );
};
