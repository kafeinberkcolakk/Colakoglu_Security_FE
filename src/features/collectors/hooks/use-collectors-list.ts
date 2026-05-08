import { useQuery } from "@tanstack/react-query";
import { collectorsApi } from "@/features/collectors/api/collectors-api";

export const COLLECTORS_LIST_KEY = ["collectors", "list"] as const;

export function useCollectorsList() {
  return useQuery({
    queryFn: () => collectorsApi.list(),
    queryKey: COLLECTORS_LIST_KEY,
  });
}
