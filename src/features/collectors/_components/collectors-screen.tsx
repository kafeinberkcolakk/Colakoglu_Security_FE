"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { type FilterField, FilterPanel } from "@/components/ui/filter-panel";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { CollectorsTable } from "@/features/collectors/_components/collectors-table";
import { useDeleteCollector } from "@/features/collectors/hooks/use-collector-mutations";
import { useCollectorsList } from "@/features/collectors/hooks/use-collectors-list";
import {
  COLLECTOR_TYPES,
  type Collector,
} from "@/features/collectors/types/collector";
import { pageRoutes } from "@/lib/const/pages";

const SKELETON_ROWS = 6;

function filterCollectors(
  rows: Collector[],
  filters: Record<string, string>,
): Collector[] {
  const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
  if (active.length === 0) {
    return rows;
  }
  return rows.filter((row) =>
    active.every(([key, value]) =>
      String((row as unknown as Record<string, unknown>)[key] ?? "")
        .toLowerCase()
        .includes(value.toLowerCase()),
    ),
  );
}

export function CollectorsScreen() {
  const t = useTranslations("page.collectors");
  const tCore = useTranslations("core");
  const tTypes = useTranslations("page.collectors.types");
  const { data, isLoading } = useCollectorsList();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Collector | null>(null);
  const deleteMutation = useDeleteCollector(() => setPendingDelete(null));

  const fields: FilterField[] = useMemo(
    () => [
      { key: "name", label: t("filter.name") },
      {
        key: "type",
        label: t("filter.type"),
        options: COLLECTOR_TYPES.map((typeOption) => ({
          label: tTypes(typeOption),
          value: typeOption,
        })),
        type: "select",
      },
      { key: "natsSubject", label: t("filter.natsSubject") },
    ],
    [t, tTypes],
  );

  const filteredData = useMemo(
    () => filterCollectors(data ?? [], filters),
    [data, filters],
  );

  return (
    <div>
      <PageHeader title={t("title")}>
        <Button asChild={true} size="sm">
          <Link href={pageRoutes.collectorNew}>
            <Plus className="size-4" />
            {t("toolbar.new")}
          </Link>
        </Button>
      </PageHeader>

      <div className="px-6 pb-6">
        <FilterPanel fields={fields} onSearch={setFilters} />

        {isLoading ? (
          <SkeletonList rows={SKELETON_ROWS} />
        ) : (
          <CollectorsTable
            data={filteredData}
            onDelete={(collector) => setPendingDelete(collector)}
          />
        )}
      </div>

      <ConfirmDialog
        cancelLabel={tCore("cancel")}
        confirmLabel={tCore("yes")}
        description={
          pendingDelete
            ? t("delete.confirm", { name: pendingDelete.name })
            : undefined
        }
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete.id);
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        open={pendingDelete !== null}
        title={t("delete.title")}
      />
    </div>
  );
}
