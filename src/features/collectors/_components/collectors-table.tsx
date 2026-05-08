"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { Collector } from "@/features/collectors/types/collector";
import { pageRoutes } from "@/lib/const/pages";

interface CollectorsTableProps {
  data: Collector[];
  onDelete: (collector: Collector) => void;
}

export function CollectorsTable({ data, onDelete }: CollectorsTableProps) {
  const t = useTranslations("page.collectors.table");
  const tTypes = useTranslations("page.collectors.types");
  const tCore = useTranslations("core");

  const columns: TableColumn<Collector>[] = [
    {
      header: t("name"),
      key: "name",
      render: (row) => (
        <Link
          className="font-medium text-primary hover:underline"
          href={pageRoutes.collectorDetail(row.id)}
        >
          {row.name}
        </Link>
      ),
      sortable: true,
    },
    {
      header: t("type"),
      key: "type",
      render: (row) => tTypes(row.type),
      sortable: true,
    },
    {
      header: t("natsSubject"),
      key: "natsSubject",
      sortable: true,
    },
    {
      header: t("intervalSeconds"),
      key: "intervalSeconds",
      render: (row) =>
        row.intervalSeconds === null ? "—" : `${row.intervalSeconds}s`,
      sortable: true,
    },
    {
      header: t("enabled"),
      key: "enabled",
      render: (row) => (row.enabled ? tCore("active") : tCore("inactive")),
      sortable: true,
    },
    {
      align: "right",
      header: "",
      key: "actions",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            aria-label={tCore("edit")}
            asChild={true}
            size="icon-sm"
            variant="ghost"
          >
            <Link href={pageRoutes.collectorEdit(row.id)}>
              <Pencil className="size-4" />
            </Link>
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
