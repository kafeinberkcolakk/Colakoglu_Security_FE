import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import { SUBJECTS_REFETCH_INTERVAL_MS } from "@/lib/const/intervals";

export const SUBJECTS_KEY = ["data", "subjects"] as const;

export function useSubjects() {
  return useQuery({
    queryFn: () => dataApi.subjects(),
    queryKey: SUBJECTS_KEY,
    refetchInterval: SUBJECTS_REFETCH_INTERVAL_MS,
  });
}
