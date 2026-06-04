import { Link, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Alert } from "@/components/ui";
import {
  AGENT_CARDS,
  APP_TAGLINE,
  GETTING_STARTED,
  QUICK_START_STEPS,
  RESEARCHER_FEATURES,
} from "@/lib/polaris-content";
import { getAgentsStatus, getDashboardSummary, getHealth } from "@/lib/api-client";
import { useAuth } from "@/providers/AuthProvider";

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[120px] rounded-[var(--st-radius-sm)] border border-[var(--st-border)] bg-[var(--st-surface)] px-3 py-2.5">
      <Text className="text-[10px] font-semibold uppercase text-[var(--st-muted)]">{label}</Text>
      <Text className="mt-0.5 text-sm font-semibold text-[var(--st-text)]">{value}</Text>
    </View>
  );
}

export function HomeDashboard() {
  const { session } = useAuth();
  const token = session?.access_token ?? null;
  const [apiStatus, setApiStatus] = useState("Checking…");
  const [stage, setStage] = useState("—");
  const [workflowActive, setWorkflowActive] = useState(false);
  const [readyLabel, setReadyLabel] = useState("—");

  useEffect(() => {
    getHealth()
      .then((h) => setApiStatus(`Connected · v${h.version}`))
      .catch(() => setApiStatus("API offline"));

    if (token) {
      void getDashboardSummary(token).then((s) => {
        setStage(s.stage ?? "—");
        setWorkflowActive(Boolean(s.active_workflow));
      });
      void getAgentsStatus(token).then((a) => {
        const ready = a.agents?.filter((x) => x.ready).length ?? 0;
        const total = a.agents?.length ?? 0;
        setReadyLabel(total ? `${ready}/${total}` : "—");
      });
    }
  }, [token]);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="mb-6 rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] px-5 py-6">
        <Text className="text-sm font-medium text-[var(--st-primary)]">POLARIS Research Lab</Text>
        <Text className="mt-2 text-2xl font-semibold text-[var(--st-text)]">Your research command center</Text>
        <Text className="mt-2 text-base leading-6 text-[var(--st-muted)]">{APP_TAGLINE}</Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          <Link href="/agents/hypothesis" asChild>
            <Pressable className="min-h-[44px] justify-center rounded-[var(--st-radius-sm)] bg-[var(--st-primary)] px-4 py-3">
              <Text className="text-center text-sm font-semibold text-white">Start Hypothesis</Text>
            </Pressable>
          </Link>
          <Link href="/workflow" asChild>
            <Pressable className="min-h-[44px] justify-center rounded-[var(--st-radius-sm)] border border-[var(--st-border)] bg-[var(--st-surface)] px-4 py-3">
              <Text className="text-center text-sm font-medium text-[var(--st-text)]">Workflow</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <Text className="mb-2 text-xs font-semibold uppercase text-[var(--st-muted)]">Status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <View className="flex-row gap-2">
          <StatusPill label="API" value={apiStatus} />
          <StatusPill label="Workflow" value={workflowActive ? "Active" : "Idle"} />
          <StatusPill label="Stage" value={stage} />
          <StatusPill label="Agents ready" value={readyLabel} />
        </View>
      </ScrollView>

      {apiStatus.includes("offline") ? (
        <View className="mb-6">
          <Alert variant="warning">Connect to the API (Settings → API URL) before running agents.</Alert>
        </View>
      ) : null}

      <Text className="mb-3 text-lg font-semibold text-[var(--st-text)]">Quick start</Text>
      {QUICK_START_STEPS.map((item) => (
        <Link key={item.step} href={item.href as Href} asChild>
          <Pressable className="mb-3 rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] p-4">
            <View className="mb-2 h-7 w-7 items-center justify-center rounded-full bg-[var(--st-primary)]">
              <Text className="text-xs font-bold text-white">{item.step}</Text>
            </View>
            <Text className="text-base font-semibold text-[var(--st-text)]">{item.title}</Text>
            <Text className="mt-1 text-sm text-[var(--st-muted)]">{item.description}</Text>
            <Text className="mt-2 text-sm font-medium text-[var(--st-primary)]">{item.cta} →</Text>
          </Pressable>
        </Link>
      ))}

      <Text className="mb-3 mt-4 text-lg font-semibold text-[var(--st-text)]">Agents</Text>
      {AGENT_CARDS.map((card) => (
        <Link key={card.href} href={card.href as Href} asChild>
          <Pressable className="mb-3 rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] p-4">
            <Text className="text-2xl">{card.icon}</Text>
            <Text className="mt-1 text-xs uppercase text-[var(--st-muted)]">{card.subtitle}</Text>
            <Text className="text-lg font-semibold text-[var(--st-text)]">{card.title}</Text>
            <Text className="mt-1 text-sm text-[var(--st-muted)]">{card.description}</Text>
          </Pressable>
        </Link>
      ))}

      <Text className="mb-3 mt-4 text-lg font-semibold text-[var(--st-text)]">Built for lab scientists</Text>
      {RESEARCHER_FEATURES.map((f) => (
        <View
          key={f.title}
          className="mb-2 rounded-[var(--st-radius-sm)] border border-[var(--st-border)] bg-[var(--st-surface)] p-3"
        >
          <Text className="font-semibold text-[var(--st-text)]">{f.title}</Text>
          <Text className="mt-1 text-sm text-[var(--st-muted)]">{f.detail}</Text>
        </View>
      ))}

      <View className="mt-4 rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] p-4">
        <Text className="mb-2 font-semibold text-[var(--st-text)]">Instructions</Text>
        <Text className="text-sm leading-5 text-[var(--st-muted)]">{GETTING_STARTED}</Text>
      </View>

      <Link href="/dashboard" asChild>
        <Pressable className="mt-4 min-h-[44px] justify-center rounded-[var(--st-radius-sm)] border border-[var(--st-border)] px-4 py-3">
          <Text className="text-center text-sm font-medium text-[var(--st-primary)]">Open analytics dashboard →</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
