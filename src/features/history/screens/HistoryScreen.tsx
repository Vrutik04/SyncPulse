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

import { useAuthStore } from "@/features/auth/store/AuthStore";
import { CheckinInputs } from "@/features/check-in-out/components/CheckInForm";
import { CheckoutInputs } from "@/features/check-in-out/components/CheckOutForm";
import type { WorkItem } from "@/features/check-in-out/types/Checkinout";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { ScreenContainer } from "@/shared/components/ScreenContainer";
import { StatusIndicator } from "@/shared/components/StatusIndicator";
import { WeeklyDots } from "@/shared/components/WeeklyDots";
import { formatDisplayDate, formatTime } from "@/shared/utils/date";
import { computeStreak, weeklyCompletionCount } from "@/shared/utils/progress";
import { useCheckinStore } from "@/features/check-in-out/store/useCheckinStore";
import { Ionicons } from "@expo/vector-icons";

// Types
type FormState = {
  projectName: string;
  task: string;
  note: string;
  works: WorkItem[];
};

type ModalState = {
  selectedDate: string | null;
  editType: "Checkin" | "Checkout" | null;
};

export const HistoryScreen = () => {
  const entries = useCheckinStore((state) => state.entries);
  const saveCheckin = useCheckinStore((state) => state.saveCheckIn);
  const saveCheckout = useCheckinStore((state) => state.saveCheckOut);
  const authUser = useAuthStore((state) => state.authUser);

  // Today's date string
  const todayObj = new Date();
  const todayDate = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const [activeDate, setActiveDate] = useState(todayDate);
  const [showCheckinTask, setShowCheckinTask] = useState(false);
  const [showCheckoutTasks, setShowCheckoutTasks] = useState(false);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const flatListRef = useRef<FlatList<string>>(null);

  // Object state
  const [form, setForm] = useState<FormState>({
    projectName: "",
    task: "",
    note: "",
    works: [{ text: "", status: "completed" }],
  });

  const updateForm = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const [modal, setModal] = useState<ModalState>({
    selectedDate: null,
    editType: null,
  });

  const openModal = (date: string, type: "Checkin" | "Checkout") => {
    setModal({ selectedDate: date, editType: type });
  };

  const closeModal = () => {
    setModal({ selectedDate: null, editType: null });
  };

  useFocusEffect(
    useCallback(() => {
      const datesList = [];
      const base = new Date();
      for (let i = -30; i <= 14; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        datesList.push(`${yyyy}-${mm}-${dd}`);
      }
      setCalendarDates(datesList);
      setActiveDate(todayDate);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 29.4,
          animated: true,
          viewPosition: 0.5,
        });
      }, 200);
    }, [todayDate]),
  );

  const getItemLayout = (
    _data: ArrayLike<string> | null | undefined,
    index: number,
  ) => ({
    length: 68, // 56 width + 12 margin (mx-1.5 is 6px each side)
    offset: 68 * index,
    index,
  });

  const dates = Object.keys(entries).sort((a, b) => b.localeCompare(a));
  const streak = computeStreak(entries);
  const weekDone = weeklyCompletionCount(entries, 7);

  // Load data when editing
  useEffect(() => {
    if (!modal.selectedDate || !modal.editType) return;
    const record = entries[modal.selectedDate];
    if (modal.editType === "Checkin") {
      updateForm("projectName", record?.Checkin?.projectName || "");
      updateForm("task", record?.Checkin?.task || "");
      updateForm("note", record?.Checkin?.note || "");
    } else {
      if (record?.Checkout?.works && record.Checkout.works.length > 0) {
        updateForm("works", record.Checkout.works);
      } else if (record?.Checkout?.workCompleted) {
        updateForm("works", [
          {
            text: record.Checkout.workCompleted,
            status: record.Checkout.status || "completed",
          },
        ]);
      } else {
        updateForm("works", [{ text: "", status: "completed" }]);
      }
    }
  }, [modal.selectedDate, modal.editType]);

  const handleSave = async () => {
    if (
      !modal.selectedDate ||
      !modal.editType ||
      modal.selectedDate !== todayDate ||
      !authUser
    )
      return;
    if (modal.editType === "Checkin") {
      if (form.projectName.trim() === "" || form.task.trim() === "") {
        Alert.alert("Error", "Enter project and task");
        return;
      }
      await saveCheckin(authUser.uid, modal.selectedDate, {
        projectName: form.projectName.trim(),
        task: form.task.trim(),
        note: form.note.trim(),
      });
    } else {
      const validWorks = form.works.filter((w) => w.text.trim() !== "");
      if (validWorks.length === 0) {
        Alert.alert("Error", "Enter at least one work completed");
        return;
      }
      await saveCheckout(authUser.uid, modal.selectedDate, {
        works: validWorks.map((w) => ({
          text: w.text.trim(),
          status: w.status,
        })),
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", "Task updated!");
    closeModal();
  };

  const work = entries[activeDate];
  const isTodaySelected = activeDate === todayDate;

  return (
    <ScreenContainer title="History" subtitle="Your entries by date">
      {/* Calendar  */}
      <View className="mb-4 border-b border-ink-100 dark:border-ink-800 pb-3 pt-1">
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={calendarDates}
          keyExtractor={(item) => item}
          getItemLayout={getItemLayout}
          contentContainerStyle={{ paddingHorizontal: 4 }}
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
                  setShowCheckinTask(false);
                  setShowCheckoutTasks(false);
                  Haptics.selectionAsync();
                }}
                className={`items-center justify-center rounded-[16px] p-2 mx-1.5 w-[56px] h-[72px] shadow-sm ${
                  isSelected
                    ? "bg-clay border border-clay"
                    : isToday
                      ? "bg-orange-50 dark:bg-clay/20 border border-clay/30"
                      : "bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800"
                }`}
              >
                <Text
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? "text-white/90"
                      : isToday
                        ? "text-clay dark:text-clay-muted"
                        : "text-ink-400 dark:text-ink-500"
                  }`}
                >
                  {dayName}
                </Text>
                <Text
                  className={`text-lg font-extrabold mt-0.5 ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-clay dark:text-clay-muted"
                        : "text-ink-900 dark:text-ink-50"
                  }`}
                >
                  {dayNum}
                </Text>
                {isToday && (
                  <View
                    className={`w-1 h-1 rounded-full mt-1 ${
                      isSelected ? "bg-white" : "bg-clay dark:bg-clay-muted"
                    }`}
                  />
                )}
              </Pressable>
            );
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 4 }}>
        {/* Selected date header */}
        <View className="mb-4 flex-row items-center justify-between px-1">
          <Text className="font-extrabold text-xl text-clay muted dark:text-ink-50 tracking-tight">
            {formatDisplayDate(activeDate)}
          </Text>
          {isTodaySelected && (
            <View className="bg-clay/10 dark:bg-clay/20 px-2.5 py-1 rounded-full border border-clay/20 dark:border-clay/30">
              <Text className="text-clay dark:text-clay-muted text-[10px] font-bold uppercase tracking-widest">
                Today
              </Text>
            </View>
          )}
        </View>

        {/* Check-in card */}
        <View className="mb-4 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="h-7 w-7 rounded-full bg-orange-50 dark:bg-clay/10 items-center justify-center mr-2.5">
                <Ionicons name="sunny-outline" size={14} color="#c45c3e" />
              </View>
              <Text className="text-sm font-bold text-ink-900 dark:text-ink-50 uppercase tracking-widest">
                Check In
              </Text>
            </View>
            {work?.Checkin ? (
              <Pressable onPress={() => openModal(activeDate, "Checkin")} className="bg-ink-50 dark:bg-ink-800 px-3 py-1.5 rounded-full active:opacity-70">
                <Text className="text-ink-700 dark:text-ink-300 font-bold text-[10px] uppercase tracking-wider">
                  {isTodaySelected ? "Edit" : "View"}
                </Text>
              </Pressable>
            ) : (
              isTodaySelected && (
                <Pressable onPress={() => openModal(activeDate, "Checkin")} className="bg-clay/10 px-3 py-1.5 rounded-full active:opacity-70">
                  <Text className="text-clay dark:text-clay-muted font-bold text-[10px] uppercase tracking-wider">
                    Add
                  </Text>
                </Pressable>
              )
            )}
          </View>

          {work?.Checkin ? (
            <View className="ml-[14px] border-l-2 border-ink-100 dark:border-ink-800 pl-4 py-1">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-xs font-semibold text dark:text-ink-50">
                  {work.Checkin.checkInTime || formatTime(work.Checkin.checkedInAt)}
                </Text>
                
                </View>
                <Pressable onPress={() => setShowCheckinTask(!showCheckinTask)}>
                  <Text className="text-orange-700 dark:text-orange-400 font-medium text-xs">
                    {showCheckinTask ? "Hide Tasks" : "View Tasks"}
                  </Text>
                </Pressable>
              </View>

              {showCheckinTask && (
                <View className="bg-ink-50 dark:bg-ink-800 rounded-xl p-3 border border-ink-100 dark:border-ink-700 mt-2">
                  <Text className="font-bold text-ink-900 dark:text-ink-50 text-sm mb-1">
                    {work.Checkin.projectName}
                  </Text>
                  <Text className="text-ink-500 dark:text-ink-400 text-xs leading-4">
                    {work.Checkin.task}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text className="text-ink-400 dark:text-ink-500 text-xs italic ml-[14px] pl-4 py-1 border-l-2 border-ink-100 dark:border-ink-800">
              No check-in record for this day.
            </Text>
          )}
        </View>

        {/* Check-out card */}
        <View className="mb-6 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="h-7 w-7 rounded-full bg-ink-50 dark:bg-ink-800 items-center justify-center mr-2.5">
                <Ionicons name="moon-outline" size={14} color="#6b7280" />
              </View>
              <Text className="text-sm font-bold text-ink-900 dark:text-ink-50 uppercase tracking-widest">
                Check Out
              </Text>
            </View>
            {work?.Checkout ? (
              <Pressable onPress={() => openModal(activeDate, "Checkout")} className="bg-ink-50 dark:bg-ink-800 px-3 py-1.5 rounded-full active:opacity-70">
                <Text className="text-ink-700 dark:text-ink-300 font-bold text-[10px] uppercase tracking-wider">
                  {isTodaySelected ? "Edit" : "View"}
                </Text>
              </Pressable>
            ) : (
              isTodaySelected && (
                <Pressable onPress={() => openModal(activeDate, "Checkout")} className="bg-clay/10 px-3 py-1.5 rounded-full active:opacity-70">
                  <Text className="text-clay dark:text-clay-muted font-bold text-[10px] uppercase tracking-wider">
                    Add
                  </Text>
                </Pressable>
              )
            )}
          </View>

          {work?.Checkout ? (
            <View className="ml-[14px] border-l-2 border-transparent pl-4 py-1">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="text-xs font-semibold text dark:text-ink-50">
                  {work.Checkout.checkOutTime || formatTime(work.Checkout.checkedOutAt)}
                </Text>
                </View>
                <Pressable onPress={() => setShowCheckoutTasks(!showCheckoutTasks)}>
                  <Text className="text-orange-700 dark:text-orange-400 font-medium text-xs">
                    {showCheckoutTasks ? "Hide Tasks" : "View Tasks"}
                  </Text>
                </Pressable>
              </View>

              {showCheckoutTasks && (
                <View className="bg-ink-50 dark:bg-ink-800 rounded-xl p-3 border border-ink-100 dark:border-ink-700 mt-2">
                  <FlatList
                    data={work.Checkout.works && work.Checkout.works.length > 0 
                      ? work.Checkout.works 
                      : (work.Checkout.workCompleted ? [{ text: work.Checkout.workCompleted as string, status: work.Checkout.status || "completed" }] : [])}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <View className="flex-row justify-between items-start mb-2 border-b border-ink-100 dark:border-ink-700/50 pb-2 last:border-0 last:mb-0 last:pb-0">
                        <Text className="text-ink-700 dark:text-ink-200 text-xs leading-4 flex-1 pr-2">
                          {item.text}
                        </Text>
                        <View className="ml-2">
                          <StatusIndicator status={item.status || "completed"} />
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          ) : (
            <Text className="text-ink-400 dark:text-ink-500 text-xs italic ml-[14px] pl-4 py-1">
              No check-out record for this day.
            </Text>
          )}
        </View>

        {/* Stats section */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-ink-900 dark:text-ink-50 mb-3 px-2 uppercase tracking-wider">
            Your Progress
          </Text>
          <View className="flex-row gap-3 mb-3">
            {/* Streak */}
            <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm items-center">
              <View className="h-8 w-8 rounded-full bg-orange-50 dark:bg-clay/10 items-center justify-center mb-2">
                <Ionicons name="flame" size={16} color="#c45c3e" />
              </View>
              <Text className="text-xl font-black text-ink-900 dark:text-ink-50 mb-0.5">
                {streak}
              </Text>
              <Text className="text-[10px] font-semibold text-ink-500 dark:text-ink-400 tracking-wide uppercase">
                Day Streak
              </Text>
            </View>

            {/* Total Checkins */}
            <View className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm items-center">
              <View className="h-8 w-8 rounded-full bg-ink-50 dark:bg-ink-800 items-center justify-center mb-2 border border-ink-100 dark:border-ink-700">
                <Ionicons name="calendar-outline" size={16} color="#606882" />
              </View>
              <Text className="text-xl font-black text-ink-900 dark:text-ink-50 mb-0.5">
                {dates.length}
              </Text>
              <Text className="text-[10px] font-semibold text-ink-500 dark:text-ink-400 tracking-wide uppercase">
                Check-Ins
              </Text>
            </View>
          </View>
          
          <View className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 shadow-sm items-center">
            <Text className="text-xs font-bold text-ink-900 dark:text-ink-50 mb-2">Weekly Completion</Text>
            <WeeklyDots total={5} filled={weekDone} />
          </View>
        </View>
      </ScrollView>

      {/* Edit / View Modal */}
      <Modal
        visible={modal.selectedDate !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-ink-900 rounded-t-[28px] p-5 h-[85%] shadow-2xl">
            {/* Handle bar */}
            <View className="items-center mb-4">
              <View className="h-1.5 w-10 bg-ink-200 dark:bg-ink-700 rounded-full" />
            </View>

            {/* Modal header */}
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-extrabold text-ink-900 dark:text-ink-50 tracking-tight">
                {modal.selectedDate === todayDate
                  ? modal.editType === "Checkin"
                    ? "Edit Check-in"
                    : "Edit Check-out"
                  : modal.editType === "Checkin"
                    ? "View Check-in"
                    : "View Check-out"}
              </Text>
              <Pressable
                onPress={closeModal}
                className="w-8 h-8 items-center justify-center rounded-full bg-ink-50 dark:bg-ink-800 active:bg-ink-100 dark:active:bg-ink-700"
              >
                <Ionicons name="close" size={20} color="#a8aebc" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {modal.editType === "Checkin" && (
                <View
                  pointerEvents={
                    modal.selectedDate === todayDate ? "auto" : "none"
                  }
                >
                  <CheckinInputs
                    projectName={form.projectName}
                    onProjectNameChange={(val) =>
                      updateForm("projectName", val)
                    }
                    task={form.task}
                    ontaskChange={(val) => updateForm("task", val)}
                    note={form.note}
                    onNoteChange={(val) => updateForm("note", val)}
                  />
                </View>
              )}

              {modal.editType === "Checkout" && (
                <View>
                  {modal.selectedDate === todayDate ? (
                    <CheckoutInputs
                      works={form.works}
                      onWorksChange={(val) => updateForm("works", val)}
                    />
                  ) : (
                    <View className="bg-ink-50 dark:bg-ink-800 border border-ink-100 dark:border-ink-800 rounded-xl p-3 mt-2">
                      {form.works.map((w, index) => (
                        <View
                          key={index}
                          className="flex-row justify-between items-start mb-2 border-b border-ink-100 dark:border-ink-700 pb-2 last:border-0 last:pb-0 last:mb-0"
                        >
                          <Text className="text-ink-800 dark:text-ink-100 flex-1 pr-3 font-medium text-sm">
                            {w.text}
                          </Text>
                          <StatusIndicator status={w.status} />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              <View className="mt-6">
                {modal.selectedDate === todayDate && (
                  <PrimaryButton label="Save Changes" onPress={handleSave} />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};
