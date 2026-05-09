import type {
  CreateFlowRequest,
  UpdateFlowRequest,
} from "@/features/flows/services/flow-mapper";
import type {
  Flow,
  FlowList,
  FlowListQuery,
  FlowRun,
} from "@/features/flows/types/flow";
import { beApiRoutes } from "@/lib/const/pages";
import { fetcher } from "@/lib/fetch/fe";

const DEFAULT_LIMIT = 50;
const DETAIL_SEARCH_LIMIT = 200;

interface FlowsListWireQuery {
  flowId?: string;
  includeDeleted?: boolean;
  limit: number;
  name?: string;
  offset: number;
}

function toWireQuery(query: FlowListQuery): FlowsListWireQuery {
  const params: FlowsListWireQuery = {
    limit: query.limit ?? DEFAULT_LIMIT,
    offset: query.offset ?? 0,
  };
  if (query.flowId !== undefined) {
    params.flowId = query.flowId;
  }
  if (query.name !== undefined) {
    params.name = query.name;
  }
  if (query.includeDeleted !== undefined) {
    params.includeDeleted = query.includeDeleted;
  }
  return params;
}

export const flowsApi = {
  create: async (payload: CreateFlowRequest): Promise<{ id: number }> => {
    const response = await fetcher.post<{ id: number }>(
      beApiRoutes.flow.schedulerRoot,
      payload,
    );
    return response.data;
  },

  detail: async (id: number): Promise<Flow | null> => {
    const response = await fetcher.get<FlowList>(beApiRoutes.flow.list, {
      params: { includeDeleted: true, limit: DETAIL_SEARCH_LIMIT, offset: 0 },
    });
    return response.data.items.find((flow) => flow.id === id) ?? null;
  },

  list: async (query: FlowListQuery = {}): Promise<FlowList> => {
    const response = await fetcher.get<FlowList>(beApiRoutes.flow.list, {
      params: toWireQuery(query),
    });
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await fetcher.delete(beApiRoutes.flow.schedulerById(id));
  },

  run: async (id: number): Promise<void> => {
    await fetcher.post(beApiRoutes.flow.schedulerRun(id));
  },

  runs: async (id: number, limit: number): Promise<FlowRun[]> => {
    const response = await fetcher.get<FlowRun[]>(beApiRoutes.flow.runs(id), {
      params: { limit },
    });
    return response.data;
  },

  setEnabled: async (id: number, enabled: boolean): Promise<void> => {
    await fetcher.put(beApiRoutes.flow.schedulerEnabled(id), { enabled });
  },

  update: async (payload: UpdateFlowRequest): Promise<void> => {
    await fetcher.put(beApiRoutes.flow.schedulerRoot, payload);
  },
};
