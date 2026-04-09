import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButton = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
};

export const PrimaryButton = ({
  label,
  onPress,
  loading,
  variant = "primary",
}: PrimaryButton) => {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`rounded-2xl py-4 px-5 active:opacity-90 ${
        isPrimary
          ? "bg-clay dark:bg-clay-muted"
          : "border-2 border-ink-300 bg-transparent dark:border-ink-600"
      }`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : "#c45c3e"} />
      ) : (
        <Text
          className={`text-center text-base font-semibold ${
            isPrimary ? "text-white" : "text-ink-800 dark:text-ink-100"
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};
