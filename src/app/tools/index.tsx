import { Link, type Href } from "expo-router";
import { Text, View } from "react-native";

import { StreamlitScreen } from "@/components/ui";

const TOOLS = [
  { href: "/tools/watcher" as Href, label: "👀 Watcher" },
  { href: "/tools/mcp" as Href, label: "🔗 MCP Orchestrator" },
  { href: "/workflow" as Href, label: "🧭 Workflow" },
  { href: "/dashboard" as Href, label: "📊 Dashboard" },
];

export default function ToolsIndexScreen() {
  return (
    <StreamlitScreen title="Tools">
      {TOOLS.map((item) => (
        <Link key={item.label} href={item.href} asChild>
          <View className="mb-2 rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)] px-4 py-3">
            <Text className="text-[var(--st-text)]">{item.label}</Text>
          </View>
        </Link>
      ))}
    </StreamlitScreen>
  );
}
