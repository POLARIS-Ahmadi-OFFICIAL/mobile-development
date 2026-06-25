import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Alert, Button, StreamlitScreen, TextField } from "@/components/ui";
import {
  type LiteratureJobDetail,
  type LiteratureJobSummary,
  type PaperHit,
  fetchLiteratureHealth,
  fetchLiteratureJobDetail,
  fetchLiteratureJobs,
  searchLiterature,
  startLiteratureExtraction,
} from "@/lib/api-client";
import { useAccessToken } from "@/lib/use-access-token";

const STATUS_COLORS: Record<string, string> = {
  running:   "bg-[var(--st-info-bg)]",
  completed: "bg-[var(--st-success-bg)]",
  failed:    "bg-[var(--st-error-bg)]",
  cancelled: "bg-[var(--st-surface-raised)]",
  queued:    "bg-[var(--st-warning-bg)]",
};
const STATUS_TEXT_COLORS: Record<string, string> = {
  running:   "text-[var(--st-info-text)]",
  completed: "text-[var(--st-success-text)]",
  failed:    "text-[var(--st-error-text)]",
  cancelled: "text-[var(--st-muted)]",
  queued:    "text-[var(--st-warning-text)]",
};
const STATUS_LABELS: Record<string, string> = {
  running: "Running", completed: "Done", failed: "Failed",
  cancelled: "Cancelled", queued: "Queued",
};

export default function LiteratureScreen() {
  const token = useAccessToken();
  const [activeTab, setActiveTab] = useState<"search" | "pipeline">("search");

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PaperHit[]>([]);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Pipeline
  const [health, setHealth] = useState<{ ok: boolean; active_jobs: string[] } | null>(null);
  const [jobs, setJobs] = useState<LiteratureJobSummary[]>([]);
  const [selectedJob, setSelectedJob] = useState<LiteratureJobDetail | null>(null);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [launchQuery, setLaunchQuery] = useState(
    "perovskite solar cell stability T80 retention",
  );
  const [maxPapers, setMaxPapers] = useState("100");
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchLiteratureHealth(token)
      .then(setHealth)
      .catch(() => setHealth({ ok: false, active_jobs: [] }));
    fetchLiteratureJobs(token).then(setJobs).catch(() => setJobs([]));
  }, [token]);

  // Poll selected job
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!selectedJob) return;
    if (selectedJob.status !== "running") return;

    const poll = async () => {
      try {
        const detail = await fetchLiteratureJobDetail(token, selectedJob.job_id);
        setSelectedJob(detail);
        if (detail.status !== "running") {
          clearInterval(pollRef.current!);
          fetchLiteratureJobs(token).then(setJobs).catch(() => {});
        }
      } catch {
        clearInterval(pollRef.current!);
      }
    };

    pollRef.current = setInterval(poll, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedJob?.job_id, selectedJob?.status, token]);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await searchLiterature(token, query.trim());
      setSearchResults(results);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }

  async function handleLaunch() {
    if (!launchQuery.trim()) return;
    setLaunching(true);
    setLaunchError(null);
    try {
      await startLiteratureExtraction(token, launchQuery.trim(), parseInt(maxPapers, 10) || 100);
      fetchLiteratureJobs(token).then(setJobs).catch(() => {});
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : "Launch failed");
    } finally {
      setLaunching(false);
    }
  }

  async function openJobLog(job: LiteratureJobSummary) {
    try {
      const detail = await fetchLiteratureJobDetail(token, job.job_id);
      setSelectedJob(detail);
      setLogModalVisible(true);
    } catch (e) {
      setLaunchError(e instanceof Error ? e.message : "Failed to load job");
    }
  }

  return (
    <StreamlitScreen title="Literature Agent" icon="📚">
      {/* Tab bar */}
      <View className="mb-3 flex-row border-b border-[var(--st-border)]">
        {(["search", "pipeline"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            className="relative flex-1 items-center py-2"
          >
            <Text
              className={
                activeTab === tab
                  ? "text-sm font-semibold text-[var(--st-primary)]"
                  : "text-sm text-[var(--st-muted)]"
              }
            >
              {tab === "search" ? "Search" : "Pipeline"}
            </Text>
            {activeTab === tab && (
              <View className="absolute bottom-0 h-0.5 w-full bg-[var(--st-primary)]" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Search tab */}
      {activeTab === "search" && (
        <View className="gap-3">
          <TextField
            label="Search query"
            value={query}
            onChangeText={setQuery}
            placeholder="e.g. perovskite stability"
          />
          <Button
            label={searching ? "Searching…" : "Search"}
            onPress={() => { void handleSearch(); }}
          />
          {searchError && <Alert variant="error">{searchError}</Alert>}
          {searchResults.map((paper) => (
            <Pressable
              key={paper.paper_slug}
              onPress={() =>
                setExpandedSlug(expandedSlug === paper.paper_slug ? null : paper.paper_slug)
              }
              className="rounded-[var(--st-radius)] border border-[var(--st-border)]
                         bg-[var(--st-surface)] p-3"
            >
              <Text className="text-sm font-semibold text-[var(--st-text)]">
                {paper.title}
              </Text>
              {paper.doi ? (
                <Text className="mt-0.5 text-xs text-[var(--st-muted)]">
                  DOI: {paper.doi}
                </Text>
              ) : null}
              <Text className="mt-1 text-xs text-[var(--st-text-secondary)]">
                {expandedSlug === paper.paper_slug
                  ? paper.summary_excerpt
                  : paper.summary_excerpt.slice(0, 200) + (paper.summary_excerpt.length > 200 ? "…" : "")}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Pipeline tab */}
      {activeTab === "pipeline" && (
        <View className="gap-3">
          {/* Health */}
          {health && (
            <View className="flex-row items-center gap-2">
              <View
                className={`h-2 w-2 rounded-full ${
                  health.ok ? "bg-[var(--st-success-border)]" : "bg-[var(--st-warning-border)]"
                }`}
              />
              <Text className="text-xs text-[var(--st-text-secondary)]">
                {health.ok ? "Connected" : "Needs attention"} ·{" "}
                {health.active_jobs.length} active job
                {health.active_jobs.length !== 1 ? "s" : ""}
              </Text>
            </View>
          )}

          {/* Launch form */}
          <View className="rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] p-3 gap-2">
            <Text className="text-xs font-medium text-[var(--st-text)]">
              Launch Extraction
            </Text>
            <TextField
              label="Expansion query"
              value={launchQuery}
              onChangeText={setLaunchQuery}
              placeholder="perovskite solar cell stability…"
              multiline
            />
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-[var(--st-muted)]">Batch size</Text>
              <TextInput
                value={maxPapers}
                onChangeText={setMaxPapers}
                keyboardType="numeric"
                className="w-20 rounded-md border border-[var(--st-border)]
                           bg-[var(--st-bg)] px-2 py-1 text-sm text-[var(--st-text)]"
              />
            </View>
            {launchError && <Alert variant="error">{launchError}</Alert>}
            <Button
              label={launching ? "Starting…" : "Launch Extraction"}
              onPress={() => { void handleLaunch(); }}
            />
          </View>

          {/* Jobs list */}
          <Text className="text-xs font-medium text-[var(--st-text)]">Recent Jobs</Text>
          {jobs.length === 0 && (
            <Text className="text-xs text-[var(--st-muted)]">No jobs yet.</Text>
          )}
          {jobs.map((job) => (
            <Pressable
              key={job.job_id}
              onPress={() => { void openJobLog(job); }}
              className="flex-row items-center justify-between rounded-[var(--st-radius-sm)]
                         border border-[var(--st-border)] bg-[var(--st-surface)] px-3 py-2"
            >
              <View>
                <Text className="font-mono text-xs text-[var(--st-text)]">
                  {job.job_id.slice(0, 28)}
                </Text>
                <Text className="text-xs text-[var(--st-muted)]">{job.stage}</Text>
              </View>
              <View
                className={`rounded-full px-2 py-0.5 ${STATUS_COLORS[job.status] ?? STATUS_COLORS.queued}`}
              >
                <Text
                  className={`text-xs font-medium ${STATUS_TEXT_COLORS[job.status] ?? STATUS_TEXT_COLORS.queued}`}
                >
                  {STATUS_LABELS[job.status] ?? job.status}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* Log modal */}
      <Modal
        visible={logModalVisible}
        animationType="slide"
        onRequestClose={() => setLogModalVisible(false)}
      >
        <View className="flex-1 bg-[var(--st-bg)] p-4">
          <Text className="mb-2 font-mono text-xs text-[var(--st-muted)]">
            {selectedJob?.job_id ?? ""}
          </Text>
          <ScrollView className="flex-1 rounded-[var(--st-radius-sm)] bg-[var(--st-surface)] p-3">
            <Text className="font-mono text-xs text-[var(--st-text-secondary)]">
              {selectedJob?.log_tail || "No log output yet."}
            </Text>
          </ScrollView>
          {selectedJob?.status === "running" && (
            <Text className="mt-2 text-center text-xs text-[var(--st-muted)]">
              Refreshing every 3 s…
            </Text>
          )}
          <View className="mt-4">
            <Button label="Close" variant="secondary" onPress={() => setLogModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </StreamlitScreen>
  );
}
