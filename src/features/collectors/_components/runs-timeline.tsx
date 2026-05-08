"use client";

import { useTranslations } from "next-intl";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { CollectorRun } from "@/features/collectors/types/collector";
import { formatDate } from "@/lib/format";

interface RunsTimelineProps {
  runs: CollectorRun[];
}

export function RunsTimeline({ runs }: RunsTimelineProps) {
  const t = useTranslations("page.collectors.detail.runs");
  const tCore = useTranslations("core");
  const tTrigger = useTranslations("page.collectors.triggerTypes");

  const columns: TableColumn<CollectorRun>[] = [
    {
      header: t("startedAt"),
      key: "startedAt",
      render: (row) => formatDate(row.startedAt),
      sortable: true,
    },
    {
      header: t("triggerType"),
      key: "triggerType",
      render: (row) => tTrigger(row.triggerType),
      sortable: true,
    },
    {
      header: t("status"),
      key: "success",
      render: (row) => {
        if (row.completedAt === null) {
          return <span className="text-amber-500">{t("statusRunning")}</span>;
        }
        return row.success ? (
          <span className="text-emerald-500">{t("statusSuccess")}</span>
        ) : (
          <span className="text-destructive">{t("statusFailed")}</span>
        );
      },
      sortable: true,
    },
    {
      align: "right",
      header: t("durationMs"),
      key: "durationMs",
      render: (row) => (row.durationMs === null ? "—" : `${row.durationMs} ms`),
      sortable: true,
    },
    {
      align: "right",
      header: t("messagesPublished"),
      key: "messagesPublished",
      sortable: true,
    },
    {
      header: t("errorMessage"),
      key: "errorMessage",
      render: (row) => row.errorMessage ?? "—",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={runs}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.id}
    />
  );
}
