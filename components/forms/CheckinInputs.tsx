import { Text, TextInput, View } from "react-native";

type CheckinInputs = {
  projectName: string;
  onProjectNameChange: (v: string) => void;
  goal: string;
  onGoalChange: (v: string) => void;
  note: string;
  onNoteChange: (v: string) => void;
  errors?: {
    projectName?: string;
    goal?: string;
    note?: string;
  };
};

const inputClass =
  "rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 text-base text-ink-900 dark:text-ink-50";

const labelClass = "mb-2 text-sm font-semibold text-ink-700 dark:text-ink-300";

export const CheckinInputs = ({
  projectName,
  onProjectNameChange,
  goal,
  onGoalChange,
  note,
  onNoteChange,
}: CheckinInputs) => (
  <View className="gap-5">
    <View>
      <Text className={labelClass}>Project Name</Text>
      <TextInput
        value={projectName}
        onChangeText={onProjectNameChange}
        placeholder="e.g. Mobile app redesign"
        placeholderTextColor="#a8aebc"
        className={inputClass}
      />
    </View>
    <View>
      <Text className={labelClass}>Today&apos;s Goal</Text>
      <TextInput
        value={goal}
        onChangeText={onGoalChange}
        placeholder="What do you intend to finish?"
        placeholderTextColor="#a8aebc"
        multiline
        className={`${inputClass} min-h-[100px] pt-3`}
        textAlignVertical="top"
      />
    </View>
    <View>
      <Text className={labelClass}>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={onNoteChange}
        placeholder="Context, links, reminders…"
        placeholderTextColor="#a8aebc"
        multiline
        className={`${inputClass} min-h-[88px] pt-3`}
        textAlignVertical="top"
      />
    </View>
  </View>
);
