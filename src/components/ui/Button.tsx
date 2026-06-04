import { Pressable, Text } from "react-native";

export function Button({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
}) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`min-h-[44px] justify-center rounded-[var(--st-radius-sm)] px-4 py-3 ${
        primary ? "bg-[var(--st-primary)]" : "border border-[var(--st-border)] bg-[var(--st-surface)]"
      }`}
    >
      <Text
        className={`text-center text-sm font-medium ${primary ? "text-white" : "text-[var(--st-text)]"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
