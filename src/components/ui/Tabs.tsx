import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export function Tabs({
  items,
  scrollable = false,
}: {
  items: { label: string; content: React.ReactNode }[];
  scrollable?: boolean;
}) {
  const [active, setActive] = useState(0);
  return (
    <View>
      <ScrollView
        horizontal={scrollable}
        showsHorizontalScrollIndicator={scrollable}
        className="border-b border-[var(--st-border)]"
        contentContainerStyle={scrollable ? { flexDirection: "row" } : undefined}
      >
        <View className={scrollable ? "flex-row" : "flex-row flex-wrap"}>
          {items.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => setActive(i)}
              className={`px-3 py-2.5 ${active === i ? "border-b-2 border-[var(--st-primary)]" : ""}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: active === i }}
            >
              <Text
                className={`text-sm ${
                  active === i ? "font-semibold text-[var(--st-primary)]" : "text-[var(--st-muted)]"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View className="pt-4">{items[active]?.content}</View>
    </View>
  );
}
