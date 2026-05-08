import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import { dlqApi } from "@/features/dlq/api/dlq-api";
import {
  DASHBOARD_DLQ_LIMIT,
  DASHBOARD_REFETCH_INTERVAL_MS,
  FLOW_CHART_BUCKET_LIMIT,
  HOURS_PER_DAY,
  MS_PER_HOUR,
} from "@/lib/const/intervals";

export interface DashboardAggregates {
  dlqCount: number;
  payloadsLast24h: Awaited<ReturnType<typeof dataApi.payloads>>["content"];
  recentDlq: Awaited<ReturnType<typeof dlqApi.list>>;
  stats: Awaited<ReturnType<typeof dataApi.stats>>;
  subjects: Awaited<ReturnType<typeof dataApi.subjects>>;
}

async function loadAggregates(): Promise<DashboardAggregates> {
  const since = new Date(
    Date.now() - HOURS_PER_DAY * MS_PER_HOUR,
  ).toISOString();

  const [stats, subjects, recentDlq, payloadsPage] = await Promise.all([
    dataApi.stats(),
    dataApi.subjects(),
    dlqApi.list(DASHBOARD_DLQ_LIMIT),
    dataApi.payloads({
      from: since,
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
    }),
  ]);

  return {
    dlqCount: recentDlq.length,
    payloadsLast24h: payloadsPage.content,
    recentDlq,
    stats,
    subjects,
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
