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
import { FlowsTable } from "@/features/flows/_components/flows-table";
import { useDeleteFlow } from "@/features/flows/hooks/use-flow-mutations";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import { FLOW_IDS, type Flow } from "@/features/flows/types/flow";
import { pageRoutes } from "@/lib/const/pages";

const SKELETON_ROWS = 6;
const FLOWS_PAGE_LIMIT = 200;

function filterFlows(rows: Flow[], filters: Record<string, string>): Flow[] {
  const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
  if (active.length === 0) {
    return rows;
  }
  return rows.filter((row) =>
    active.every(([key, value]) => {
      const raw = (row as unknown as Record<string, unknown>)[key];
      return String(raw ?? "")
        .toLowerCase()
        .includes(value.toLowerCase());
    }),
  );
}

export function FlowsScreen() {
  const t = useTranslations("page.flows");
  const tCore = useTranslations("core");
  const tTypes = useTranslations("page.flows.types");
  const { data, isLoading } = useFlowsList({ limit: FLOWS_PAGE_LIMIT });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<Flow | null>(null);
  const deleteMutation = useDeleteFlow(() => setPendingDelete(null));

  const fields: FilterField[] = useMemo(
    () => [
      { key: "name", label: t("filter.name") },
      {
        key: "flowId",
        label: t("filter.type"),
        options: FLOW_IDS.map((flowIdOption) => ({
          label: tTypes(flowIdOption),
          value: flowIdOption,
        })),
        type: "select",
      },
    ],
    [t, tTypes],
  );

  const filteredData = useMemo(
    () => filterFlows(data?.items ?? [], filters),
    [data?.items, filters],
  );

  return (
    <div>
      <PageHeader title={t("title")}>
        <Button asChild={true} size="sm">
          <Link href={pageRoutes.flowNew}>
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
          <FlowsTable
            data={filteredData}
            onDelete={(flow) => setPendingDelete(flow)}
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
