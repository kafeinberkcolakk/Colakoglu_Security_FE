// qradar-top-attackers metrics — FE_DASHBOARD.md §5.3.
// `body` is Ariel results: { events: [{ sourceip, "COUNT(*)" }] }.

import {
  ARIEL_COUNT_KEY,
  type CategoryCount,
  TOP_LIMIT,
  arielEvents,
  sumField,
  toNumber,
  toText,
  topN,
} from "./metric-utils";

export interface TopAttackersMetrics {
  distinctIps: number;
  topIps: CategoryCount[];
  totalEvents: number;
}

export function computeTopAttackersMetrics(body: unknown): TopAttackersMetrics {
  const events = arielEvents(body);
  const rows = events
    .map((row) => ({
      label: toText(row.sourceip),
      value: toNumber(row[ARIEL_COUNT_KEY]),
    }))
    .filter((row) => row.label !== "");

  return {
    distinctIps: rows.length,
    topIps: topN(rows, TOP_LIMIT),
    totalEvents: sumField(events, ARIEL_COUNT_KEY),
  };
}

export function topAttackersTrendValue(body: unknown): number {
  return sumField(arielEvents(body), ARIEL_COUNT_KEY);
}
