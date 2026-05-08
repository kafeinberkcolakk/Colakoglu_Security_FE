import { useQuery } from "@tanstack/react-query";
import { collectorsApi } from "@/features/collectors/api/collectors-api";

export const collectorDetailKey = (collectorId: string) =>
  ["collectors", "detail", collectorId] as const;

export function useCollectorDetail(collectorId: string) {
  return useQuery({
    enabled: collectorId !== "",
    queryFn: () => collectorsApi.detail(collectorId),
    queryKey: collectorDetailKey(collectorId),
  });
}
