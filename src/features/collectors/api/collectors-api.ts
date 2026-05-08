import type {
  CollectorCreateRequest,
  CollectorUpdateRequest,
} from "@/features/collectors/services/collector-mapper";
import type {
  Collector,
  CollectorRun,
} from "@/features/collectors/types/collector";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

export const collectorsApi = {
  create: async (payload: CollectorCreateRequest): Promise<Collector> => {
    const response = await fetcher.post<Collector>(
      beApiRoutes.collector.base,
      payload,
    );
    return response.data;
  },

  detail: async (collectorId: string): Promise<Collector> => {
    const response = await fetcher.get<Collector>(
      beApiRoutes.collector.detail(collectorId),
    );
    return response.data;
  },

  list: async (): Promise<Collector[]> => {
    const response = await fetcher.get<Collector[]>(beApiRoutes.collector.base);
    return response.data;
  },

  remove: async (collectorId: string): Promise<void> => {
    await fetcher.delete(beApiRoutes.collector.detail(collectorId));
  },

  runs: async (collectorId: string, limit: number): Promise<CollectorRun[]> => {
    const response = await fetcher.get<CollectorRun[]>(
      beApiRoutes.collector.runs(collectorId),
      { params: { limit } },
    );
    return response.data;
  },

  update: async (
    collectorId: string,
    payload: CollectorUpdateRequest,
  ): Promise<Collector> => {
    const response = await fetcher.put<Collector>(
      beApiRoutes.collector.detail(collectorId),
      payload,
    );
    return response.data;
  },
};
