import { useQuery } from "@tanstack/react-query";
import { useEnsurePaginationDefaults } from "@/hooks/filter/use-ensure-pagination-defaults";
import { useUrlFilters } from "@/hooks/filter/use-url-filters";
import { fetcher } from "@/lib/fetch/fe";
import type { ApiQueryParams, FilterItem } from "@/lib/query";
import type { ApiResponse } from "@/lib/types";

type PaginatedResponse<T> = {
  content: T[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
  page: number;
  size: number;
  sorted: boolean;
  totalElements: number;
  totalPages: number;
};

type PaginatedApiPayload<T> =
  | ApiResponse<PaginatedResponse<T>>
  | PaginatedResponse<T>;

interface UseServerSideQueryOptions {
  extraBody?: Record<string, unknown>;
  extraFilters?: FilterItem[];
  queryKey: (number | string)[];
  queryUrl: string;
}

type UseServerSideQueryKey = [...Array<number | string>, ApiQueryParams];

function isApiQueryParams(value: unknown): value is ApiQueryParams {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "page" in value && "size" in value;
}

function extractPaginatedResponse<T>(
  payload: PaginatedApiPayload<T>,
): PaginatedResponse<T> {
  if ("content" in payload) {
    return payload;
  }

  return payload.data;
}

export function useServerSideQuery<T>({
  extraBody,
  extraFilters = [],
  queryKey,
  queryUrl,
}: UseServerSideQueryOptions) {
  useEnsurePaginationDefaults();
  const { filters } = useUrlFilters();
  const page = filters.page ?? 0;
  const size = filters.size ?? 10;

  const queryState: ApiQueryParams = {
    columnFilters: filters.columnFilters ?? [],
    page,
    size,
    sort: filters.sort,
  };

  const queryResult = useQuery<
    PaginatedResponse<T>,
    Error,
    PaginatedResponse<T>,
    UseServerSideQueryKey
  >({
    queryFn: async ({ queryKey: fullQueryKey }) => {
      const queryParams = fullQueryKey.at(-1);

      if (!isApiQueryParams(queryParams)) {
        throw new Error("Invalid server-side query parameters.");
      }

      const response = await fetcher.post<PaginatedApiPayload<T>>(queryUrl, {
        columnFilters: [...queryParams.columnFilters, ...extraFilters],
        page: queryParams.page,
        size: queryParams.size,
        sort: queryParams.sort,
        ...extraBody,
      });

      return extractPaginatedResponse(response.data);
    },
    queryKey: [...queryKey, queryState],
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    ...queryResult,
    data: queryResult.data?.content,
    totalElements: queryResult.data?.totalElements,
    totalPages: queryResult.data?.totalPages,
  };
}
