import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export function Expander({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View className="overflow-hidden rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)]">
      <Pressable onPress={() => setOpen(!open)} className="flex-row justify-between px-4 py-3">
        <Text className="text-sm font-medium text-[var(--st-text)]">{title}</Text>
        <Text className="text-[var(--st-muted)]">{open ? "▼" : "▶"}</Text>
      </Pressable>
      {open ? <View className="border-t border-[var(--st-border)] px-4 py-3">{children}</View> : null}
    </View>
  );
}
