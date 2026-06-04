import { Text, View } from "react-native";

import { HomeDashboard } from "@/components/HomeDashboard";
import { ThemeToggle } from "@/components/ui";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[var(--st-main)]">
      <View className="flex-row items-center justify-between border-b border-[var(--st-border)] bg-[var(--st-surface)] px-4 py-3">
        <Text className="text-lg font-semibold text-[var(--st-text)]" accessibilityRole="header">
          Home
        </Text>
        <ThemeToggle />
      </View>
      <HomeDashboard />
    </View>
  );
}
