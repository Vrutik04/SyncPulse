import type { CheckoutStatus, WorkItem } from "@/features/checkincheckout/types/Checkinout";
import { Pressable, Text, TextInput, View } from "react-native";

type CheckoutInputs = {
  works: WorkItem[];
  onWorksChange: (works: WorkItem[]) => void;
};

const inputClass =
  "rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-base text-ink-900 dark:text-ink-50";

const labelClass = "mb-2 text-sm font-semibold text-ink-700 dark:text-ink-300";

const statuses: CheckoutStatus[] = ["completed", "partial", "blocked"];

const statusLabels: Record<CheckoutStatus, string> = {
  completed: "Completed",
  partial: "Partial",
  blocked: "Blocked",
};

// Colors for each status badge when active
const statusActiveStyle: Record<CheckoutStatus, { bg: string; text: string }> =
  {
    completed: { bg: "#16a34a1a", text: "#16a34a" },
    partial: { bg: "#d97706'1a", text: "#d97706" },
    blocked: { bg: "#dc26261a", text: "#dc2626" },
  };

export const CheckoutInputs = ({ works, onWorksChange }: CheckoutInputs) => {
  const handleTextChange = (text: string, index: number) => {
    const newWorks = [...works];
    newWorks[index] = { ...newWorks[index], text };
    onWorksChange(newWorks);
  };

  const handleStatusChange = (status: CheckoutStatus, index: number) => {
    const newWorks = [...works];
    newWorks[index] = { ...newWorks[index], status };
    onWorksChange(newWorks);
  };

  const addWork = () => {
    onWorksChange([...works, { text: "", status: "completed" }]);
  };

  const removeWork = (index: number) => {
    if (works.length > 1) {
      const newWorks = [...works];
      newWorks.splice(index, 1);
      onWorksChange(newWorks);
    }
  };

  return (
    <View className="gap-4">
      {works.map((work, index) => (
        <View
          key={index}
          className="p-4 border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800 rounded-2xl"
        >
          {/* Work item header */}
          <View className="flex-row justify-between mb-3 items-center">
            <Text className={labelClass}>Work Item {index + 1}</Text>
            {works.length > 1 && (
              <Pressable onPress={() => removeWork(index)}>
                <Text className="text-red-500 dark:text-red-400 font-semibold text-sm">
                  Remove
                </Text>
              </Pressable>
            )}
          </View>

          {/* Text input */}
          <TextInput
            value={work.text}
            onChangeText={(t) => handleTextChange(t, index)}
            placeholder="Summarize what you shipped or tried"
            placeholderTextColor="#a8aebc"
            multiline
            className={`${inputClass} min-h-[120px] pt-3 mb-4`}
            textAlignVertical="top"
          />

          {/* Status picker */}
          <View>
            <Text className={labelClass}>Status</Text>
            <View className="flex-row flex-wrap gap-2">
              {statuses.map((s) => {
                const active = work.status === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => handleStatusChange(s, index)}
                    className={`rounded-xl border-2 px-4 py-2.5 ${
                      active
                        ? "border-clay dark:border-clay-muted bg-clay/10 dark:bg-clay/20"
                        : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        active
                          ? "text-clay dark:text-clay-muted"
                          : "text-ink-600 dark:text-ink-300"
                      }`}
                    >
                      {statusLabels[s]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ))}

      {/* Add another */}
      <Pressable
        onPress={addWork}
        className="py-3 items-center border border-dashed border-ink-300 dark:border-ink-600 bg-ink-50 dark:bg-ink-800 rounded-2xl"
      >
        <Text className="text-sm font-semibold text-clay dark:text-clay-muted">
          + Add Another Work Item
        </Text>
      </Pressable>
    </View>
  );
};
