import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import type { Flow } from "@/features/flows/types/flow";

export function useFlowDetail(flowName: string): {
  data: Flow | undefined;
  isLoading: boolean;
} {
  const query = useFlowsList();
  const data = query.data?.items.find((flow) => flow.name === flowName);
  return { data, isLoading: query.isLoading };
}
