import type { CheckoutStatus } from "@/src/features/checkincheckout/types/Checkinout";
import { Text, View } from "react-native";

const config: Record<
  CheckoutStatus,
  { label: string; light: string; dark: string }
> = {
  completed: {
    label: "Completed",
    light: "bg-emerald-100 border-emerald-300 text-emerald-900",
    dark: "dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-100",
  },
  partial: {
    label: "Partial",
    light: "bg-amber-100 border-amber-300 text-amber-950",
    dark: "dark:bg-amber-950 dark:border-amber-700 dark:text-amber-100",
  },
  blocked: {
    label: "Blocked",
    light: "bg-rose-100 border-rose-300 text-rose-950",
    dark: "dark:bg-rose-950 dark:border-rose-700 dark:text-rose-100",
  },
};

type StatusIndicator = {
  status: CheckoutStatus;
  size?: "sm" | "md";
};

export const StatusIndicator = ({ status, size = "md" }: StatusIndicator) => {
  const c = config[status];
  const pad = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const textSize =
    size === "sm" ? "text-xs font-semibold" : "text-sm font-semibold";
  return (
    <View
      className={`self-start rounded-full border ${pad} ${c.light} ${c.dark}`}
    >
      <Text className={textSize}>{c.label}</Text>
    </View>
  );
};
