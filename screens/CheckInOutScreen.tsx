import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

import { CheckinInputs } from "@/components/forms/CheckinInputs";
import { CheckoutInputs } from "@/components/forms/CheckoutInputs";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SuccessBanner } from "@/components/SuccessBanner";
import { useZustandStore } from "@/store/useZustandStore";
import type { WorkItem } from "@/types/checkIn";

import { formatDisplayDate, getDateKey } from "@/lib/date";

export const CheckInOutScreen = () => {
  const today = getDateKey();

  const { entries, saveCheckIn, saveCheckOut } = useZustandStore();

  const todayEntry = entries[today];

  // Form state
  const [projectName, setProjectName] = useState("");
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");

  const [works, setWorks] = useState<WorkItem[]>([
    { text: "", status: "completed" },
  ]);

  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [checkOutSuccess, setCheckOutSuccess] = useState(false);

  const isCheckInDone = !!todayEntry?.morning;

  // Load existing data
  useEffect(() => {
    if (todayEntry?.morning) {
      setProjectName(todayEntry.morning.projectName);
      setGoal(todayEntry.morning.goal);
      setNote(todayEntry.morning.note || "");
    }

    if (todayEntry?.evening) {
      if (todayEntry.evening.works && todayEntry.evening.works.length > 0) {
        setWorks(todayEntry.evening.works);
      } else if (todayEntry.evening.workCompleted) {
        setWorks([
          {
            text: todayEntry.evening.workCompleted,
            status: todayEntry.evening.status || "completed",
          },
        ]);
      }
    }
  }, [todayEntry]);

  // Check-in
  const handleCheckIn = () => {
    if (!projectName.trim() || !goal.trim()) {
      Alert.alert("Error", "Please enter project name and goal");
      return;
    }

    saveCheckIn(today, {
      projectName: projectName.trim(),
      goal: goal.trim(),
      note: note.trim(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setCheckInSuccess(true);
    setTimeout(() => setCheckInSuccess(false), 2000);
    };

  // Check-out
  const handleCheckOut = () => {
    const validWorks = works.filter((task) => task.text.trim() !== "");
    if (validWorks.length === 0) {
      Alert.alert("Error", "Please enter at least one work completed");
      return;
    }

    saveCheckOut(today, {
      works: validWorks.map((task) => ({
        text: task.text.trim(),
        status: task.status,
      })),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setCheckOutSuccess(true);
    setTimeout(() => setCheckOutSuccess(false), 2000);
  };

  return (
    <ScreenContainer title="Daily Check-in" subtitle={formatDisplayDate(today)}>
      {/*  Check-in Card */}
      <View
        className={`mb-6 rounded-3xl border ${isCheckInDone ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"} p-5 shadow-sm`}
      >
        <View className="flex-row items-center justify-center mb-1 ">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isCheckInDone ? "bg-green-100" : "bg-orange-100"}`}
          >
            {isCheckInDone ? (
              <Ionicons name="checkmark" size={18} color="#16a34a" />
            ) : (
              <Text className="text-sm font-bold text-orange-600">1</Text>
            )}
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-800">Check-in</Text>
            <Text className="text-xs text-gray-400">Plan your day clearly</Text>
          </View>
        </View>

        <View className="mt-4">
          <SuccessBanner visible={checkInSuccess} message="Check-in saved" />

          <CheckinInputs
            projectName={projectName}
            onProjectNameChange={setProjectName}
            goal={goal}
            onGoalChange={setGoal}
            note={note}
            onNoteChange={setNote}
          />

          <View className="mt-5">
            <PrimaryButton
              label={todayEntry?.morning ? "Update Check-in" : "Save Check-in"}
              onPress={handleCheckIn}
            />
          </View>
        </View>
      </View>

      {/*  Check-out Card */}
      <View className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm mb-8">
        <View className="flex-row items-center justify-center mb-1">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${isCheckInDone ? (todayEntry?.evening ? "bg-green-100" : "bg-orange-100") : "bg-gray-100"}`}
          >
            {todayEntry?.evening ? (
              <Ionicons name="checkmark" size={18} color="#16a34a" />
            ) : (
              <Text
                className={`text-sm font-bold ${isCheckInDone ? "text-orange-600" : "text-gray-400"}`}
              >
                2
              </Text>
            )}
          </View>
          <View>
            <Text
              className={`text-lg font-bold ${isCheckInDone ? "text-gray-800" : "text-gray-400"}`}
            >
              Check-out
            </Text>
            <Text className="text-xs text-gray-400">Reflect your progress</Text>
          </View>
        </View>

        {!isCheckInDone ? (
          <View className="items-center justify-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-5">
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mb-3">
              <Ionicons name="lock-closed" size={20} color="#9ca3af" />
            </View>
            <Text className="text-gray-600 font-semibold mb-1">
              Check-in Required
            </Text>
            <Text className="text-gray-400 text-xs text-center px-4">
              Please complete your morning check-in first to unlock the checkout
              form.
            </Text>
          </View>
        ) : (
          <View className="mt-4">
            <SuccessBanner
              visible={checkOutSuccess}
              message="Check-out saved"
            />

            <CheckoutInputs works={works} onWorksChange={setWorks} />

            <View className="mt-5">
              <PrimaryButton
                label={
                  todayEntry?.evening ? "Update Check-out" : "Save Check-out"
                }
                onPress={handleCheckOut}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};
