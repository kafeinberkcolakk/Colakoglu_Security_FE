import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import type { PayloadDetail } from "@/features/data/types/data";
import type { SecurityStateId } from "@/features/security-dashboard/domain/state-registry";
import { useVisiblePolling } from "@/hooks/use-visibility-pause";
import { SECURITY_REFETCH_INTERVAL_MS } from "@/lib/const/intervals";
import { SERVICE_PAYLOAD_SUBJECT } from "@/lib/const/pages";

// Trend recipe — FE_DASHBOARD.md §3.3: fetch the last N snapshots (N+1 detail
// requests) so each poll contributes one point to a time series.
export interface TrendSnapshot {
  detail: PayloadDetail;
  receivedAt: string;
}

async function loadTrend(
  productName: string,
  count: number,
): Promise<TrendSnapshot[]> {
  const page = await dataApi.payloads({
    page: 0,
    productName,
    size: count,
    subject: SERVICE_PAYLOAD_SUBJECT,
  });
  const details = await Promise.all(
    page.content.map((item) => dataApi.payloadDetail(item.id)),
  );
  // List is receivedAt DESC; reverse to chronological order for the chart.
  return page.content
    .map((item, index) => ({
      detail: details[index],
      receivedAt: item.receivedAt,
    }))
    .reverse();
}

export const stateTrendKey = (productName: SecurityStateId, count: number) =>
  ["security", "trend", productName, count] as const;

export function useStateTrend(productName: SecurityStateId, count: number) {
  const refetchInterval = useVisiblePolling(SECURITY_REFETCH_INTERVAL_MS);
  return useQuery({
    enabled: count > 0,
    queryFn: () => loadTrend(productName, count),
    queryKey: stateTrendKey(productName, count),
    refetchInterval,
  });
}
