"use client";

import { type ReactNode, createContext, useContext, useMemo } from "react";
import type { PayloadDetail } from "@/features/data/types/data";
import {
  type SnapshotResponse,
  parseSnapshot,
} from "@/features/security-dashboard/domain/snapshot-parser";
import type { SecurityStateId } from "@/features/security-dashboard/domain/state-registry";
import {
  type SectionStatus,
  useSectionContext,
} from "@/features/security-dashboard/hooks/use-section-context";
import {
  type TrendSnapshot,
  useStateTrend,
} from "@/features/security-dashboard/hooks/use-state-trend";
import type { StateHealth } from "@/lib/const/severity";

// One subscription point per state section: snapshot + trend are fetched once
// here, parsed once, and shared by StateSection and every widget in the grid.
export interface SectionData {
  detail: PayloadDetail | null;
  health: StateHealth;
  intervalSeconds: number | null;
  // Single-endpoint snapshot, parsed once. Null for system-health, whose
  // two-part response is parsed separately via parseHealthSnapshot.
  parsed: SnapshotResponse | null;
  receivedAt: string | null;
  stale: boolean;
  status: SectionStatus;
  trend: TrendSnapshot[];
}

const NO_TREND: TrendSnapshot[] = [];

const SectionDataContext = createContext<SectionData | null>(null);

export function useSectionData(): SectionData {
  const value = useContext(SectionDataContext);
  if (value === null) {
    throw new Error("useSectionData must be used within SectionDataProvider");
  }
  return value;
}

interface SectionDataProviderProps {
  children: ReactNode;
  stateId: SecurityStateId;
  // Number of recent snapshots to fetch for trend widgets; omit when the
  // section has no trend chart (skips the N+1 requests entirely).
  trendSnapshots?: number;
}

export function SectionDataProvider({
  children,
  stateId,
  trendSnapshots = 0,
}: SectionDataProviderProps) {
  const ctx = useSectionContext(stateId);
  const trendQuery = useStateTrend(stateId, trendSnapshots);
  const trend = trendQuery.data ?? NO_TREND;

  const parsed = useMemo(
    () => (ctx.detail === null ? null : parseSnapshot(ctx.detail)),
    [ctx.detail],
  );

  const value = useMemo<SectionData>(
    () => ({
      detail: ctx.detail,
      health: ctx.health,
      intervalSeconds: ctx.intervalSeconds,
      parsed,
      receivedAt: ctx.receivedAt,
      stale: ctx.stale,
      status: ctx.status,
      trend,
    }),
    [
      ctx.detail,
      ctx.health,
      ctx.intervalSeconds,
      parsed,
      ctx.receivedAt,
      ctx.stale,
      ctx.status,
      trend,
    ],
  );

  return (
    <SectionDataContext.Provider value={value}>
      {children}
    </SectionDataContext.Provider>
  );
}
