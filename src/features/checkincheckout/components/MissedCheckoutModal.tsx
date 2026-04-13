import { CheckoutInputs } from "@/features/checkincheckout/components/CheckOutForm";
import type { WorkItem } from "@/features/checkincheckout/types/Checkinout";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { formatDisplayDate } from "@/shared/utils/date";
import { getYesterday } from "@/shared/utils/missedCheckout";
import { useZustandStore } from "@/store/useZustandStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export const MissedCheckoutModal = ({ visible, onDismiss }: Props) => {
  const yesterday = getYesterday();
  const { saveCheckOut } = useZustandStore();

  const [step, setStep] = useState<"alert" | "form">("alert");

  const [works, setWorks] = useState<WorkItem[]>([
    { text: "", status: "completed" },
  ]);

  const handleSubmit = () => {
    const validWorks = works.filter((w) => w.text.trim() !== "");

    if (validWorks.length === 0) {
      Alert.alert("Required", "Please enter at least one work item.");
      return;
    }

    Alert.alert(
      "Confirm Checkout",
      `Submit checkout for ${formatDisplayDate(yesterday)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          style: "default",
          // handle checkout for yesterday
          onPress: () => {
            saveCheckOut(yesterday, { works: validWorks });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDismiss();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-ink-900 rounded-t-3xl max-h-[90%]">
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-ink-200 dark:bg-ink-700 rounded-full" />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          >
            {step === "alert" ? (
              <View>
                <View className="items-center mb-4">
                  <View className="w-16 h-16 rounded-full bg-orange-100 dark:bg-clay/20 items-center justify-center">
                    <Ionicons name="alert-circle" size={32} color="#c45c3e" />
                  </View>
                </View>

                <Text className="text-xl font-bold text-ink-900 dark:text-ink-50 text-center mb-2">
                  Missed Checkout!
                </Text>

                <Text className="text-sm text-ink-500 dark:text-ink-400 text-center mb-6">
                  You didn't check out yesterday{"\n"}
                  <Text className="font-semibold text-clay">
                    {formatDisplayDate(yesterday)}
                  </Text>
                  {"\n"}What would you like to do?
                </Text>

                <PrimaryButton
                  label="Check Out Yesterday"
                  onPress={() => setStep("form")}
                />

                <View className="mt-3">
                  <PrimaryButton
                    label="Continue Today"
                    variant="outline"
                    onPress={onDismiss}
                  />
                </View>
              </View>
            ) : (
              <View>
                <View className="flex-row items-center mb-4">
                  <Pressable
                    onPress={() => setStep("alert")}
                    className="mr-3 w-9 h-9 rounded-full bg-ink-100 dark:bg-ink-800 items-center justify-center"
                  >
                    <Ionicons name="arrow-back" size={18} color="#6b7280" />
                  </Pressable>

                  <View className="flex-1">
                    <Text className="text-lg font-bold text-ink-900 dark:text-ink-50">
                      Yesterday's Checkout
                    </Text>
                    <Text className="text-xs text-ink-400 dark:text-ink-500">
                      {formatDisplayDate(yesterday)}
                    </Text>
                  </View>
                </View>

                <CheckoutInputs works={works} onWorksChange={setWorks} />

                <View className="mt-5">
                  <PrimaryButton
                    label="Submit Check-Out"
                    onPress={handleSubmit}
                  />
                </View>

                <View className="mt-3">
                  <PrimaryButton
                    label="Cancel"
                    variant="outline"
                    onPress={onDismiss}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
