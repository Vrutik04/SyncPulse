import { DateTimeCard } from "@/features/check-in-out/components/DateTimeCard";
import { MissedCheckoutModal } from "@/features/check-in-out/components/MissedCheckoutModal";
import { WorkItem } from "@/features/check-in-out/types/Checkinout";
import type { HomeScreenNavigationProp } from "@/navigation/types";
import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { StatusIndicator } from "@/shared/components/StatusIndicator";
import { formatDisplayDate, formatTime, getDateKey } from "@/shared/utils/date";
import { isMissedCheckout } from "@/shared/utils/missedCheckout";
import { useCheckinStore } from "@/features/check-in-out/store/useCheckinStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, View } from "react-native";

export const HomeScreen = () => {
  const router = useRouter();

  const today = getDateKey();
  const entries = useCheckinStore((state) => state.entries);
  const isActivitiesLoaded = useCheckinStore((state) => state.isActivitiesLoaded);
  const todayEntry = entries[today];

  const isCheckinDone = !!todayEntry?.Checkin;
  const isCheckoutDone = !!todayEntry?.Checkout;

  const progress =
    isCheckinDone && isCheckoutDone ? 1 : isCheckinDone ? 0.5 : 0;

  const [showModal, setShowModal] = useState(false);
  const alreadyChecked = useRef(false);

  // Animation values for the quick action button
  const scaleAnim = useRef(new Animated.Value(1)).current;



  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  useEffect(() => {
    if (!isActivitiesLoaded) return;

    if (alreadyChecked.current) return;
    alreadyChecked.current = true;

    if (isMissedCheckout(entries)) {
      setShowModal(true);
    }
  }, [isActivitiesLoaded, entries]);

  //  action based on status
  let actionTitle = "Check In";
  let actionSubtitle = "Start your workday";
  let actionIcon: keyof typeof Ionicons.glyphMap = "log-in-outline";
  let actionRoute = "Checkin";

  if (isCheckinDone && !isCheckoutDone) {
    actionTitle = "Check Out";
    actionSubtitle = "Wrap up your day";
    actionIcon = "log-out-outline";
    actionRoute = "Checkout";
  } else if (isCheckinDone && isCheckoutDone) {
    actionTitle = "Done";
    actionSubtitle = "All activities done";
    actionIcon = "checkmark-done-circle-outline";
    actionRoute = "Checkin";
  }

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
            className="flex-1 active:opacity-60"
            onPress={() => router.push({ pathname: "/(app)/(tabs)/check-in-out", params: { tab: "Checkin" } })}
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Check in
            </Text>
            {todayEntry?.Checkin?.checkInTime || todayEntry?.Checkin?.checkedInAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {todayEntry.Checkin.checkInTime || formatTime(todayEntry.Checkin.checkedInAt)}
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
            className="flex-1 active:opacity-60"
            onPress={() => router.push({ pathname: "/(app)/(tabs)/check-in-out", params: { tab: "Checkout" } })}
          >
            <Text className="text-xs text-ink-400 dark:text-ink-400 font-medium mb-1 uppercase tracking-wider">
              Check out
            </Text>
            {todayEntry?.Checkout?.checkOutTime || todayEntry?.Checkout?.checkedOutAt ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100 ml-2">
                  {todayEntry.Checkout.checkOutTime || formatTime(todayEntry.Checkout.checkedOutAt)}
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

      {/* Circular Quick Action Button */}
      <View className="items-center justify-center mb-8 mt-2">
        <View className="rounded-full p-4 bg-clay/10 dark:bg-clay/10">
          <View className={`rounded-full p-4 bg-clay/20 dark:bg-clay/20 ${
            progress === 1 ? 'items-end' : progress === 0 ? 'items-start' : 'items-center'
          }`}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                if (isCheckinDone && isCheckoutDone) {
                  Alert.alert("Check in and check out done for today");
                } else {
                  router.push({ pathname: "/(app)/(tabs)/check-in-out", params: { tab: actionRoute } });
                }
              }}
            >
              <Animated.View
                className="h-32 w-32 rounded-full items-center justify-center shadow-xl bg-clay"
                style={{
                  transform: [{ scale: scaleAnim }],
                  elevation: 12,
                  shadowColor: "#c45c3e",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20
                }}
              >
                <View className="items-center justify-center mb-1">
                  <Ionicons 
                    name={actionIcon} 
                    size={34} 
                    color="#ffffff" 
                  />
                </View>
                <Text className="text-lg font-extrabold tracking-tight text-white">
                  {actionTitle}
                </Text>
                {actionSubtitle && (
                  <Text className="text-[10px] font-medium mt-1 text-white/80 uppercase tracking-widest text-center px-2">
                    {actionSubtitle}
                  </Text>
                )}
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View className="mb-6 bg-white dark:bg-ink-900 rounded-2xl p-5 border border-ink-100 dark:border-ink-800 shadow-sm">
        <View className="flex-row justify-between items-end mb-3">
          <Text className="text-sm font-bold text-ink-900 dark:text-ink-50">
            Daily Progress
          </Text>
          <Text className="text-xs font-medium text-clay dark:text-clay-muted">
             {progress === 1
              ? "100%"
              : progress === 0.5
                ? "50%"
                : "0%"}
          </Text>
        </View>
        <View className="h-2 w-full bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress * 100}%` }}
            className="h-full bg-clay dark:bg-clay-muted rounded-full"
          />
        </View>
        <Text className="text-xs text-ink-400 dark:text-ink-500 mt-3 text-center">
          {progress === 1
            ? "Great job! You've completed your day."
            : progress === 0.5
              ? "You're checked in. Don't forget to check out!"
              : "Ready to start your day?"}
        </Text>
      </View>

      {/* Activity Timeline */}
      {(isCheckinDone || isCheckoutDone) && (
        <View className="mb-8">
          <Text className="text-base font-bold text-ink-900 dark:text-ink-50 mb-4 px-1">
            Activity Details
          </Text>
          
          <View className="bg-white dark:bg-ink-900 rounded-2xl p-5 border border-ink-100 dark:border-ink-800 shadow-sm">
            {/* Checkin Summary */}
            {isCheckinDone && (
              <View className={isCheckoutDone ? "mb-6" : ""}>
                <View className="flex-row items-center mb-2">
                  <View className="h-2 w-2 rounded-full bg-clay mr-3" />
                  <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100">
                    Started Work
                  </Text>
                  <Text className="text-xs text-ink-400 ml-auto">
                    {todayEntry?.Checkin?.checkInTime || formatTime(todayEntry?.Checkin?.checkedInAt || "")}
                  </Text>
                </View>
                <View className={`ml-1 pl-4 border-l-2 ${isCheckoutDone ? "border-ink-100 dark:border-ink-800" : "border-transparent"}`}>
                  <Text className="font-medium text-ink-900 dark:text-ink-50 mb-1">
                    {todayEntry?.Checkin?.projectName}
                  </Text>
                  <Text className="text-sm text-ink-600 dark:text-ink-300">
                    {todayEntry?.Checkin?.task}
                  </Text>
                </View>
              </View>
            )}

            {/* Checkout Summary */}
            {isCheckoutDone && (
              <View>
                <View className="flex-row items-center mb-2">
                  <View className="h-2 w-2 rounded-full bg-green-500 mr-3" />
                  <Text className="text-sm font-semibold text-ink-800 dark:text-ink-100">
                    Completed Work

                  </Text>
                  <Text className="text-xs text-ink-300 ml-auto">
                    {todayEntry?.Checkout?.checkOutTime || formatTime(todayEntry?.Checkout?.checkedOutAt || "")}
                  </Text>
                </View>
                <View className="ml-1 pl-4 border-l-2 border-transparent">
                  {todayEntry?.Checkout?.works?.map((w: WorkItem, idx: number) => (
                    <View key={idx} className="flex-row justify-between items-center mb-2 bg-ink-50 dark:bg-ink-800/50 p-2 rounded-lg">
                      <Text className="text-sm text-ink-700 dark:text-ink-200 flex-1 pr-2">
                        {w.text}
                      </Text>
                      <StatusIndicator status={w.status || "completed"} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
