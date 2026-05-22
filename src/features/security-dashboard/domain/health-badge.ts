// Collector health badge logic — FE_DASHBOARD.md §2.1.

import type { Flow } from "@/features/flows/types/flow";
import type { StateHealth } from "@/lib/const/severity";

const MS_PER_SECOND = 1000;
const STALE_INTERVAL_MULTIPLIER = 3;

export function isStale(
  lastIngestedAt: string | null,
  intervalSeconds: number,
): boolean {
  if (lastIngestedAt === null || intervalSeconds <= 0) {
    return false;
  }
  const parsed = Date.parse(lastIngestedAt);
  if (!Number.isFinite(parsed)) {
    return false;
  }
  const ageMs = Date.now() - parsed;
  return ageMs > STALE_INTERVAL_MULTIPLIER * intervalSeconds * MS_PER_SECOND;
}

export function computeStateHealth(flow: Flow | undefined): StateHealth {
  if (flow === undefined) {
    return "unknown";
  }
  if (!flow.active) {
    return "stopped";
  }
  if (flow.maxRetryCount > 0 && flow.retryCount >= flow.maxRetryCount) {
    return "warning";
  }
  if (isStale(flow.lastIngestedAt, flow.intervalSeconds)) {
    return "warning";
  }
  return "healthy";
}
