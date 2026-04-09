import { Text, TextInput, View } from "react-native";

type CheckinInputs = {
  projectName: string;
  onProjectNameChange: (v: string) => void;
  goal: string;
  onGoalChange: (v: string) => void;
  note: string;
  onNoteChange: (v: string) => void;
};

const inputClass =
  "rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50";

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
      <Text className={labelClass}>Project name</Text>
      <TextInput
        value={projectName}
        onChangeText={onProjectNameChange}
        placeholder="e.g. Mobile app redesign"
        placeholderTextColor="#94a3b8"
        className={inputClass}
      />
    </View>
    <View>
      <Text className={labelClass}>Today&apos;s goal</Text>
      <TextInput
        value={goal}
        onChangeText={onGoalChange}
        placeholder="What do you intend to finish?"
        placeholderTextColor="#94a3b8"
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
        placeholderTextColor="#94a3b8"
        multiline
        className={`${inputClass} min-h-[88px] pt-3`}
        textAlignVertical="top"
      />
    </View>
  </View>
);
