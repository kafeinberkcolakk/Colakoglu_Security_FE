import { useQuery } from "@tanstack/react-query";
import { flowsApi } from "@/features/flows/api/flows-api";

export const flowDetailKey = (flowId: number) =>
  ["flows", "detail", flowId] as const;

export function useFlowDetail(flowId: number) {
  return useQuery({
    enabled: Number.isFinite(flowId) && flowId > 0,
    queryFn: () => flowsApi.detail(flowId),
    queryKey: flowDetailKey(flowId),
  });
}
