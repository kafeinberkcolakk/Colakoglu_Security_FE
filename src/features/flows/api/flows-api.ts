import type { FlowList } from "@/features/flows/types/flow";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

export const flowsApi = {
  list: async (): Promise<FlowList> => {
    const response = await fetcher.get<FlowList>(beApiRoutes.flow.list);
    return response.data;
  },
};
