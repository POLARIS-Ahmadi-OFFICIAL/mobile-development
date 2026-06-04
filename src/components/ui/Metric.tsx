import { Text, View } from "react-native";

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[140px] flex-1 rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)] p-3">
      <Text className="text-xs uppercase text-[var(--st-muted)]">{label}</Text>
      <Text className="mt-1 text-xl font-semibold text-[var(--st-text)]">{value}</Text>
    </View>
  );
}
