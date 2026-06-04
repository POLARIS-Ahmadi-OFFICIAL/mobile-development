import { Text, View } from "react-native";

export function ChatMessage({
  role,
  title,
  children,
}: {
  role: "user" | "assistant";
  title?: string;
  children: string;
}) {
  const user = role === "user";
  return (
    <View
      className={`mb-3 rounded-lg border-l-4 p-3 ${
        user
          ? "border-[var(--st-chat-user-border)] bg-[var(--st-chat-user)]"
          : "border-[var(--st-chat-assistant-border)] bg-[var(--st-chat-assistant)]"
      }`}
    >
      <Text className="mb-1 text-xs font-semibold uppercase text-[var(--st-muted)]">
        {user ? "You" : title || "Assistant"}
      </Text>
      <Text className="text-sm leading-relaxed text-[var(--st-text)]">{children}</Text>
    </View>
  );
}
