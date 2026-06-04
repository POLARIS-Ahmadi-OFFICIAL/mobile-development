import type { ReactNode } from "react";
import { Text, View } from "react-native";

const variants = {
  info: "bg-[var(--st-info-bg)] border-[var(--st-info-border)]/30",
  success: "bg-[var(--st-success-bg)] border-[var(--st-success-border)]/30",
  warning: "bg-[var(--st-warning-bg)] border-[var(--st-warning-border)]/30",
  error: "bg-[var(--st-error-bg)] border-[var(--st-error-border)]/30",
};

const textVariants = {
  info: "text-[var(--st-info-text)]",
  success: "text-[var(--st-success-text)]",
  warning: "text-[var(--st-warning-text)]",
  error: "text-[var(--st-error-text)]",
};

export function Alert({
  variant = "info",
  children,
  className = "",
}: {
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
}) {
  const content =
    typeof children === "string" || typeof children === "number" ? (
      <Text className={`text-sm leading-5 ${textVariants[variant]}`}>{children}</Text>
    ) : (
      children
    );

  return (
    <View
      accessibilityRole="alert"
      className={`rounded-[var(--st-radius)] border px-3 py-3 ${variants[variant]} ${className}`.trim()}
    >
      {content}
    </View>
  );
}
