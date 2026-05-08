import type { DlqEntry } from "@/features/dlq/types/dlq";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

export const dlqApi = {
  detail: async (dlqId: string): Promise<DlqEntry> => {
    const response = await fetcher.get<DlqEntry>(beApiRoutes.dlq.detail(dlqId));
    return response.data;
  },

  list: async (limit: number): Promise<DlqEntry[]> => {
    const response = await fetcher.get<DlqEntry[]>(beApiRoutes.dlq.base, {
      params: { limit },
    });
    return response.data;
  },

  remove: async (dlqId: string): Promise<void> => {
    await fetcher.delete(beApiRoutes.dlq.detail(dlqId));
  },

  retry: async (dlqId: string): Promise<DlqEntry> => {
    const response = await fetcher.post<DlqEntry>(beApiRoutes.dlq.retry(dlqId));
    return response.data;
  },
};
