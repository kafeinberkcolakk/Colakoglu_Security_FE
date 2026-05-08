"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { type FilterField, FilterPanel } from "@/components/ui/filter-panel";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { DlqDetailDialog } from "@/features/dlq/_components/dlq-detail-dialog";
import { DlqTable } from "@/features/dlq/_components/dlq-table";
import { useDlqList } from "@/features/dlq/hooks/use-dlq-list";
import {
  useDeleteDlq,
  useRetryDlq,
} from "@/features/dlq/hooks/use-dlq-mutations";
import { DLQ_CONSUMERS, type DlqEntry } from "@/features/dlq/types/dlq";

const SKELETON_ROWS = 6;

function filterEntries(
  rows: DlqEntry[],
  filters: Record<string, string>,
): DlqEntry[] {
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

export function DlqScreen() {
  const t = useTranslations("page.dlq");
  const tCore = useTranslations("core");
  const { data, isLoading } = useDlqList();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [inspecting, setInspecting] = useState<DlqEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DlqEntry | null>(null);
  const retryMutation = useRetryDlq();
  const deleteMutation = useDeleteDlq(() => setPendingDelete(null));

  const fields: FilterField[] = useMemo(
    () => [
      {
        key: "consumer",
        label: t("filter.consumer"),
        options: DLQ_CONSUMERS.map((consumer) => ({
          label: consumer,
          value: consumer,
        })),
        type: "select",
      },
      { key: "originalSubject", label: t("filter.originalSubject") },
      { key: "errorMessage", label: t("filter.errorMessage") },
    ],
    [t],
  );

  const filteredData = useMemo(
    () => filterEntries(data ?? [], filters),
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
          <DlqTable
            data={filteredData}
            onDelete={(entry) => setPendingDelete(entry)}
            onInspect={(entry) => setInspecting(entry)}
            onRetry={(entry) => retryMutation.mutate(entry.id)}
          />
        )}
      </div>

      <DlqDetailDialog
        entry={inspecting}
        onOpenChange={(open) => {
          if (!open) {
            setInspecting(null);
          }
        }}
        open={inspecting !== null}
      />

      <ConfirmDialog
        cancelLabel={tCore("cancel")}
        confirmLabel={tCore("yes")}
        description={t("delete.confirm")}
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
