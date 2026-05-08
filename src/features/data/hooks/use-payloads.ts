import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import type { PayloadListQuery } from "@/features/data/types/data";

export const payloadsKey = (query: PayloadListQuery) =>
  ["data", "payloads", query] as const;

interface UsePayloadsOptions {
  enabled?: boolean;
  query: PayloadListQuery;
  refetchInterval?: number | false;
}

export function usePayloads({
  enabled = true,
  query,
  refetchInterval = false,
}: UsePayloadsOptions) {
  return useQuery({
    enabled,
    queryFn: () => dataApi.payloads(query),
    queryKey: payloadsKey(query),
    refetchInterval,
  });
}
