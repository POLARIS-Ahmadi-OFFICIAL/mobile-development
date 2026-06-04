import { useState } from "react";
import { Text, View } from "react-native";

import { Alert, Button, StreamlitScreen, TextField } from "@/components/ui";
import { postCurveFittingUpload } from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

export default function CurveFittingScreen() {
  const token = useAccessToken();
  const [dataPath, setDataPath] = useState("");
  const [compPath, setCompPath] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <StreamlitScreen title="Curve Fitting" icon="📈" description="Server-side CSV paths or web upload.">
      <Alert variant="info">
        File upload from the device picker is available on the web app. Here, enter paths on the API
        server (same as desktop backend).
      </Alert>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}
      <TextField
        label="Data CSV path (on server)"
        value={dataPath}
        onChangeText={setDataPath}
        placeholder="/path/to/luminescence.csv"
      />
      <TextField
        label="Composition file path (optional)"
        value={compPath}
        onChangeText={setCompPath}
        placeholder="/path/to/composition.csv"
      />
      <View className="mt-4">
        <Button
          label={loading ? "Running…" : "Run curve fitting"}
          onPress={async () => {
            if (!dataPath.trim()) {
              setError("Data file path is required.");
              return;
            }
            setLoading(true);
            setError(null);
            try {
              const res = await postCurveFittingUpload(token, {
                dataFilePath: dataPath.trim(),
                compositionFilePath: compPath.trim() || undefined,
              });
              setMessage(res.message ?? res.status);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            } finally {
              setLoading(false);
            }
          }}
        />
      </View>
      <Text className="mt-2 text-xs text-[var(--st-muted)]">
        Use the web Curve Fitting page to upload files through the browser.
      </Text>
    </StreamlitScreen>
  );
}
