import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { Alert, Button, StreamlitScreen, Tabs } from "@/components/ui";
import { getHistory, type HistoryEntry } from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

const AGENT_TABS: { label: string; agent?: string }[] = [
  { label: "All", agent: undefined },
  { label: "Hypothesis", agent: "hypothesis" },
  { label: "Experiment", agent: "experiment" },
  { label: "Curve fitting", agent: "curve_fitting" },
  { label: "Analysis", agent: "analysis" },
];

function HistoryPanel({ agent, label }: { agent?: string; label: string }) {
  const token = useAccessToken();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError("Sign in to load history.");
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getHistory(token, { agent, limit: 100 });
      setEntries(res.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [token, agent]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator />
        <Text className="mt-2 text-sm text-[var(--st-muted)]">Loading {label}…</Text>
      </View>
    );
  }
  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }
  if (entries.length === 0) {
    return <Alert variant="info">No {label.toLowerCase()} interactions yet.</Alert>;
  }

  return (
    <View>
      <Button label="Refresh" variant="secondary" onPress={load} />
      <ScrollView className="mt-3 max-h-96" nestedScrollEnabled>
        {entries.map((entry) => (
          <View
            key={entry.id}
            className="mb-2 rounded-[var(--st-radius-sm)] border border-[var(--st-border)] bg-[var(--st-surface)] p-3"
          >
            <Text className="text-xs text-[var(--st-muted)]">
              {entry.agent ?? "general"} · {entry.role ?? entry.event_type ?? "event"}
            </Text>
            <Text className="mt-1 text-sm text-[var(--st-text)]">{entry.summary ?? "(no message)"}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HistoryScreen() {
  return (
    <StreamlitScreen
      title="Interaction History"
      icon="📜"
      description="Agent messages and hypothesis steps."
    >
      <Tabs
        scrollable
        items={AGENT_TABS.map((tab) => ({
          label: tab.label,
          content: <HistoryPanel agent={tab.agent} label={tab.label} />,
        }))}
      />
    </StreamlitScreen>
  );
}
