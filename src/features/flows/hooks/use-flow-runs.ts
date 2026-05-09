import { useQuery } from "@tanstack/react-query";
import { flowsApi } from "@/features/flows/api/flows-api";
import {
  DEFAULT_RUN_LIMIT,
  RUNS_REFETCH_INTERVAL_MS,
} from "@/lib/const/intervals";

export const flowRunsKey = (flowId: number, limit: number) =>
  ["flows", "runs", flowId, limit] as const;

interface UseFlowRunsOptions {
  flowId: number;
  enabled?: boolean;
  limit?: number;
  refetchInterval?: number | false;
}

export function useFlowRuns({
  flowId,
  enabled = true,
  limit = DEFAULT_RUN_LIMIT,
  refetchInterval = RUNS_REFETCH_INTERVAL_MS,
}: UseFlowRunsOptions) {
  return useQuery({
    enabled: enabled && Number.isFinite(flowId) && flowId > 0,
    queryFn: () => flowsApi.runs(flowId, limit),
    queryKey: flowRunsKey(flowId, limit),
    refetchInterval,
  });
}
