"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { Flow } from "@/features/flows/types/flow";
import { pageRoutes } from "@/lib/const/pages";
import { formatDate } from "@/lib/format";

interface FlowsTableProps {
  data: Flow[];
}

export function FlowsTable({ data }: FlowsTableProps) {
  const t = useTranslations("page.flows.table");
  const tCore = useTranslations("core");

  const columns: TableColumn<Flow>[] = [
    {
      header: t("name"),
      key: "name",
      render: (row) => (
        <Link
          className="font-medium text-primary hover:underline"
          href={pageRoutes.flowDetail(row.name)}
        >
          {row.name}
        </Link>
      ),
      sortable: true,
    },
    {
      header: t("endpoint"),
      key: "endpoint",
      render: (row) => (
        <span className="break-all font-mono text-xs">{row.endpoint}</span>
      ),
    },
    {
      align: "right",
      header: t("intervalSeconds"),
      key: "intervalSeconds",
      render: (row) => `${row.intervalSeconds}s`,
      sortable: true,
    },
    {
      header: t("currentStep"),
      key: "currentStep",
      render: (row) => row.currentStep ?? "—",
      sortable: true,
    },
    {
      align: "right",
      header: t("retries"),
      key: "retryCount",
      render: (row) => `${row.retryCount} / ${row.maxRetryCount}`,
      sortable: true,
    },
    {
      header: t("active"),
      key: "active",
      render: (row) => (row.active ? tCore("active") : tCore("inactive")),
      sortable: true,
    },
    {
      header: t("lastIngestedAt"),
      key: "lastIngestedAt",
      render: (row) =>
        row.lastIngestedAt === null ? "—" : formatDate(row.lastIngestedAt),
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.name}
    />
  );
}
