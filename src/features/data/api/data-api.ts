import type {
  DataStats,
  PayloadDetail,
  PayloadListQuery,
  PayloadPage,
  SubjectStats,
} from "@/features/data/types/data";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

export const dataApi = {
  payloadDetail: async (payloadId: string): Promise<PayloadDetail> => {
    const response = await fetcher.get<PayloadDetail>(
      beApiRoutes.data.payloadDetail(payloadId),
    );
    return response.data;
  },

  payloadRawUrl: (payloadId: string): string =>
    beApiRoutes.data.payloadRaw(payloadId),

  payloads: async (query: PayloadListQuery = {}): Promise<PayloadPage> => {
    const response = await fetcher.get<PayloadPage>(beApiRoutes.data.payloads, {
      params: query,
    });
    return response.data;
  },

  stats: async (): Promise<DataStats> => {
    const response = await fetcher.get<DataStats>(beApiRoutes.data.stats);
    return response.data;
  },

  subjects: async (): Promise<SubjectStats[]> => {
    const response = await fetcher.get<SubjectStats[]>(
      beApiRoutes.data.subjects,
    );
    return response.data;
  },
};
