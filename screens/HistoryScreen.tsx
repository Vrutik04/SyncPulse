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

export const HistoryScreen = () => {
  const entries = useZustandStore((state) => state.entries);
  const saveMorning = useZustandStore((state) => state.saveCheckIn);
  const saveEvening = useZustandStore((state) => state.saveCheckOut);

  // Today's Date String
  const todayObj = new Date();
  const todayDate = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const [activeDate, setActiveDate] = useState(todayDate);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      // show dates: 30 days past to 14 days future
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

  // Edit state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editType, setEditType] = useState<"morning" | "evening" | null>(null);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");
  const [works, setWorks] = useState<WorkItem[]>([
    { text: "", status: "completed" },
  ]);

  // Load data when editing
  useEffect(() => {
    if (!selectedDate || !editType) return;

    const record = entries[selectedDate];

    if (editType === "morning") {
      setProjectName(record?.morning?.projectName || "");
      setGoal(record?.morning?.goal || "");
      setNote(record?.morning?.note || "");
    } else {
      if (record?.evening?.works && record.evening.works.length > 0) {
        setWorks(record.evening.works);
      } else if (record?.evening?.workCompleted) {
        setWorks([
          {
            text: record.evening.workCompleted,
            status: record.evening.status || "completed",
          },
        ]);
      } else {
        setWorks([{ text: "", status: "completed" }]);
      }
    }
  }, [selectedDate, editType]);

  const closeModal = () => {
    setSelectedDate(null);
    setEditType(null);
  };

  const handleSave = () => {
    if (!selectedDate || !editType || selectedDate !== todayDate) return;

    if (editType === "morning") {
      if (projectName.trim() === "" || goal.trim() === "") {
        Alert.alert("Error", "Enter project and goal");
        return;
      }
      saveMorning(selectedDate, {
        projectName: projectName.trim(),
        goal: goal.trim(),
        note: note.trim(),
      });
    } else {
      const validWorks = works.filter((w) => w.text.trim() !== "");
      if (validWorks.length === 0) {
        Alert.alert("Error", "Enter at least one work completed");
        return;
      }
      saveEvening(selectedDate, {
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
      {/* Calendar */}
      <View className="mb-5 border-b border-gray-200 pb-2">
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={calendarDates}
          keyExtractor={(item) => item}
          getItemLayout={getItemLayout}
          renderItem={({ item: dateStr }) => {
            const day = new Date(dateStr);
            const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
              day.getDay()
            ];
            const dayNum = day.getDate();
            const isSelected = dateStr === activeDate;
            const isToday = dateStr === todayDate;

            return (
              <Pressable
                onPress={() => {
                  setActiveDate(dateStr);
                  Haptics.selectionAsync();
                }}
                className={`items-center justify-center rounded-2xl p-2 mx-1.5 w-16 h-20 border ${
                  isSelected
                    ? "border-[#c45c3e] bg-[#fbede8]"
                    : isToday
                      ? "border-[#c45c3e] bg-white opacity-90"
                      : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`text-xs ${isSelected || isToday ? "text-[#c45c3e] font-bold" : "text-gray-500"}`}
                >
                  {dayName}
                </Text>
                <Text
                  className={`text-lg font-bold mt-1 ${isSelected || isToday ? "text-[#c45c3e]" : "text-gray-900"}`}
                >
                  {dayNum}
                </Text>
                {isToday && (
                  <View className="w-1.5 h-1.5 rounded-full mt-1 bg-[#c45c3e]" />
                )}
              </Pressable>
            );
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Selected Date's Data */}
        <View className="mb-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <Text className="font-bold text-lg mb-4 text-gray-800">
            {formatDisplayDate(activeDate)} {isTodaySelected && "(Today)"}
          </Text>

          {/* Check-in Card */}
          <View className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Check In
              </Text>
              {work?.morning ? (
                <Pressable
                  onPress={() => {
                    setSelectedDate(activeDate);
                    setEditType("morning");
                  }}
                >
                  <Text className="text-[#c45c3e] font-semibold">
                    {isTodaySelected ? "Edit" : "View"}
                  </Text>
                </Pressable>
              ) : (
                isTodaySelected && (
                  <Pressable
                    onPress={() => {
                      setSelectedDate(activeDate);
                      setEditType("morning");
                    }}
                  >
                    <Text className="text-[#c45c3e] font-semibold">Add</Text>
                  </Pressable>
                )
              )}
            </View>

            {work?.morning ? (
              <View>
                <Text className="font-semibold text-gray-900 text-lg mb-1">
                  {work.morning.projectName}
                </Text>
                <Text className="text-gray-700 leading-5 mb-2">
                  {work.morning.goal}
                </Text>
                <Text className="text-xs text-gray-400 font-medium">
                  {formatTime(work.morning.checkedInAt)}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-400 text-sm">No check-in data</Text>
            )}
          </View>

          {/* Check-out Card */}
          <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Check Out
              </Text>
              {work?.evening ? (
                <Pressable
                  onPress={() => {
                    setSelectedDate(activeDate);
                    setEditType("evening");
                  }}
                >
                  <Text className="text-[#c45c3e] font-semibold">
                    {isTodaySelected ? "Edit" : "View"}
                  </Text>
                </Pressable>
              ) : (
                isTodaySelected && (
                  <Pressable
                    onPress={() => {
                      setSelectedDate(activeDate);
                      setEditType("evening");
                    }}
                  >
                    <Text className="text-[#c45c3e] font-semibold">Add</Text>
                  </Pressable>
                )
              )}
            </View>

            {work?.evening ? (
              <View>
                {work.evening.works && work.evening.works.length > 0 ? (
                  work.evening.works.map((work, idx) => (
                    <View
                      key={idx}
                      className="flex-row justify-between items-start mb-2 mt-1"
                    >
                      <Text className="text-gray-700 leading-5 flex-1 pr-2">
                        {work.text}
                      </Text>
                      <View className="ml-2">
                        <StatusIndicator status={work.status} />
                      </View>
                    </View>
                  ))
                ) : (
                  <View className="flex-row justify-between items-start mb-2 mt-1">
                    <Text className="text-gray-700 leading-5 flex-1 pr-2">
                      {work.evening.workCompleted}
                    </Text>
                    <View className="ml-2">
                      <StatusIndicator
                        status={work.evening.status || "completed"}
                      />
                    </View>
                  </View>
                )}
                <Text className="text-xs text-gray-400 font-medium">
                  {formatTime(work.evening.checkedOutAt)}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-400 text-sm">No check-out data</Text>
            )}
          </View>
        </View>

        {/* Stats Section moved to bottom */}
        <View className="mb-8 mt-2 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <Text className="font-bold text-gray-800 mb-3 text-lg">
            Your Progress
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Current Streak</Text>
            <Text className="font-semibold text-gray-800">{streak} days</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600">Total Check-Ins</Text>
            <Text className="font-semibold text-gray-800">
              {dates.length} days
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mb-2">
            This Week: {weekDone} / 7
          </Text>
          <WeeklyDots total={7} filled={weekDone} />
        </View>
      </ScrollView>

      {/* Edit/View Modal */}
      <Modal visible={selectedDate !== null} animationType="slide">
        <View className="flex-1 px-5 pt-12 pb-5 bg-white">
          <Text className="text-2xl font-bold mb-6 text-gray-800">
            {selectedDate === todayDate
              ? editType === "morning"
                ? "Edit Tasks"
                : "Edit Task"
              : editType === "morning"
                ? "View Tasks"
                : "View Tasks"}
          </Text>

          {editType === "morning" && (
            <View pointerEvents={selectedDate === todayDate ? "auto" : "none"}>
              <CheckinInputs
                projectName={projectName}
                onProjectNameChange={setProjectName}
                goal={goal}
                onGoalChange={setGoal}
                note={note}
                onNoteChange={setNote}
              />
            </View>
          )}

          {editType === "evening" && (
            <View>
              {selectedDate === todayDate ? (
                <CheckoutInputs works={works} onWorksChange={setWorks} />
              ) : (
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  {works.map((work, index) => (
                    <View
                      key={index}
                      className="flex-row justify-between items-start mb-3 border-b border-gray-100 pb-3"
                    >
                      <Text className="text-gray-800 flex-1 pr-3">
                        {work.text}
                      </Text>
                      <StatusIndicator status={work.status} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View className="mt-8">
            {selectedDate === todayDate && (
              <PrimaryButton label="Save Changes" onPress={handleSave} />
            )}
          </View>

          <Pressable
            onPress={closeModal}
            className="mt-4 py-4 rounded-xl items-center"
          >
            <Text className="text-base font-semibold text-gray-500">
              {selectedDate === todayDate ? "Cancel" : "Close"}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </ScreenContainer>
  );
};
