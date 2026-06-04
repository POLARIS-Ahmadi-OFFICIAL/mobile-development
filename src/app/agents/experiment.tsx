import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { Alert, Button, StreamlitScreen } from "@/components/ui";
import { getAgentsStatus, postAgentRun } from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

export default function ExperimentScreen() {
  const token = useAccessToken();
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getAgentsStatus(token).then((s) => {
      const exp = s.agents.find((a) => a.name.toLowerCase().includes("experiment"));
      if (exp) setMessage(exp.message);
    });
  }, [token]);

  return (
    <StreamlitScreen title="Experiment Agent" icon="🧪">
      {message ? <Alert variant="info">{message}</Alert> : null}
      {result ? <Alert variant="success">{result}</Alert> : null}
      <View className="mt-4 gap-2">
        <Button
          label={loading ? "Generating…" : "Generate experimental plan"}
          onPress={async () => {
            setLoading(true);
            try {
              const res = await postAgentRun(token, "experiment", { action: "generate_plan" });
              setResult(res.message ?? res.status);
              if (res.data?.experimental_plan_preview) {
                setResult(String(res.data.experimental_plan_preview).slice(0, 500));
              }
            } catch (e) {
              setResult(e instanceof Error ? e.message : "Failed");
            } finally {
              setLoading(false);
            }
          }}
        />
      </View>
      <Text className="mt-2 text-xs text-[var(--st-muted)]">
        Requires clarified question and Socratic pass from the Hypothesis agent.
      </Text>
    </StreamlitScreen>
  );
}
