"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { type FilterField, FilterPanel } from "@/components/ui/filter-panel";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { FlowsTable } from "@/features/flows/_components/flows-table";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import type { Flow } from "@/features/flows/types/flow";

const SKELETON_ROWS = 4;

function filterFlows(rows: Flow[], filters: Record<string, string>): Flow[] {
  const name = filters.name?.trim().toLowerCase() ?? "";
  if (name === "") {
    return rows;
  }
  return rows.filter((row) => row.name.toLowerCase().includes(name));
}

export function FlowsScreen() {
  const t = useTranslations("page.flows");
  const { data, isLoading } = useFlowsList();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fields: FilterField[] = useMemo(
    () => [{ key: "name", label: t("filter.name") }],
    [t],
  );

  const filteredData = useMemo(
    () => filterFlows(data?.items ?? [], filters),
    [data?.items, filters],
  );

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="px-6 pb-6">
        <FilterPanel fields={fields} onSearch={setFilters} />

        {isLoading ? (
          <SkeletonList rows={SKELETON_ROWS} />
        ) : (
          <FlowsTable data={filteredData} />
        )}
      </div>
    </div>
  );
}
