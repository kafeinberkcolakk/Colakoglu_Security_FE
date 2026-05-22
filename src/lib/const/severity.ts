// QRadar severity / magnitude conventions — see FE_DASHBOARD.md §8.
// magnitude & severity are 1-10 scales; system resource gauges are 0-100 %.

export type SeverityBucket = "low" | "medium" | "high" | "critical";

export const SEVERITY_COLORS: Record<SeverityBucket, string> = {
  critical: "#c62828",
  high: "#ef6c00",
  low: "#2e7d32",
  medium: "#f9a825",
};

export const SEVERITY_BUCKET_ORDER: SeverityBucket[] = [
  "low",
  "medium",
  "high",
  "critical",
];

const LOW_MAX = 3;
const MEDIUM_MAX = 6;
const HIGH_MAX = 8;

export function severityBucket(score: number): SeverityBucket {
  if (score <= LOW_MAX) {
    return "low";
  }
  if (score <= MEDIUM_MAX) {
    return "medium";
  }
  if (score <= HIGH_MAX) {
    return "high";
  }
  return "critical";
}

// Magnitude threshold above which an offense counts as "critical" (FE_DASHBOARD.md §5.1).
export const CRITICAL_MAGNITUDE = 8;

export type StateHealth = "healthy" | "warning" | "stopped" | "unknown";

export const HEALTH_COLORS: Record<StateHealth, string> = {
  healthy: "#2e7d32",
  stopped: "#c62828",
  unknown: "#9e9e9e",
  warning: "#f9a825",
};

export type ResourceLevel = "ok" | "warn" | "crit";

const RESOURCE_WARN_PERCENT = 60;
const RESOURCE_CRIT_PERCENT = 80;

export const RESOURCE_COLORS: Record<ResourceLevel, string> = {
  crit: "#c62828",
  ok: "#2e7d32",
  warn: "#f9a825",
};

export function resourceLevel(percent: number): ResourceLevel {
  if (percent > RESOURCE_CRIT_PERCENT) {
    return "crit";
  }
  if (percent >= RESOURCE_WARN_PERCENT) {
    return "warn";
  }
  return "ok";
}
