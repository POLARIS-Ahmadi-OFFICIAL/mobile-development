import { apiPath } from "@/lib/api-path";

import { getApiBase } from "@/lib/api-base";

export type AppSettings = {
  llm_provider?: string | null;
  llm_model?: string | null;
  qwen_base_url?: string | null;
  api_key_configured?: boolean;
};

const AGENT_TIMEOUT_MS = 300_000;

async function apiFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: string;
    token?: string | null;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  const res = await fetch(`${getApiBase()}${apiPath(path)}`, {
    method: options.method ?? "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(path === "/settings" ? { "Cache-Control": "no-cache" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body,
    signal: AbortSignal.timeout(options.timeoutMs ?? 30_000),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function getHealth() {
  return apiFetch<{ status: string; version: string }>("/health");
}

export async function getSettings(token?: string | null) {
  return apiFetch<AppSettings>("/settings", { token });
}

export type HypothesisChatBubble = {
  role: "user" | "assistant";
  title?: string | null;
  content: string;
};

export type HypothesisChatResponse = {
  stage: string;
  messages?: HypothesisChatBubble[];
  assistant_message: string;
  options: string[];
  error?: string | null;
};

export async function postHypothesisChat(
  token: string | null | undefined,
  body: {
    action: "submit_question" | "choose_option" | "generate_hypothesis" | "reset";
    question?: string;
    choice?: string;
  },
) {
  return apiFetch<HypothesisChatResponse>("/agents/hypothesis/chat", {
    method: "POST",
    body: JSON.stringify(body),
    token,
    timeoutMs: AGENT_TIMEOUT_MS,
  });
}

export type AgentRunResult = {
  agent: string;
  status: "success" | "error" | "skipped";
  message?: string | null;
  data: Record<string, unknown>;
};

export type DashboardSummary = {
  stage?: string | null;
  active_workflow?: boolean;
  last_hypothesis_preview?: string | null;
  hypothesis_ready?: boolean;
};

export async function getDashboardSummary(token?: string | null) {
  return apiFetch<DashboardSummary>("/dashboard/summary", { token });
}

export async function getAgentsStatus(token?: string | null) {
  return apiFetch<{
    stage?: string | null;
    agents: Array<{ name: string; ready: boolean; message: string; hint_action?: string }>;
  }>("/agents/status", { token });
}

export async function postAgentRun(
  token: string | null | undefined,
  agentPath: "experiment" | "curve-fitting" | "ml" | "analysis",
  payload: Record<string, unknown> = {},
) {
  return apiFetch<AgentRunResult>(`/agents/${agentPath}`, {
    method: "POST",
    body: JSON.stringify({ payload }),
    token,
    timeoutMs: AGENT_TIMEOUT_MS,
  });
}

export async function postCurveFittingUpload(
  token: string | null | undefined,
  options: {
    dataFilePath?: string;
    compositionFilePath?: string;
    experiment_id?: number;
  },
) {
  const form = new FormData();
  if (options.experiment_id != null) {
    form.append("experiment_id", String(options.experiment_id));
  }
  if (options.dataFilePath?.trim()) {
    form.append("data_file_path", options.dataFilePath.trim());
  }
  if (options.compositionFilePath?.trim()) {
    form.append("composition_file_path", options.compositionFilePath.trim());
  }
  const res = await fetch(`${getApiBase()}${apiPath("/agents/curve-fitting")}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
    signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json() as Promise<AgentRunResult>;
}

export async function patchSettings(
  token: string | null | undefined,
  body: AppSettings & { api_key?: string },
) {
  return apiFetch<AppSettings>("/settings", {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export type HistoryEntry = {
  id: string;
  timestamp: string;
  event_type?: string;
  eventType?: string;
  agent?: string | null;
  component?: string | null;
  role?: string | null;
  summary?: string | null;
};

export async function getHistory(
  token: string | null | undefined,
  params?: { agent?: string; limit?: number },
) {
  const search = new URLSearchParams();
  if (params?.agent) search.set("agent", params.agent);
  if (params?.limit != null) search.set("limit", String(params.limit));
  const q = search.toString();
  return apiFetch<{ items: HistoryEntry[] }>(`/history${q ? `?${q}` : ""}`, { token });
}

export async function clearSessionCache(token: string | null | undefined) {
  return apiFetch<{ status: string; message: string }>("/session/cache/clear", {
    method: "POST",
    token,
  });
}

// --- Literature Agent ---

export type PaperHit = {
  paper_slug: string;
  title: string;
  doi: string | null;
  score: number;
  summary_excerpt: string;
};

export type LiteratureJobSummary = {
  job_id: string;
  stage: string;
  status: string;
  created_at: number;
};

export type LiteratureJobDetail = LiteratureJobSummary & {
  log_tail: string;
  return_code: number | null;
};

export async function fetchLiteratureHealth(token: string | null | undefined) {
  return apiFetch<{ ok: boolean; active_jobs: string[] }>("/literature/health", { token });
}

export async function searchLiterature(
  token: string | null | undefined,
  query: string,
  limit = 5,
) {
  return apiFetch<PaperHit[]>("/literature/search", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
    token,
  });
}

export async function fetchLiteratureJobs(token: string | null | undefined) {
  return apiFetch<LiteratureJobSummary[]>("/literature/jobs", { token });
}

export async function fetchLiteratureJobDetail(
  token: string | null | undefined,
  jobId: string,
) {
  return apiFetch<LiteratureJobDetail>(`/literature/jobs/${jobId}`, { token });
}

export async function startLiteratureExtraction(
  token: string | null | undefined,
  searchQuery: string,
  maxPapers: number,
) {
  return apiFetch<{ job_id: string; status: string }>("/literature/start_stage", {
    method: "POST",
    body: JSON.stringify({
      stage: "extract_batch",
      search_query: searchQuery,
      max_papers: maxPapers,
    }),
    token,
  });
}
