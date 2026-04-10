import { ScreenContainer } from "@/components/ScreenContainer";
import { DateTimeCard } from "@/components/DateTimeCard";
import { formatDisplayDate, formatTime, getDateKey } from "@/lib/date";
import { useZustandStore } from "@/store/useZustandStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const today = getDateKey();
  const entries = useZustandStore((state) => state.entries);
  const todayEntry = entries[today];

  const isCheckinDone = !!todayEntry?.morning;
  const isCheckoutDone = !!todayEntry?.evening;

  // 0 = nothing, 0.5 = checked in, 1 = both done
  const progress = isCheckinDone && isCheckoutDone ? 1 : isCheckinDone ? 0.5 : 0;

  return (
    <ScreenContainer title="Home" subtitle={formatDisplayDate(today)}>

      {/* Today's Overview card */}
      <View className="mb-6 rounded-3xl border border-clay/30 dark:border-clay/40 bg-orange-50 dark:bg-ink-900 p-5 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#c45c3e" />
          <Text className="text-base font-bold text-clay dark:text-clay-muted ml-2">
            Today's Overview
          </Text>
        </View>

        <View className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-orange-100 dark:border-ink-700 flex-row justify-between">

          {/* Morning — tap to open Check-in tab */}
          <Pressable
            className="flex-1"
            onPress={() => navigation.navigate("CheckInOut", { tab: "Morning" })}
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Morning
            </Text>
            {todayEntry?.morning?.checkedInAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {formatTime(todayEntry.morning.checkedInAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="ellipse-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-ink-400 dark:text-ink-500 ml-2">Pending</Text>
              </View>
            )}
          </Pressable>

          <View className="w-px bg-ink-100 dark:bg-ink-700 mx-4" />

          {/* Evening — tap to open Check-out tab */}
          <Pressable
            className="flex-1"
            onPress={() => navigation.navigate("CheckInOut", { tab: "Evening" })}
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Evening
            </Text>
            {todayEntry?.evening?.checkedOutAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {formatTime(todayEntry.evening.checkedOutAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-ink-400 dark:text-ink-500 ml-2">Pending</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Date & time card */}
      <View className="mb-4">
        <DateTimeCard />
      </View>

      {/* Quick navigate button */}
      <Text className="mb-2 text-xs text-ink-400 dark:text-ink-500 uppercase tracking-wider">
        Check In / Check Out
      </Text>

      <Pressable
        onPress={() => navigation.navigate("CheckInOut")}
        className="mb-5 flex-row items-center p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900"
      >
        <View className="mr-3 h-12 w-12 items-center justify-center bg-orange-100 dark:bg-clay/20 rounded-xl">
          <Ionicons name="create" size={24} color="#c45c3e" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-ink-900 dark:text-ink-50">Check In</Text>
          <Text className="text-sm text-ink-400 dark:text-ink-400">Mark your Check-in</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </Pressable>

      {/* Today's summary */}
      <Text className="mb-2 text-xs text-ink-400 dark:text-ink-500 uppercase tracking-wider">Today</Text>

      {/* Morning summary */}
      <View className="mb-3 p-4 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
        <Text className="text-xs text-ink-400 dark:text-ink-500 mb-1">Check-in</Text>
        {isCheckinDone ? (
          <>
            <Text className="font-semibold text-ink-900 dark:text-ink-50">
              {todayEntry?.morning?.projectName}
            </Text>
            <Text className="text-sm text-ink-600 dark:text-ink-300">
              {todayEntry?.morning?.goal}
            </Text>
            <Text className="text-xs text-ink-400 dark:text-ink-500 mt-1">
              {formatTime(todayEntry?.morning?.checkedInAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-ink-400 dark:text-ink-500">Not filled yet</Text>
        )}
      </View>

      {/* Evening summary */}
      <View className="p-4 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
        <Text className="text-xs text-ink-400 dark:text-ink-500 mb-1">Check-out</Text>
        {isCheckoutDone ? (
          <>
            <Text className="text-sm text-ink-700 dark:text-ink-200">
              {todayEntry?.evening?.workCompleted}
            </Text>
            <Text className="text-xs text-ink-400 dark:text-ink-500 mt-1">
              {formatTime(todayEntry?.evening?.checkedOutAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-ink-400 dark:text-ink-500">Not filled yet</Text>
        )}
      </View>

      {/* Progress bar */}
      <View className="mb-5 mt-5">
        <Text className="text-xs text-ink-400 dark:text-ink-500 mb-2 text-center">
          Today's Progress
        </Text>
        <View className="h-3 w-full bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress * 100}%` }}
            className="h-full bg-clay dark:bg-clay-muted rounded-full"
          />
        </View>
        <Text className="text-xs text-ink-400 dark:text-ink-500 mt-2 text-center">
          {progress === 1
            ? "Completed 🎉"
            : progress === 0.5
              ? "Half done – keep going!"
              : "Not started yet"}
        </Text>
      </View>

    </ScreenContainer>
  );
};
