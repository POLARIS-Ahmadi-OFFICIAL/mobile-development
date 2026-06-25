export const APP_TAGLINE =
  "AI-assisted workflow for materials discovery — from hypothesis to optimized compositions.";

export const GETTING_STARTED = `Sign in, add your LLM API key in Settings, then start with Hypothesis. Use Workflow for end-to-end automation or the Demo dataset to practice.`;

export const QUICK_START_STEPS = [
  { step: 1, title: "Frame your question", description: "Hypothesis agent — Socratic refinement.", href: "/agents/hypothesis", cta: "Hypothesis" },
  { step: 2, title: "Design experiment", description: "Protocols and composition worklists.", href: "/agents/experiment", cta: "Experiment" },
  { step: 3, title: "Analyze spectra", description: "Multi-peak curve fitting per well.", href: "/agents/curve-fitting", cta: "Curve Fitting" },
  { step: 4, title: "Optimize & interpret", description: "ML models then Analysis.", href: "/agents/ml-models", cta: "ML Models" },
] as const;

export const AGENT_CARDS = [
  { href: "/agents/hypothesis" as const, icon: "🧠", title: "Hypothesis", subtitle: "Question → hypothesis", description: "Literature-aware questioning and exportable reports." },
  { href: "/agents/experiment" as const, icon: "🧪", title: "Experiment", subtitle: "Protocol & worklist", description: "Constraints, GP worklists, Jupyter export." },
  { href: "/agents/curve-fitting" as const, icon: "📈", title: "Curve Fitting", subtitle: "Spectral peaks", description: "Peak CSV for downstream ML." },
  { href: "/agents/ml-models" as const, icon: "🤖", title: "ML Models", subtitle: "Explore space", description: "GP and Monte Carlo integration." },
  { href: "/agents/analysis" as const, icon: "🔎", title: "Analysis", subtitle: "Validate results", description: "Compare to your hypothesis." },
  { href: "/agents/literature" as const, icon: "📚", title: "Literature", subtitle: "Corpus search & jobs", description: "Search mined papers and manage extraction pipeline." },
  { href: "/workflow" as const, icon: "🧭", title: "Workflow", subtitle: "Automation", description: "Demo dataset and auto-ML." },
] as const;

export const RESEARCHER_FEATURES = [
  { title: "Session history export", detail: "Lab notebook and SI-ready interaction logs." },
  { title: "Composition × wells", detail: "Link chemistry to spectral readouts." },
  { title: "Peak-level CSV", detail: "Automatic handoff to ML Models." },
  { title: "Literature analysis", detail: "Structured recommendations vs. research goal." },
  { title: "File watcher", detail: "Trigger fitting on new spectra." },
  { title: "Demo workflow", detail: "Synthetic data for training." },
] as const;

export const NAVIGATION_LIST = [
  { label: "Home", desc: "Introduction and system overview" },
  { label: "Dashboard", desc: "System analytics and agent usage" },
  { label: "Hypothesis", desc: "Interactive hypothesis generation" },
  { label: "Experiment", desc: "Experimental planning" },
  { label: "Curve Fitting", desc: "Data analysis" },
  { label: "ML Models", desc: "Gaussian Process models" },
  { label: "Analysis", desc: "Analyze results" },
  { label: "Workflow", desc: "Run and build workflows" },
  { label: "Watcher", desc: "Filesystem watcher" },
  { label: "Settings", desc: "API keys and configuration" },
  { label: "History", desc: "Interaction history" },
];

export const WORKFLOW_STEPS = [
  { name: "Hypothesis Agent", description: "Generate and refine hypotheses", canAuto: false, page: "/agents/hypothesis" as const },
  { name: "Experiment Agent", description: "Design experiments", canAuto: false, page: "/agents/experiment" as const },
  { name: "Curve Fitting", description: "Fit curves to spectral data", canAuto: true, page: "/agents/curve-fitting" as const },
  { name: "ML Models", description: "ML optimization", canAuto: true, page: "/agents/ml-models" as const },
  { name: "Analysis Agent", description: "Analyze results", canAuto: true, page: "/agents/analysis" as const },
];

export type LlmProviderId = "qwen" | "gemini";

export const LLM_PROVIDERS: Record<
  LlmProviderId,
  {
    label: string;
    apiKeyLabel: string;
    apiKeyHelp: string;
    models: string[];
    defaultModel: string;
    endpoints: { value: string; label: string }[];
  }
> = {
  qwen: {
    label: "Qwen",
    apiKeyLabel: "Hugging Face API Key",
    apiKeyHelp: "https://huggingface.co/settings/tokens",
    models: [
      "Qwen/Qwen2.5-VL-72B-Instruct",
      "Qwen/Qwen2.5-72B-Instruct",
      "Qwen/Qwen2.5-32B-Instruct",
      "Qwen/Qwen2.5-14B-Instruct",
      "Qwen/Qwen2.5-7B-Instruct",
    ],
    defaultModel: "Qwen/Qwen2.5-VL-72B-Instruct",
    endpoints: [
      { value: "https://router.huggingface.co/v1", label: "HF Router" },
      { value: "https://api-inference.huggingface.co/v1", label: "HF Inference" },
    ],
  },
  gemini: {
    label: "Gemini",
    apiKeyLabel: "Google Gemini API Key",
    apiKeyHelp: "https://aistudio.google.com/apikey",
    models: [
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ],
    defaultModel: "gemini-2.0-flash-lite",
    endpoints: [],
  },
};

export const QWEN_MODELS = LLM_PROVIDERS.qwen.models;
export const GEMINI_MODELS = LLM_PROVIDERS.gemini.models;
