import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";

const TWO_MINUTES_MS = 120_000;
const DETAIL_GC_TIME_MS = TWO_MINUTES_MS;

export const payloadDetailKey = (payloadId: string) =>
  ["data", "payload", payloadId] as const;

export function usePayloadDetail(payloadId: string) {
  return useQuery({
    enabled: payloadId !== "",
    gcTime: DETAIL_GC_TIME_MS,
    queryFn: () => dataApi.payloadDetail(payloadId),
    queryKey: payloadDetailKey(payloadId),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
