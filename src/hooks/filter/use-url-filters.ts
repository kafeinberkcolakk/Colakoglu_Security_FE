"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  type FilterItem,
  deserializeFilters,
  serializeFilters,
} from "@/lib/query";

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    return deserializeFilters(searchParams.toString());
  }, [searchParams]);

  const setFilters = useCallback(
    (next: {
      columnFilters?: FilterItem[];
      page: number;
      size: number;
      sort?: string;
    }) => {
      const query = serializeFilters(next);
      router.replace(`?${query}`, { scroll: false });
    },
    [router],
  );

  return {
    filters,
    setFilters,
  };
}
