"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { type FilterField, FilterPanel } from "@/components/ui/filter-panel";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { SubjectsTable } from "@/features/data/_components/subjects-table";
import { useSubjects } from "@/features/data/hooks/use-subjects";
import type { SubjectStats } from "@/features/data/types/data";

const SKELETON_ROWS = 6;

function filterSubjects(
  rows: SubjectStats[],
  filters: Record<string, string>,
): SubjectStats[] {
  const search = filters.subject?.trim().toLowerCase() ?? "";
  if (search === "") {
    return rows;
  }
  return rows.filter((row) => row.subject.toLowerCase().includes(search));
}

export function SubjectsScreen() {
  const t = useTranslations("page.data.subjects");
  const { data, isLoading } = useSubjects();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fields: FilterField[] = useMemo(
    () => [{ key: "subject", label: t("filter.subject") }],
    [t],
  );

  const filteredData = useMemo(
    () => filterSubjects(data ?? [], filters),
    [data, filters],
  );

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="px-6 pb-6">
        <FilterPanel fields={fields} onSearch={setFilters} />

        {isLoading ? (
          <SkeletonList rows={SKELETON_ROWS} />
        ) : (
          <SubjectsTable data={filteredData} />
        )}
      </div>
    </div>
  );
}
