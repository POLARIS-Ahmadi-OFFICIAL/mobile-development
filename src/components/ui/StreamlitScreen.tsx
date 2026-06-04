import { ScrollView, Text, View } from "react-native";

export function StreamlitScreen({
  title,
  icon,
  description,
  children,
  action,
}: {
  title: string;
  icon?: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <ScrollView className="flex-1 bg-[var(--st-main)]" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="flex-row items-start justify-between border-b border-[var(--st-border)] bg-[var(--st-surface)] px-4 py-5">
        <Text
          className="flex-1 text-2xl font-semibold text-[var(--st-text)]"
          accessibilityRole="header"
        >
          {icon ? `${icon} ` : ""}
          {title}
        </Text>
        {action}
      </View>
      {description ? (
        <Text className="px-4 pt-3 text-sm text-[var(--st-muted)]">{description}</Text>
      ) : null}
      <View className="px-4 py-4">{children}</View>
    </ScrollView>
  );
}
