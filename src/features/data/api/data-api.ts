import {
  fromWireDetail,
  fromWireList,
  fromWireStats,
  fromWireSubject,
} from "@/features/data/services/data-mapper";
import type {
  DataStats,
  PayloadDetail,
  PayloadListQuery,
  PayloadPage,
  SubjectStats,
  WireDataStats,
  WirePayloadDetail,
  WirePayloadListResponse,
  WireSubjectStats,
} from "@/features/data/types/data";
import { DEFAULT_PAYLOAD_PAGE_SIZE } from "@/lib/const/intervals";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

const DEFAULT_SUBJECTS_LIMIT = 100;

interface PayloadsWireQuery {
  limit: number;
  offset: number;
  productName?: string;
  since?: string;
  subject?: string;
}

function toWireQuery(query: PayloadListQuery): PayloadsWireQuery {
  const size = query.size ?? DEFAULT_PAYLOAD_PAGE_SIZE;
  const page = query.page ?? 0;
  const params: PayloadsWireQuery = {
    limit: size,
    offset: page * size,
  };
  if (query.subject !== undefined && query.subject !== "") {
    params.subject = query.subject;
  }
  if (query.from !== undefined && query.from !== "") {
    params.since = query.from;
  }
  if (query.productName !== undefined && query.productName !== "") {
    params.productName = query.productName;
  }
  return params;
}

export const dataApi = {
  payloadDetail: async (payloadId: string): Promise<PayloadDetail> => {
    const response = await fetcher.get<WirePayloadDetail>(
      beApiRoutes.data.payloadDetail(payloadId),
    );
    return fromWireDetail(response.data);
  },

  payloadRawUrl: (payloadId: string): string =>
    beApiRoutes.data.payloadRaw(payloadId),

  payloads: async (query: PayloadListQuery = {}): Promise<PayloadPage> => {
    const response = await fetcher.get<WirePayloadListResponse>(
      beApiRoutes.data.payloads,
      { params: toWireQuery(query) },
    );
    return fromWireList(response.data);
  },

  stats: async (): Promise<DataStats> => {
    const response = await fetcher.get<WireDataStats>(beApiRoutes.data.stats);
    return fromWireStats(response.data);
  },

  subjects: async (
    limit: number = DEFAULT_SUBJECTS_LIMIT,
  ): Promise<SubjectStats[]> => {
    const response = await fetcher.get<WireSubjectStats[]>(
      beApiRoutes.data.subjects,
      { params: { limit } },
    );
    return response.data.map(fromWireSubject);
  },
};
