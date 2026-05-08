import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import { STATS_REFETCH_INTERVAL_MS } from "@/lib/const/intervals";

export const DATA_STATS_KEY = ["data", "stats"] as const;

export function useDataStats() {
  return useQuery({
    queryFn: () => dataApi.stats(),
    queryKey: DATA_STATS_KEY,
    refetchInterval: STATS_REFETCH_INTERVAL_MS,
  });
}
