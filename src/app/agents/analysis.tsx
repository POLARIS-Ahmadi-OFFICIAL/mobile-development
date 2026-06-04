import { useEffect, useState } from "react";
import { View } from "react-native";

import { Alert, Button, StreamlitScreen } from "@/components/ui";
import { getAgentsStatus, postAgentRun } from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

export default function AnalysisScreen() {
  const token = useAccessToken();
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void getAgentsStatus(token).then((s) => {
      const a = s.agents.find((x) => x.name.toLowerCase().includes("analysis"));
      if (a) setMessage(a.message);
    });
  }, [token]);

  return (
    <StreamlitScreen title="Analysis Agent" icon="🔎">
      {message ? <Alert variant="info">{message}</Alert> : null}
      {preview ? <Alert variant="success">{preview}</Alert> : null}
      <View className="mt-4">
        <Button
          label={loading ? "Analyzing…" : "Run analysis"}
          onPress={async () => {
            setLoading(true);
            try {
              const res = await postAgentRun(token, "analysis", { action: "analyze" });
              setPreview(
                String(res.data?.analysis_preview ?? res.message ?? res.status).slice(0, 600),
              );
            } catch (e) {
              setPreview(e instanceof Error ? e.message : "Failed");
            } finally {
              setLoading(false);
            }
          }}
        />
      </View>
    </StreamlitScreen>
  );
}
