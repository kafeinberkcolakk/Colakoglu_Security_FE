"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { PayloadSummary } from "@/features/data/types/data";
import { pageRoutes } from "@/lib/const/pages";
import { formatBytes, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface LiveFeedTableProps {
  data: PayloadSummary[];
  highlightId: string | null;
  page: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function LiveFeedTable({
  data,
  highlightId,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalElements,
}: LiveFeedTableProps) {
  const t = useTranslations("page.data.live.table");
  const tCore = useTranslations("core");

  const columns: TableColumn<PayloadSummary>[] = [
    {
      header: t("receivedAt"),
      key: "receivedAt",
      render: (row) => (
        <span
          className={cn(
            row.id === highlightId && "rounded bg-emerald-500/20 px-1.5 py-0.5",
          )}
        >
          {formatDate(row.receivedAt)}
        </span>
      ),
      sortable: true,
    },
    {
      header: t("productName"),
      key: "productName",
      render: (row) =>
        row.productName ? (
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs">
            {row.productName}
          </span>
        ) : (
          "—"
        ),
      sortable: true,
    },
    {
      align: "right",
      header: t("payloadSize"),
      key: "payloadSize",
      render: (row) => formatBytes(row.payloadSize),
      sortable: true,
    },
    {
      header: t("isJson"),
      key: "hasJson",
      render: (row) => (row.hasJson ? "JSON" : "Raw"),
      sortable: true,
    },
    {
      align: "right",
      header: "",
      key: "actions",
      render: (row) => (
        <Link
          className="text-sm font-medium text-primary hover:underline"
          href={pageRoutes.messageDetail(row.id)}
        >
          {tCore("detail")}
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.id}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      page={page}
      pageSize={pageSize}
      totalElements={totalElements}
    />
  );
}
