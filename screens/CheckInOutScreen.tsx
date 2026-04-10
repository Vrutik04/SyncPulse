import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { CheckinInputs } from "@/components/forms/CheckinInputs";
import { CheckoutInputs } from "@/components/forms/CheckoutInputs";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SuccessBanner } from "@/components/SuccessBanner";
import { formatDisplayDate, getDateKey } from "@/lib/date";
import { useZustandStore } from "@/store/useZustandStore";
import type { WorkItem } from "@/types/checkIn";

// Types

type FormState = {
  projectName: string;
  goal: string;
  note: string;
  works: WorkItem[];
};

type UIState = {
  activeTab: "Morning" | "Evening";
  checkInSuccess: boolean;
  checkOutSuccess: boolean;
  loading: boolean;
  errors: {
    projectName: string;
    goal: string;
    works: string;
  };
};

// Screen

type Props = {
  route?: { params?: { tab?: "Morning" | "Evening" } };
};

export const CheckInOutScreen = ({ route }: Props) => {
  const initialTab: "Morning" | "Evening" = route?.params?.tab ?? "Morning";

  const today = getDateKey();
  const { entries, saveCheckIn, saveCheckOut } = useZustandStore();
  const todayEntry = entries[today];

  // State
  const [form, setForm] = useState<FormState>({
    projectName: "",
    goal: "",
    note: "",
    works: [{ text: "", status: "completed" }],
  });

  const [ui, setUI] = useState<UIState>({
    activeTab: initialTab,
    checkInSuccess: false,
    checkOutSuccess: false,
    loading: false,
    errors: { projectName: "", goal: "", works: "" },
  });

  // switch tabs.
  useEffect(() => {
    const tab = route?.params?.tab;
    if (tab) {
      setUI((prev) => ({ ...prev, activeTab: tab }));
    }
  }, [route?.params?.tab]);

  // Pre-fill form with today's saved data when it exists.
  useEffect(() => {
    if (todayEntry?.morning) {
      setForm((prev) => ({
        ...prev,
        projectName: todayEntry.morning?.projectName ?? "",
        goal: todayEntry.morning?.goal ?? "",
        note: todayEntry.morning?.note ?? "",
      }));
    }
    if (todayEntry?.evening?.works?.length) {
      setForm((prev) => ({ ...prev, works: todayEntry.evening!.works! }));
    }
  }, [todayEntry]);

  const isCheckInDone = !!todayEntry?.morning;

  // Helpers
  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateUI = <K extends keyof UIState>(key: K, value: UIState[K]) => {
    setUI((prev) => ({ ...prev, [key]: value }));
  };

  // Handlers
  const handleCheckIn = () => {
    if (!form.projectName.trim() || !form.goal.trim()) {
      Alert.alert("Error", "Please enter project name and goal");
      return;
    }
    saveCheckIn(today, {
      projectName: form.projectName.trim(),
      goal: form.goal.trim(),
      note: form.note.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateUI("checkInSuccess", true);
    setTimeout(() => updateUI("checkInSuccess", false), 2000);
  };

  const handleCheckOut = () => {
    const validWorks = form.works.filter((task) => task.text.trim() !== "");
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
    updateUI("checkOutSuccess", true);
    setTimeout(() => updateUI("checkOutSuccess", false), 2000);
  };

  // Render
  return (
    <ScreenContainer title="Daily Check-in" subtitle={formatDisplayDate(today)}>

      {/* Tab switcher */}
      <View className="flex-row bg-ink-100 dark:bg-ink-800 p-1 rounded-xl mb-6">
        <Pressable
          onPress={() => updateUI("activeTab", "Morning")}
          style={ui.activeTab === "Morning" ? { backgroundColor: "#c45c3e" } : {}}
          className="flex-1 py-2.5 rounded-lg items-center justify-center"
        >
          <Text
            className={`font-semibold text-sm ${
              ui.activeTab === "Morning"
                ? "text-white"
                : "text-ink-500 dark:text-ink-400"
            }`}
          >
            CHECK IN
          </Text>
        </Pressable>

        <Pressable
          onPress={() => updateUI("activeTab", "Evening")}
          style={ui.activeTab === "Evening" ? { backgroundColor: "#c45c3e" } : {}}
          className="flex-1 py-2.5 rounded-lg items-center justify-center"
        >
          <Text
            className={`font-semibold text-sm ${
              ui.activeTab === "Evening"
                ? "text-white"
                : "text-ink-500 dark:text-ink-400"
            }`}
          >
            CHECK OUT
          </Text>
        </Pressable>
      </View>

      {/*  Check-in */}
      {ui.activeTab === "Morning" && (
        <View className="mb-6 rounded-3xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm overflow-hidden">

          {/* Coloured top bar when checked in */}
          {isCheckInDone && (
            <View
              style={{ backgroundColor: "#c45c3e" }}
              className="flex-row items-center px-5 py-3"
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text className="text-white font-semibold ml-2 text-sm">
                Checked In ✓
              </Text>
            </View>
          )}

          <View className="p-5">
            {/* Header */}
            <View className="flex-row items-center mb-4">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
                  isCheckInDone
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-orange-100 dark:bg-clay/20"
                }`}
              >
                {isCheckInDone ? (
                  <Ionicons name="checkmark" size={18} color="#16a34a" />
                ) : (
                  <Text className="text-sm font-bold text-clay">1</Text>
                )}
              </View>
              <View>
                <Text className="text-lg font-bold text-ink-900 dark:text-ink-50">
                  Check-in
                </Text>
                <Text className="text-xs text-ink-400 dark:text-ink-500">
                  Plan your day clearly
                </Text>
              </View>
            </View>

            {/* Form */}
            <SuccessBanner visible={ui.checkInSuccess} message="Check-in saved!" />
            <CheckinInputs
              projectName={form.projectName}
              onProjectNameChange={(v) => updateForm("projectName", v)}
              goal={form.goal}
              onGoalChange={(v) => updateForm("goal", v)}
              note={form.note}
              onNoteChange={(v) => updateForm("note", v)}
            />
            <View className="mt-5">
              <PrimaryButton
                label={todayEntry?.morning ? "Update Check-in" : "Submit Check-In"}
                onPress={handleCheckIn}
              />
            </View>
          </View>
        </View>
      )}

      {/* Check-out */}
      {ui.activeTab === "Evening" && (
        <View className="rounded-3xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm mb-8 overflow-hidden">

          {/* Coloured top bar when checked out */}
          {todayEntry?.evening && (
            <View
              style={{ backgroundColor: "#c45c3e" }}
              className="flex-row items-center px-5 py-3"
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text className="text-white font-semibold ml-2 text-sm">
                Checked Out ✓
              </Text>
            </View>
          )}

          <View className="p-5">
            {/* Header */}
            <View className="flex-row items-center mb-4">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
                  isCheckInDone
                    ? todayEntry?.evening
                      ? "bg-green-100 dark:bg-green-900/40"
                      : "bg-orange-100 dark:bg-clay/20"
                    : "bg-ink-100 dark:bg-ink-800"
                }`}
              >
                {todayEntry?.evening ? (
                  <Ionicons name="checkmark" size={18} color="#16a34a" />
                ) : (
                  <Text
                    className={`text-sm font-bold ${
                      isCheckInDone
                        ? "text-clay"
                        : "text-ink-400 dark:text-ink-500"
                    }`}
                  >
                    2
                  </Text>
                )}
              </View>
              <View>
                <Text
                  className={`text-lg font-bold ${
                    isCheckInDone
                      ? "text-ink-900 dark:text-ink-50"
                      : "text-ink-400 dark:text-ink-500"
                  }`}
                >
                  Check-out
                </Text>
                <Text className="text-xs text-ink-400 dark:text-ink-500">
                  Reflect your progress
                </Text>
              </View>
            </View>

            {/* Locked */}
            {!isCheckInDone ? (
              <View className="items-center justify-center py-8 bg-ink-50 dark:bg-ink-800 rounded-2xl border border-dashed border-ink-200 dark:border-ink-700">
                <View className="w-12 h-12 rounded-full bg-ink-200 dark:bg-ink-700 items-center justify-center mb-3">
                  <Ionicons name="lock-closed" size={20} color="#9ca3af" />
                </View>
                <Text className="text-ink-600 dark:text-ink-300 font-semibold mb-1">
                  Check-in Required
                </Text>
                <Text className="text-ink-400 dark:text-ink-500 text-xs text-center px-4">
                  Complete your morning check-in first to unlock the checkout form.
                </Text>
              </View>
            ) : (
              /* Form */
              <View>
                <SuccessBanner visible={ui.checkOutSuccess} message="Check-out saved!" />
                <CheckoutInputs
                  works={form.works}
                  onWorksChange={(v) => updateForm("works", v)}
                />
                <View className="mt-5">
                  <PrimaryButton
                    label={todayEntry?.evening ? "Update Check-out" : "Submit Check-Out"}
                    onPress={handleCheckOut}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};
