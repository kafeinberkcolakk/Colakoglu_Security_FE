import { useQuery } from "@tanstack/react-query";
import { dlqApi } from "@/features/dlq/api/dlq-api";
import {
  DEFAULT_DLQ_LIMIT,
  DLQ_REFETCH_INTERVAL_MS,
} from "@/lib/const/intervals";

export const dlqListKey = (limit: number) => ["dlq", "list", limit] as const;

interface UseDlqListOptions {
  limit?: number;
  refetchInterval?: number;
}

export function useDlqList({
  limit = DEFAULT_DLQ_LIMIT,
  refetchInterval = DLQ_REFETCH_INTERVAL_MS,
}: UseDlqListOptions = {}) {
  return useQuery({
    queryFn: () => dlqApi.list(limit),
    queryKey: dlqListKey(limit),
    refetchInterval,
  });
}
