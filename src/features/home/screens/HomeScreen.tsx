import { DateTimeCard } from "@/features/checkincheckout/components/DateTimeCard";
import { MissedCheckoutModal } from "@/features/checkincheckout/components/MissedCheckoutModal";
import { isMissedCheckout } from "@/shared/utils/missedCheckout";
import type { HomeScreenNavigationProp } from "@/navigation/types";
import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { formatDisplayDate, formatTime, getDateKey } from "@/shared/utils/date";
import { useZustandStore } from "@/store/useZustandStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const today = getDateKey();
  const todayEntry = useZustandStore((state) => state.entries[today]);

  const isCheckinDone = !!todayEntry?.Checkin;
  const isCheckoutDone = !!todayEntry?.Checkout;

  const progress =
    isCheckinDone && isCheckoutDone ? 1 : isCheckinDone ? 0.5 : 0;

  const [showModal, setShowModal] = useState(false);
  const alreadyChecked = useRef(false);

  useEffect(() => {
    if (alreadyChecked.current) return;
    alreadyChecked.current = true;
    const currentEntries = useZustandStore.getState().entries;
    if (isMissedCheckout(currentEntries)) {
      setShowModal(true);
    }
  }, []);

  return (
    <ScreenContainer
      title="Welcome to SyncPulse"
      subtitle={formatDisplayDate(today)}
    >
      <MissedCheckoutModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
      />
      {/* Today's Overview card */}
      <View className="mb-6 rounded-3xl border border-clay/30 dark:border-clay/40 bg-orange-50 dark:bg-ink-900 p-5 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#c45c3e" />
          <Text className="text-base font-bold text-clay dark:text-clay-muted ml-2">
            Today's Overview
          </Text>
        </View>

        <View className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-orange-100 dark:border-ink-700 flex-row justify-between">
          {/* Checkin — tap to open Check-in tab */}
          <Pressable
            className="flex-1"
            onPress={() =>
              navigation.navigate("CheckInOut", { tab: "Checkin" })
            }
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Check in
            </Text>
            {todayEntry?.Checkin?.checkedInAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {formatTime(todayEntry.Checkin.checkedInAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-ink-400 dark:text-ink-500 ml-2">
                  Pending
                </Text>
              </View>
            )}
          </Pressable>

          <View className="w-px bg-ink-100 dark:bg-ink-700 mx-4" />

          {/* Checkout — tap to open Check-out tab */}
          <Pressable
            className="flex-1"
            onPress={() =>
              navigation.navigate("CheckInOut", { tab: "Checkout" })
            }
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Check out
            </Text>
            {todayEntry?.Checkout?.checkedOutAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {formatTime(todayEntry.Checkout.checkedOutAt)}
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9ca3af" />
                <Text className="text-sm text-ink-400 dark:text-ink-500 ml-2">
                  Pending
                </Text>
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
        Checkin / Check Out
      </Text>

      <Pressable
        onPress={() => navigation.navigate("CheckInOut")}
        className="mb-5 flex-row items-center p-3 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900"
      >
        <View className="mr-3 h-12 w-12 items-center justify-center bg-orange-100 dark:bg-clay/20 rounded-xl">
          <Ionicons name="create" size={24} color="#c45c3e" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-ink-900 dark:text-ink-50">
            Checkin
          </Text>
          <Text className="text-sm text-ink-400 dark:text-ink-400">
            Please Check-in
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </Pressable>

      {/* Today's Activity */}
      <Text className="mb-2 text-xs text-ink-400 dark:text-ink-500 uppercase tracking-wider">
        Today
      </Text>

      {/* Checkin summary */}
      <View className="mb-3 p-4 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
        <Text className="text-xs text-ink-400 dark:text-ink-500 mb-1">
          Check-in
        </Text>
        {isCheckinDone ? (
          <>
            <Text className="font-semibold text-ink-900 dark:text-ink-50">
              {todayEntry?.Checkin?.projectName}
            </Text>
            <Text className="text-sm text-ink-600 dark:text-ink-300">
              {todayEntry?.Checkin?.goal}
            </Text>
            <Text className="text-xs text-ink-400 dark:text-ink-500 mt-1">
              {formatTime(todayEntry?.Checkin?.checkedInAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-ink-400 dark:text-ink-500">
            Not filled yet
          </Text>
        )}
      </View>

      {/* Checkout summary */}
      <View className="p-4 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900">
        <Text className="text-xs text-ink-400 dark:text-ink-500 mb-1">
          Check-out
        </Text>
        {isCheckoutDone ? (
          <>
            <Text className="text-sm text-ink-700 dark:text-ink-200">
              {todayEntry?.Checkout?.workCompleted}
            </Text>
            <Text className="text-xs text-ink-400 dark:text-ink-500 mt-1">
              {formatTime(todayEntry?.Checkout?.checkedOutAt || "")}
            </Text>
          </>
        ) : (
          <Text className="text-sm text-ink-400 dark:text-ink-500">
            Not filled yet
          </Text>
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
