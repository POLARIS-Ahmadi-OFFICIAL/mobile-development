import { Pressable, Text, View } from "react-native";

import { useTheme, type ThemePreference } from "@/providers/ThemeProvider";

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <View className="flex-row rounded-md border border-[var(--st-border)] bg-[var(--st-surface)] p-0.5">
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => setPreference(opt)}
          className={`rounded px-3 py-2 ${preference === opt ? "bg-[var(--st-primary)]" : ""}`}
        >
          <Text
            className={`text-xs capitalize ${
              preference === opt ? "font-semibold text-white" : "text-[var(--st-muted)]"
            }`}
          >
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
