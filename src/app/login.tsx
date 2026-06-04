import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Constants from "expo-constants";

import { Alert, Button, StreamlitScreen } from "@/components/ui";
import { authRedirectUri, signInWithGitHub } from "@/lib/auth-github";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginScreen() {
  const router = useRouter();
  const { setDevBypass } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = Boolean(
    Constants.expoConfig?.extra?.supabaseUrl && Constants.expoConfig?.extra?.supabaseAnonKey,
  );

  async function onGitHub() {
    setLoading(true);
    setError(null);
    const { error: err } = await signInWithGitHub();
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.replace("/");
  }

  return (
    <StreamlitScreen title="Sign in to POLARIS">
      <Text className="mb-3 text-sm text-[var(--st-muted)]">
        Sign in with GitHub via Supabase. Add this redirect URL in the Supabase dashboard:
      </Text>
      <Text className="mb-4 rounded bg-[var(--st-code-bg)] p-2 font-mono text-xs text-[var(--st-code-text)]">
        {authRedirectUri()}
      </Text>
      {error ? <Alert variant="error">{error}</Alert> : null}
      {!configured ? (
        <Alert variant="warning">
          Supabase keys missing in app.json — use Continue without auth for local API (AUTH_DISABLED).
        </Alert>
      ) : null}
      <View className="mt-4 gap-2">
        <Button
          label={loading ? "Opening browser…" : "Continue with GitHub"}
          onPress={onGitHub}
          variant="primary"
        />
        <Button
          label="Continue without auth (dev)"
          variant="secondary"
          onPress={() => {
            setDevBypass(true);
            router.replace("/");
          }}
        />
      </View>
    </StreamlitScreen>
  );
}
