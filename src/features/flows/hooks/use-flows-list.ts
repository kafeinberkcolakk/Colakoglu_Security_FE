import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { flowsApi } from "@/features/flows/api/flows-api";
import type { FlowListQuery } from "@/features/flows/types/flow";

export const flowsListKey = (query: FlowListQuery) =>
  ["flows", "list", query] as const;

export function useFlowsList(query: FlowListQuery = {}) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => flowsApi.list(query),
    queryKey: flowsListKey(query),
  });
}
