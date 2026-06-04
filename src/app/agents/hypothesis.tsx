import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Alert, Button, ChatMessage, StreamlitScreen, TextField } from "@/components/ui";
import { bubblesToChatMessages } from "@/lib/hypothesis-chat";
import { streamHypothesisChat, type HypothesisStreamBody } from "@/lib/hypothesis-stream";
import type { HypothesisBubble } from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

type ChatMsg = { role: "user" | "assistant"; title?: string; text: string };

export default function HypothesisScreen() {
  const token = useAccessToken();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [stage, setStage] = useState("initial");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Running hypothesis pipeline…");
  const [error, setError] = useState<string | null>(null);
  const streamedKeysRef = useRef<Set<string>>(new Set());

  function appendProgressBubbles(bubbles: HypothesisBubble[] | undefined) {
    if (!bubbles?.length) return;
    const fresh: HypothesisBubble[] = [];
    for (const b of bubbles) {
      const key = `${b.title ?? ""}:${b.content?.slice(0, 80) ?? ""}`;
      if (streamedKeysRef.current.has(key)) continue;
      streamedKeysRef.current.add(key);
      fresh.push(b);
    }
    const mapped = bubblesToChatMessages(fresh).map((m) => ({
      role: m.role,
      title: m.title,
      text: m.text ?? m.markdown ?? "",
    }));
    if (mapped.length) setMessages((prev) => [...prev, ...mapped]);
  }

  async function runChat(body: HypothesisStreamBody, userText?: string) {
    setLoading(true);
    setError(null);
    streamedKeysRef.current = new Set();
    if (userText) setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      await streamHypothesisChat(token, body, {
        onProgress: (ev) => {
          if (ev.label) setLoadingLabel(ev.label);
          appendProgressBubbles(ev.messages);
        },
        onComplete: (res) => {
          if (res.error) {
            setError(res.error);
            return;
          }
          setStage(res.stage);
          setOptions(res.options ?? []);
          appendProgressBubbles(res.messages);
          if (body.action === "submit_question") setQuestion("");
        },
        onError: (msg) => setError(msg),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
      setLoadingLabel("Running hypothesis pipeline…");
    }
  }

  const showRefineCards = stage === "refine" && options.length > 0;
  const showHypothesisCards = stage === "hypothesis" && options.length > 0;

  return (
    <StreamlitScreen
      title="AI Hypothesis Agent"
      icon="🧠"
      action={
        <Button
          label="🗑️ New"
          variant="secondary"
          onPress={() => {
            setMessages([]);
            setOptions([]);
            setStage("initial");
            setError(null);
            void runChat({ action: "reset" });
          }}
        />
      }
    >
      {error ? <Alert variant="error">{error}</Alert> : null}
      <ScrollView className="max-h-96 mb-3">
        {messages.length === 0 ? (
          <Alert variant="info">Enter your research question. Responses stream step by step.</Alert>
        ) : (
          messages.map((m, i) => (
            <ChatMessage key={`${i}-${m.title ?? ""}`} role={m.role} title={m.title}>
              {m.text}
            </ChatMessage>
          ))
        )}
        {loading ? (
          <ChatMessage role="assistant" title="Thinking">
            {loadingLabel}
          </ChatMessage>
        ) : null}
      </ScrollView>

      {showRefineCards ? (
        <View className="mb-3 gap-2">
          <Text className="mb-1 text-sm font-semibold text-[var(--st-text)]">Choose a line of thought:</Text>
          {options.map((opt, i) => (
            <View key={i} className="mb-2 rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)] p-3">
              <Text className="mb-2 text-sm text-[var(--st-text)]" numberOfLines={4}>
                {opt}
              </Text>
              <Button label={`Select ${i + 1}`} variant="secondary" onPress={() => runChat({ action: "choose_option", choice: String(i + 1) }, String(i + 1))} />
            </View>
          ))}
        </View>
      ) : null}

      {showHypothesisCards ? (
        <View className="mb-3 gap-2">
          <Text className="mb-1 text-sm font-semibold text-[var(--st-text)]">Next-step options:</Text>
          {options.map((opt, i) => (
            <View key={i} className="mb-2 rounded-lg border border-[var(--st-border)] bg-[var(--st-surface)] p-3">
              <Text className="mb-2 text-sm text-[var(--st-text)]" numberOfLines={4}>
                {opt}
              </Text>
              <Button label={`Select ${i + 1}`} variant="secondary" onPress={() => runChat({ action: "choose_option", choice: String(i + 1) }, String(i + 1))} />
            </View>
          ))}
        </View>
      ) : null}

      {stage === "analysis" ? (
        <Alert variant="success" className="mb-3">
          Hypothesis ready. Continue in the Experiment agent.
        </Alert>
      ) : null}

      <TextField
        label={stage === "refine" || stage === "hypothesis" ? "Choice (1–3)" : "Research question"}
        multiline
        value={question}
        onChangeText={setQuestion}
        placeholder={stage === "refine" || stage === "hypothesis" ? "1, 2, or 3" : "Research question"}
      />
      <View className="gap-2">
        {stage === "refine" || stage === "hypothesis" ? (
          <>
            <Button
              label={loading ? "Thinking…" : "Submit choice"}
              onPress={() => {
                const c = question.trim();
                if (["1", "2", "3"].includes(c)) void runChat({ action: "choose_option", choice: c }, c);
                else setError("Enter 1, 2, or 3");
              }}
            />
            <Button
              label={loading ? "Synthesizing…" : "Stop & create hypothesis"}
              variant="secondary"
              onPress={() => void runChat({ action: "generate_hypothesis" })}
            />
          </>
        ) : stage === "initial" ? (
          <Button
            label={loading ? "Thinking…" : "Submit question"}
            onPress={() => {
              if (!question.trim()) return;
              void runChat({ action: "submit_question", question: question.trim() }, question.trim());
            }}
          />
        ) : null}
      </View>
    </StreamlitScreen>
  );
}
