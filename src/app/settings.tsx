import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { Alert, Button, StreamlitScreen, Tabs, TextField, ThemeToggle } from "@/components/ui";
import { clearSessionCache, getSettings, patchSettings } from "@/lib/api-client";
import { LLM_PROVIDERS, type LlmProviderId } from "@/lib/polaris-content";
import { useAccessToken } from "@/lib/use-access-token";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const token = useAccessToken();
  const [provider, setProvider] = useState<LlmProviderId>("qwen");
  const [model, setModel] = useState(LLM_PROVIDERS.qwen.defaultModel);
  const [customModel, setCustomModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cacheClearing, setCacheClearing] = useState(false);

  const meta = useMemo(() => LLM_PROVIDERS[provider], [provider]);

  useEffect(() => {
    getSettings(token)
      .then((s) => {
        const p = (s.llm_provider as LlmProviderId) || "qwen";
        setProvider(p in LLM_PROVIDERS ? p : "qwen");
        setModel(s.llm_model || LLM_PROVIDERS[p]?.defaultModel || "");
        setApiKeyConfigured(Boolean(s.api_key_configured));
      })
      .catch(() => setStatus("Could not load settings from API"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleClearCache() {
    setStatus(null);
    setCacheClearing(true);
    try {
      const res = await clearSessionCache(token);
      setStatus(res.message ?? "Session cache cleared.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to clear cache");
    } finally {
      setCacheClearing(false);
    }
  }

  async function saveSettings() {
    setStatus(null);
    try {
      await patchSettings(token, {
        llm_provider: provider,
        llm_model: customModel.trim() || model,
        api_key: apiKey.trim() || undefined,
      });
      setApiKeyConfigured(true);
      setApiKey("");
      setStatus("Settings saved.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <StreamlitScreen title="Settings" icon="⚙️" description="LLM provider, API keys, and appearance.">
      {loading ? <Alert variant="info">Loading…</Alert> : null}
      {status ? (
        <Alert variant={status.includes("failed") ? "error" : "success"}>{status}</Alert>
      ) : null}
      {!supabase ? (
        <Link href="/login" asChild>
          <Button label="Sign in with GitHub" variant="secondary" />
        </Link>
      ) : null}
      <Tabs
        items={[
          {
            label: "General",
            content: (
              <View>
                <Text className="mb-2 text-sm font-semibold text-[var(--st-text)]">Appearance</Text>
                <ThemeToggle />
                <Text className="mb-2 mt-4 text-sm font-semibold text-[var(--st-text)]">
                  LLM provider
                </Text>
                <View className="mb-3 flex-row gap-2">
                  {(Object.keys(LLM_PROVIDERS) as LlmProviderId[]).map((id) => (
                    <View key={id} className="flex-1">
                      <Button
                        label={LLM_PROVIDERS[id].label}
                        variant={provider === id ? "primary" : "secondary"}
                        onPress={() => {
                          setProvider(id);
                          setModel(LLM_PROVIDERS[id].defaultModel);
                        }}
                      />
                    </View>
                  ))}
                </View>
                <Text className="mb-2 text-xs text-[var(--st-muted)]">Model</Text>
                {meta.models.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setModel(m)}
                    className={`mb-1 rounded border px-3 py-2 ${
                      model === m
                        ? "border-[var(--st-primary)] bg-[var(--st-surface)]"
                        : "border-[var(--st-border)]"
                    }`}
                  >
                    <Text className="text-xs text-[var(--st-text)]">{m}</Text>
                  </Pressable>
                ))}
                <TextField
                  label="Custom model ID"
                  value={customModel}
                  onChangeText={setCustomModel}
                  placeholder={provider === "gemini" ? "gemini-2.0-flash" : "Qwen/Qwen2.5-32B-Instruct"}
                />
                <Text className="mb-2 mt-4 text-sm font-semibold text-[var(--st-text)]">
                  {meta.apiKeyLabel}
                </Text>
                {apiKeyConfigured && !apiKey ? (
                  <Alert variant="success">API key configured on server.</Alert>
                ) : (
                  <Alert variant="info">{meta.apiKeyHelp}</Alert>
                )}
                <TextField
                  label={meta.apiKeyLabel}
                  secureTextEntry
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="Enter API key to update"
                />
                <View className="mt-2">
                  <Button label="Save settings" onPress={saveSettings} />
                </View>
              </View>
            ),
          },
          {
            label: "Experiment",
            content: (
              <View>
                <TextField label="Jupyter server URL" placeholder="http://host:8888/" />
                <TextField label="Token" secureTextEntry />
              </View>
            ),
          },
          {
            label: "Cache",
            content: (
              <View>
                <Text className="mb-1 text-sm font-semibold text-[var(--st-text)]">Session cache</Text>
                <Text className="mb-3 text-sm leading-5 text-[var(--st-muted)]">
                  Clears workflow and agent session data. LLM keys and provider settings are kept.
                </Text>
                <Alert variant="warning">This cannot be undone.</Alert>
                <View className="mt-3">
                  <Button
                    label={
                      !token
                        ? "Sign in to clear cache"
                        : cacheClearing
                          ? "Clearing…"
                          : "Clear session cache"
                    }
                    variant="secondary"
                    onPress={token && !cacheClearing ? handleClearCache : undefined}
                  />
                </View>
              </View>
            ),
          },
        ]}
      />
    </StreamlitScreen>
  );
}
