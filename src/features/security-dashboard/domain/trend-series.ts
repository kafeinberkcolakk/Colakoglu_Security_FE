// Turns the last-N snapshots (FE_DASHBOARD.md §3.3) into a chart-ready series.

import {
  OK_STATUS,
  parseSnapshot,
} from "@/features/security-dashboard/domain/snapshot-parser";
import type { TrendSnapshot } from "@/features/security-dashboard/hooks/use-state-trend";

export interface TrendPoint {
  label: string;
  value: number;
}

function timeLabel(receivedAt: string): string {
  const parsed = new Date(receivedAt);
  if (Number.isNaN(parsed.getTime())) {
    return receivedAt;
  }
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function buildTrendSeries(
  snapshots: TrendSnapshot[],
  selectValue: (body: unknown) => number,
): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (const snapshot of snapshots) {
    const parsed = parseSnapshot(snapshot.detail);
    if (parsed === null || parsed.statusCode !== OK_STATUS) {
      continue;
    }
    points.push({
      label: timeLabel(snapshot.receivedAt),
      value: selectValue(parsed.body),
    });
  }
  return points;
}
