import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import {
  DASHBOARD_REFETCH_INTERVAL_MS,
  FLOW_CHART_BUCKET_LIMIT,
  HOURS_PER_DAY,
  MS_PER_HOUR,
} from "@/lib/const/intervals";

export interface DashboardAggregates {
  payloadsLast24h: Awaited<ReturnType<typeof dataApi.payloads>>["content"];
  stats: Awaited<ReturnType<typeof dataApi.stats>>;
}

async function loadAggregates(): Promise<DashboardAggregates> {
  const since = new Date(
    Date.now() - HOURS_PER_DAY * MS_PER_HOUR,
  ).toISOString();

  const [stats, payloadsPage] = await Promise.all([
    dataApi.stats(),
    dataApi.payloads({
      from: since,
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
    }),
  ]);

  return {
    payloadsLast24h: payloadsPage.content,
    stats,
  };
}

export const DASHBOARD_QUERY_KEY = ["dashboard", "aggregates"] as const;

export function useDashboardAggregates() {
  return useQuery({
    queryFn: loadAggregates,
    queryKey: DASHBOARD_QUERY_KEY,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL_MS,
  });
}
