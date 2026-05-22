// qradar-failed-logins metrics — FE_DASHBOARD.md §5.2.
// `body` is Ariel results: { events: [{ username, "COUNT(*)" }] }.

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

// Single-user failure count above this is flagged as a brute-force signal.
export const BRUTE_FORCE_THRESHOLD = 20;

export interface FailedLoginsMetrics {
  affectedUsers: number;
  topUsers: CategoryCount[];
  totalFailures: number;
  userRows: CategoryCount[];
}

export function computeFailedLoginsMetrics(body: unknown): FailedLoginsMetrics {
  const events = arielEvents(body);
  const rows = events
    .map((row) => ({
      label: toText(row.username),
      value: toNumber(row[ARIEL_COUNT_KEY]),
    }))
    .filter((row) => row.label !== "");
  const sorted = [...rows].sort((a, b) => b.value - a.value);

  return {
    affectedUsers: events.length,
    topUsers: topN(rows, TOP_LIMIT),
    totalFailures: sumField(events, ARIEL_COUNT_KEY),
    userRows: sorted,
  };
}

export function failedLoginsTrendValue(body: unknown): number {
  return sumField(arielEvents(body), ARIEL_COUNT_KEY);
}
