import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/features/system/api/health-api";
import { useVisiblePolling } from "@/hooks/use-visibility-pause";
import { HEALTH_REFETCH_INTERVAL_MS } from "@/lib/const/intervals";

export const HEALTH_QUERY_KEY = ["system", "health"] as const;

export function useHealthStatus() {
  const refetchInterval = useVisiblePolling(HEALTH_REFETCH_INTERVAL_MS);
  return useQuery({
    queryFn: () => healthApi.get(),
    queryKey: HEALTH_QUERY_KEY,
    refetchInterval,
  });
}
