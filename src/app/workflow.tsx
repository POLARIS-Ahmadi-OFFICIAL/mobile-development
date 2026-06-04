import { StreamlitScreen, Tabs, Button, Alert } from "@/components/ui";
import { WORKFLOW_STEPS } from "@/lib/polaris-content";
import { Text, View } from "react-native";

export default function WorkflowScreen() {
  return (
    <StreamlitScreen title="Workflow" icon="🧭" description="End-to-end agent workflows.">
      <Tabs
        items={[
          {
            label: "Run",
            content: (
              <View className="gap-2">
                <Button label="▶️ Start workflow" />
                <Button label="Stop" variant="secondary" />
              </View>
            ),
          },
          {
            label: "Build",
            content: (
              <View>
                {WORKFLOW_STEPS.map((s) => (
                  <View key={s.name} className="mb-2 rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)] p-3">
                    <Text className="font-medium text-[var(--st-text)]">{s.name}</Text>
                    <Text className="text-xs text-[var(--st-muted)]">{s.description}</Text>
                  </View>
                ))}
              </View>
            ),
          },
        ]}
      />
      <Alert variant="info">Routing: autonomous or manual via API.</Alert>
    </StreamlitScreen>
  );
}
