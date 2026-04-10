import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { CheckinInputs } from "@/components/forms/CheckinInputs";
import { CheckoutInputs } from "@/components/forms/CheckoutInputs";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { StatusIndicator } from "@/components/StatusIndicator";
import { WeeklyDots } from "@/components/WeeklyDots";
import type { WorkItem } from "@/types/checkIn";

import { formatDisplayDate, formatTime } from "@/lib/date";
import { computeStreak, weeklyCompletionCount } from "@/lib/stats";
import { useZustandStore } from "@/store/useZustandStore";

// Types
type FormState = {
  projectName: string;
  goal: string;
  note: string;
  works: WorkItem[];
};

type ModalState = {
  selectedDate: string | null;
  editType: "morning" | "evening" | null;
};

export const HistoryScreen = () => {
  const entries = useZustandStore((state) => state.entries);
  const saveMorning = useZustandStore((state) => state.saveCheckIn);
  const saveEvening = useZustandStore((state) => state.saveCheckOut);

  // Today's date string
  const todayObj = new Date();
  const todayDate = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const [activeDate, setActiveDate] = useState(todayDate);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Object state
  const [form, setForm] = useState<FormState>({
    projectName: "",
    goal: "",
    note: "",
    works: [{ text: "", status: "completed" }],
  });

  const [modal, setModal] = useState<ModalState>({
    selectedDate: null,
    editType: null,
  });

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (date: string, type: "morning" | "evening") => {
    setModal({ selectedDate: date, editType: type });
  };

  const closeModal = () => {
    setModal({ selectedDate: null, editType: null });
  };

  useFocusEffect(
    useCallback(() => {
      const dates = [];
      const base = new Date();
      for (let i = -30; i <= 14; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        dates.push(`${yyyy}-${mm}-${dd}`);
      }
      setCalendarDates(dates);
      setActiveDate(todayDate);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 26.2,
          animated: true,
          viewPosition: 0.5,
        });
      }, 200);
    }, [todayDate]),
  );

  const getItemLayout = (data: any, index: number) => ({
    length: 76,
    offset: 76 * index,
    index,
  });

  const dates = Object.keys(entries).sort((a, b) => b.localeCompare(a));
  const streak = computeStreak(entries);
  const weekDone = weeklyCompletionCount(entries, 7);

  // Load data when editing
  useEffect(() => {
    if (!modal.selectedDate || !modal.editType) return;
    const record = entries[modal.selectedDate];
    if (modal.editType === "morning") {
      updateForm("projectName", record?.morning?.projectName || "");
      updateForm("goal", record?.morning?.goal || "");
      updateForm("note", record?.morning?.note || "");
    } else {
      if (record?.evening?.works && record.evening.works.length > 0) {
        updateForm("works", record.evening.works);
      } else if (record?.evening?.workCompleted) {
        updateForm("works", [
          {
            text: record.evening.workCompleted,
            status: record.evening.status || "completed",
          },
        ]);
      } else {
        updateForm("works", [{ text: "", status: "completed" }]);
      }
    }
  }, [modal.selectedDate, modal.editType]);

  const handleSave = () => {
    if (!modal.selectedDate || !modal.editType || modal.selectedDate !== todayDate) return;
    if (modal.editType === "morning") {
      if (form.projectName.trim() === "" || form.goal.trim() === "") {
        Alert.alert("Error", "Enter project and goal");
        return;
      }
      saveMorning(modal.selectedDate, {
        projectName: form.projectName.trim(),
        goal: form.goal.trim(),
        note: form.note.trim(),
      });
    } else {
      const validWorks = form.works.filter((w) => w.text.trim() !== "");
      if (validWorks.length === 0) {
        Alert.alert("Error", "Enter at least one work completed");
        return;
      }
      saveEvening(modal.selectedDate, {
        works: validWorks.map((w) => ({
          text: w.text.trim(),
          status: w.status,
        })),
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeModal();
  };

  const work = entries[activeDate];
  const isTodaySelected = activeDate === todayDate;

  return (
    <ScreenContainer title="History" subtitle="Your entries by date">

      {/* Calendar strip */}
      <View className="mb-5 border-b border-ink-200 dark:border-ink-800 pb-2">
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={calendarDates}
          keyExtractor={(item) => item}
          getItemLayout={getItemLayout}
          renderItem={({ item: dateStr }) => {
            const day = new Date(dateStr);
            const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()];
            const dayNum = day.getDate();
            const isSelected = dateStr === activeDate;
            const isToday = dateStr === todayDate;

            return (
              <Pressable
                onPress={() => {
                  setActiveDate(dateStr);
                  Haptics.selectionAsync();
                }}
                style={isSelected ? { backgroundColor: "#c45c3e" } : {}}
                className={`items-center justify-center rounded-2xl p-2 mx-1.5 w-16 h-20 border ${
                  isSelected
                    ? "border-clay"
                    : isToday
                      ? "border-clay bg-white dark:bg-ink-900"
                      : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-clay dark:text-clay-muted"
                        : "text-ink-500 dark:text-ink-400"
                  }`}
                >
                  {dayName}
                </Text>
                <Text
                  className={`text-lg font-bold mt-1 ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-clay dark:text-clay-muted"
                        : "text-ink-900 dark:text-ink-100"
                  }`}
                >
                  {dayNum}
                </Text>
                {isToday && (
                  <View
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? "bg-white" : "bg-clay dark:bg-clay-muted"
                    }`}
                  />
                )}
              </Pressable>
            );
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Selected date data */}
        <View className="mb-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg mb-4 text-ink-900 dark:text-ink-50">
            {formatDisplayDate(activeDate)} {isTodaySelected && (
              <Text className="text-clay dark:text-clay-muted text-sm font-semibold">(Today)</Text>
            )}
          </Text>

          {/* Check-in card */}
          <View className="mb-4 bg-ink-50 dark:bg-ink-800 p-4 rounded-xl border border-ink-100 dark:border-ink-700">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">
                Check In
              </Text>
              {work?.morning ? (
                <Pressable onPress={() => openModal(activeDate, "morning")}>
                  <Text className="text-clay dark:text-clay-muted font-semibold">
                    {isTodaySelected ? "Edit" : "View"}
                  </Text>
                </Pressable>
              ) : (
                isTodaySelected && (
                  <Pressable onPress={() => openModal(activeDate, "morning")}>
                    <Text className="text-clay dark:text-clay-muted font-semibold">Add</Text>
                  </Pressable>
                )
              )}
            </View>

            {work?.morning ? (
              <View>
                <Text className="font-semibold text-ink-900 dark:text-ink-50 text-base mb-1">
                  {work.morning.projectName}
                </Text>
                <Text className="text-ink-600 dark:text-ink-300 leading-5 mb-2">
                  {work.morning.goal}
                </Text>
                <Text className="text-xs text-ink-400 dark:text-ink-500 font-medium">
                  {formatTime(work.morning.checkedInAt)}
                </Text>
              </View>
            ) : (
              <Text className="text-ink-400 dark:text-ink-500 text-sm">No check-in data</Text>
            )}
          </View>

          {/* Check-out card */}
          <View className="bg-ink-50 dark:bg-ink-800 p-4 rounded-xl border border-ink-100 dark:border-ink-700 mb-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">
                Check Out
              </Text>
              {work?.evening ? (
                <Pressable onPress={() => openModal(activeDate, "evening")}>
                  <Text className="text-clay dark:text-clay-muted font-semibold">
                    {isTodaySelected ? "Edit" : "View"}
                  </Text>
                </Pressable>
              ) : (
                isTodaySelected && (
                  <Pressable onPress={() => openModal(activeDate, "evening")}>
                    <Text className="text-clay dark:text-clay-muted font-semibold">Add</Text>
                  </Pressable>
                )
              )}
            </View>

            {work?.evening ? (
              <View>
                {work.evening.works && work.evening.works.length > 0 ? (
                  work.evening.works.map((w, idx) => (
                    <View
                      key={idx}
                      className="flex-row justify-between items-start mb-2 mt-1"
                    >
                      <Text className="text-ink-700 dark:text-ink-200 leading-5 flex-1 pr-2">
                        {w.text}
                      </Text>
                      <View className="ml-2">
                        <StatusIndicator status={w.status} />
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="flex-row justify-between items-start mb-2 mt-1">
                    <Text className="text-ink-700 dark:text-ink-200 leading-5 flex-1 pr-2">
                      {work.evening.workCompleted}
                    </Text>
                    <View className="ml-2">
                      <StatusIndicator status={work.evening.status || "completed"} />
                    </View>
                  </View>
                )}
                <Text className="text-xs text-ink-400 dark:text-ink-500 font-medium mt-1">
                  {formatTime(work.evening.checkedOutAt)}
                </Text>
              </View>
            ) : (
              <Text className="text-ink-400 dark:text-ink-500 text-sm">No check-out data</Text>
            )}
          </View>
        </View>

        {/* Stats section */}
        <View className="mb-8 mt-2 p-4 border border-ink-200 dark:border-ink-700 rounded-2xl bg-white dark:bg-ink-900 shadow-sm">
          <Text className="font-bold text-ink-900 dark:text-ink-50 mb-4 text-lg">
            Your Progress
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-ink-600 dark:text-ink-300">Current Streak</Text>
            <Text className="font-semibold text-clay dark:text-clay-muted">
              🔥 {streak} days
            </Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-ink-600 dark:text-ink-300">Total Check-Ins</Text>
            <Text className="font-semibold text-ink-800 dark:text-ink-100">
              {dates.length} days
            </Text>
          </View>
          <WeeklyDots total={7} filled={weekDone} />
        </View>
      </ScrollView>

      {/* Edit / View Modal */}
      <Modal visible={modal.selectedDate !== null} animationType="slide">
        <View className="flex-1 px-5 pt-12 pb-5 bg-paper dark:bg-ink-950">

          {/* Modal header */}
          <View
            style={{ backgroundColor: "#c45c3e" }}
            className="rounded-2xl px-5 py-4 mb-6 flex-row items-center"
          >
            <Text className="text-white text-xl font-bold flex-1">
              {modal.selectedDate === todayDate
                ? modal.editType === "morning"
                  ? "Edit Check-in"
                  : "Edit Check-out"
                : modal.editType === "morning"
                  ? "View Check-in"
                  : "View Check-out"}
            </Text>
            <Text className="text-white/70 text-sm">
              {modal.selectedDate ? formatDisplayDate(modal.selectedDate) : ""}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {modal.editType === "morning" && (
              <View pointerEvents={modal.selectedDate === todayDate ? "auto" : "none"}>
                <CheckinInputs
                  projectName={form.projectName}
                  onProjectNameChange={(val) => updateForm("projectName", val)}
                  goal={form.goal}
                  onGoalChange={(val) => updateForm("goal", val)}
                  note={form.note}
                  onNoteChange={(val) => updateForm("note", val)}
                />
              </View>
            )}

            {modal.editType === "evening" && (
              <View>
                {modal.selectedDate === todayDate ? (
                  <CheckoutInputs
                    works={form.works}
                    onWorksChange={(val) => updateForm("works", val)}
                  />
                ) : (
                  <View className="bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl p-4">
                    {form.works.map((w, index) => (
                      <View
                        key={index}
                        className="flex-row justify-between items-start mb-3 border-b border-ink-100 dark:border-ink-700 pb-3"
                      >
                        <Text className="text-ink-800 dark:text-ink-100 flex-1 pr-3">
                          {w.text}
                        </Text>
                        <StatusIndicator status={w.status} />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <View className="mt-8">
              {modal.selectedDate === todayDate && (
                <PrimaryButton label="Save Changes" onPress={handleSave} />
              )}
            </View>

            <Pressable
              onPress={closeModal}
              className="mt-4 py-4 rounded-xl items-center border border-ink-200 dark:border-ink-700"
            >
              <Text className="text-base font-semibold text-ink-500 dark:text-ink-400">
                {modal.selectedDate === todayDate ? "Cancel" : "Close"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
};
