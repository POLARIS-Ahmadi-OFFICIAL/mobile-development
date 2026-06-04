export type HypothesisBubble = {
  role: "user" | "assistant";
  title?: string | null;
  content: string;
};

export function bubblesToChatMessages(
  bubbles: HypothesisBubble[] | undefined,
  userText?: string,
): { role: "user" | "assistant"; title?: string; text: string }[] {
  const out: { role: "user" | "assistant"; title?: string; text: string }[] = [];
  if (userText) {
    out.push({ role: "user", text: userText });
  }
  for (const b of bubbles ?? []) {
    if (!b.content?.trim()) continue;
    out.push({
      role: b.role === "user" ? "user" : "assistant",
      title: b.title ?? undefined,
      text: b.content,
    });
  }
  return out;
}
