// qradar-firewall-deny metrics — FE_DASHBOARD.md §5.4.
// `body` is Ariel results: { events: [{ sourceip, destinationip, "COUNT(*)" }] }.

import {
  ARIEL_COUNT_KEY,
  type CategoryCount,
  FLOW_PAIR_LIMIT,
  TOP_LIMIT,
  arielEvents,
  groupSum,
  sumField,
  toNumber,
  toText,
  topN,
} from "./metric-utils";

export interface FlowPair {
  count: number;
  destination: string;
  source: string;
}

export interface FirewallDenyMetrics {
  flowPairs: FlowPair[];
  topDestinations: CategoryCount[];
  topSources: CategoryCount[];
  totalDeny: number;
}

export function computeFirewallDenyMetrics(body: unknown): FirewallDenyMetrics {
  const events = arielEvents(body);

  const flowPairs: FlowPair[] = events
    .map((row) => ({
      count: toNumber(row[ARIEL_COUNT_KEY]),
      destination: toText(row.destinationip),
      source: toText(row.sourceip),
    }))
    .filter((pair) => pair.source !== "" || pair.destination !== "")
    .sort((a, b) => b.count - a.count)
    .slice(0, FLOW_PAIR_LIMIT);

  return {
    flowPairs,
    topDestinations: topN(
      groupSum(events, "destinationip", ARIEL_COUNT_KEY),
      TOP_LIMIT,
    ),
    topSources: topN(groupSum(events, "sourceip", ARIEL_COUNT_KEY), TOP_LIMIT),
    totalDeny: sumField(events, ARIEL_COUNT_KEY),
  };
}

export function firewallDenyTrendValue(body: unknown): number {
  return sumField(arielEvents(body), ARIEL_COUNT_KEY);
}
