import { useQuery } from "@tanstack/react-query";
import { collectorsApi } from "@/features/collectors/api/collectors-api";
import {
  DEFAULT_RUN_LIMIT,
  RUNS_REFETCH_INTERVAL_MS,
} from "@/lib/const/intervals";

export const collectorRunsKey = (collectorId: string, limit: number) =>
  ["collectors", "runs", collectorId, limit] as const;

interface UseCollectorRunsOptions {
  collectorId: string;
  enabled?: boolean;
  limit?: number;
  refetchInterval?: number;
}

export function useCollectorRuns({
  collectorId,
  enabled = true,
  limit = DEFAULT_RUN_LIMIT,
  refetchInterval = RUNS_REFETCH_INTERVAL_MS,
}: UseCollectorRunsOptions) {
  return useQuery({
    enabled: enabled && collectorId !== "",
    queryFn: () => collectorsApi.runs(collectorId, limit),
    queryKey: collectorRunsKey(collectorId, limit),
    refetchInterval,
  });
}
