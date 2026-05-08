import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";

export const payloadDetailKey = (payloadId: string) =>
  ["data", "payload", payloadId] as const;

export function usePayloadDetail(payloadId: string) {
  return useQuery({
    enabled: payloadId !== "",
    queryFn: () => dataApi.payloadDetail(payloadId),
    queryKey: payloadDetailKey(payloadId),
  });
}
