"use client";

import { Eye, RefreshCw, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { DlqEntry } from "@/features/dlq/types/dlq";
import { formatDate } from "@/lib/format";

interface DlqTableProps {
  data: DlqEntry[];
  onDelete: (entry: DlqEntry) => void;
  onInspect: (entry: DlqEntry) => void;
  onRetry: (entry: DlqEntry) => void;
}

const ERROR_PREVIEW_CHARS = 80;

function previewError(message: string): string {
  if (message.length <= ERROR_PREVIEW_CHARS) {
    return message;
  }
  return `${message.slice(0, ERROR_PREVIEW_CHARS)}…`;
}

export function DlqTable({
  data,
  onDelete,
  onInspect,
  onRetry,
}: DlqTableProps) {
  const t = useTranslations("page.dlq.table");
  const tCore = useTranslations("core");

  const columns: TableColumn<DlqEntry>[] = [
    {
      header: t("occurredAt"),
      key: "occurredAt",
      render: (row) => formatDate(row.occurredAt),
      sortable: true,
    },
    {
      header: t("consumer"),
      key: "consumer",
      sortable: true,
    },
    {
      header: t("originalSubject"),
      key: "originalSubject",
      sortable: true,
    },
    {
      header: t("errorMessage"),
      key: "errorMessage",
      render: (row) => previewError(row.errorMessage),
    },
    {
      align: "right",
      header: t("retryCount"),
      key: "retryCount",
      sortable: true,
    },
    {
      align: "right",
      header: "",
      key: "actions",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            aria-label={tCore("detail")}
            onClick={() => onInspect(row)}
            size="icon-sm"
            variant="ghost"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            aria-label={tCore("update")}
            onClick={() => onRetry(row)}
            size="icon-sm"
            variant="ghost"
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            aria-label={tCore("close")}
            onClick={() => onDelete(row)}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.id}
    />
  );
}
