import { useQuery } from "@tanstack/react-query";
import { flowsApi } from "@/features/flows/api/flows-api";

export const FLOWS_REFETCH_INTERVAL_MS = 7000;
export const FLOWS_LIST_KEY = ["flows", "list"] as const;

export function useFlowsList() {
  return useQuery({
    queryFn: () => flowsApi.list(),
    queryKey: FLOWS_LIST_KEY,
    refetchInterval: FLOWS_REFETCH_INTERVAL_MS,
  });
}
