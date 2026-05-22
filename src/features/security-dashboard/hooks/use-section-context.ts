import { useMemo } from "react";
import type { PayloadDetail } from "@/features/data/types/data";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import {
  computeStateHealth,
  isStale,
} from "@/features/security-dashboard/domain/health-badge";
import {
  OK_STATUS,
  type SnapshotResponse,
} from "@/features/security-dashboard/domain/snapshot-parser";
import type { SecurityStateId } from "@/features/security-dashboard/domain/state-registry";
import { useStateSnapshot } from "@/features/security-dashboard/hooks/use-state-snapshot";
import type { StateHealth } from "@/lib/const/severity";

export type SectionStatus = "loading" | "error" | "no-data" | "ok";

export interface SectionContext {
  detail: PayloadDetail | null;
  health: StateHealth;
  intervalSeconds: number | null;
  receivedAt: string | null;
  stale: boolean;
  status: SectionStatus;
}

export function useSectionContext(stateId: SecurityStateId): SectionContext {
  const snapshot = useStateSnapshot(stateId);
  const flowsQuery = useFlowsList();

  const flow = useMemo(
    () => flowsQuery.data?.items.find((item) => item.name === stateId),
    [flowsQuery.data?.items, stateId],
  );

  const intervalSeconds = flow?.intervalSeconds ?? null;
  const receivedAt = snapshot.data?.receivedAt ?? null;
  const detail = snapshot.data?.detail ?? null;

  let status: SectionStatus;
  if (snapshot.isPending) {
    status = "loading";
  } else if (snapshot.isError) {
    status = "error";
  } else if (detail === null) {
    status = "no-data";
  } else {
    status = "ok";
  }

  return {
    detail,
    health: computeStateHealth(flow),
    intervalSeconds,
    receivedAt,
    stale: isStale(receivedAt, intervalSeconds ?? 0),
    status,
  };
}

// Promotes an "ok" base status to "error" when the QRadar response itself is
// unhealthy (non-200) or could not be parsed (FE_DASHBOARD.md §6.3).
export function withResponseStatus(
  base: SectionStatus,
  response: SnapshotResponse | null,
): SectionStatus {
  if (base !== "ok") {
    return base;
  }
  if (response === null || response.statusCode !== OK_STATUS) {
    return "error";
  }
  return "ok";
}
