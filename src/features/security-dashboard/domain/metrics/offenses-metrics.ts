// qradar-offenses metrics — FE_DASHBOARD.md §5.1. `body` is an offense array.

import {
  CRITICAL_MAGNITUDE,
  type SeverityBucket,
  severityBucket,
} from "@/lib/const/severity";
import {
  type CategoryCount,
  TOP_LIMIT,
  asRecords,
  groupSum,
  toNumber,
  toText,
  topN,
} from "./metric-utils";

export interface OffenseRow {
  description: string;
  eventCount: number;
  id: number;
  lastUpdatedTime: number;
  magnitude: number;
  offenseSource: string;
  severity: number;
  status: string;
}

export interface OffensesMetrics {
  criticalCount: number;
  magnitudeDistribution: CategoryCount[];
  openCount: number;
  recent: OffenseRow[];
  topSources: CategoryCount[];
  total: number;
}

function toOffenseRow(row: Record<string, unknown>): OffenseRow {
  return {
    description: toText(row.description),
    eventCount: toNumber(row.event_count),
    id: toNumber(row.id),
    lastUpdatedTime: toNumber(row.last_updated_time),
    magnitude: toNumber(row.magnitude),
    offenseSource: toText(row.offense_source),
    severity: toNumber(row.severity),
    status: toText(row.status).toUpperCase(),
  };
}

export function computeOffensesMetrics(body: unknown): OffensesMetrics {
  const rows = asRecords(body);
  const offenses = rows.map(toOffenseRow);

  const distribution = new Map<SeverityBucket, number>();
  for (const offense of offenses) {
    const bucket = severityBucket(offense.magnitude);
    distribution.set(bucket, (distribution.get(bucket) ?? 0) + 1);
  }

  return {
    criticalCount: offenses.filter(
      (offense) => offense.magnitude >= CRITICAL_MAGNITUDE,
    ).length,
    magnitudeDistribution: [...distribution.entries()].map(
      ([label, value]) => ({ label, value }),
    ),
    openCount: offenses.filter((offense) => offense.status === "OPEN").length,
    recent: [...offenses].sort((a, b) => b.lastUpdatedTime - a.lastUpdatedTime),
    topSources: topN(
      groupSum(rows, "offense_source", "event_count"),
      TOP_LIMIT,
    ),
    total: offenses.length,
  };
}

// Trend point: open-offense count per snapshot (FE_DASHBOARD.md §5.1 card 5).
export function offensesTrendValue(body: unknown): number {
  return asRecords(body).filter(
    (row) => toText(row.status).toUpperCase() === "OPEN",
  ).length;
}
