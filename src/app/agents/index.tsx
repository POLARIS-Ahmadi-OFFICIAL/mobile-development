import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { AGENT_CARDS } from "@/lib/polaris-content";
import { StreamlitScreen } from "@/components/ui";

export default function AgentsIndexScreen() {
  return (
    <StreamlitScreen
      title="Research agents"
      description="Run each stage of the POLARIS pipeline on your connected API."
    >
      {AGENT_CARDS.filter((c) => c.href.startsWith("/agents")).map((item) => (
        <Link key={item.href} href={item.href as Href} asChild>
          <Pressable className="mb-3 min-h-[44px] rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] p-4">
            <Text className="text-2xl">{item.icon}</Text>
            <Text className="mt-1 text-xs uppercase text-[var(--st-muted)]">{item.subtitle}</Text>
            <Text className="text-lg font-semibold text-[var(--st-text)]">{item.title}</Text>
            <Text className="mt-1 text-sm text-[var(--st-muted)]">{item.description}</Text>
          </Pressable>
        </Link>
      ))}
    </StreamlitScreen>
  );
}
