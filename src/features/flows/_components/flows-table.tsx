"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import type { Flow } from "@/features/flows/types/flow";
import { pageRoutes } from "@/lib/const/pages";

interface FlowsTableProps {
  data: Flow[];
  onDelete: (flow: Flow) => void;
}

export function FlowsTable({ data, onDelete }: FlowsTableProps) {
  const t = useTranslations("page.flows.table");
  const tTypes = useTranslations("page.flows.types");
  const tCore = useTranslations("core");

  const columns: TableColumn<Flow>[] = [
    {
      header: t("name"),
      key: "name",
      render: (row) => (
        <Link
          className="font-medium text-primary hover:underline"
          href={pageRoutes.flowDetail(row.id)}
        >
          {row.name}
        </Link>
      ),
      sortable: true,
    },
    {
      header: t("type"),
      key: "flowId",
      render: (row) => tTypes(row.flowId),
      sortable: true,
    },
    {
      header: t("cronExpression"),
      key: "cronExpression",
      render: (row) => row.cronExpression ?? "—",
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
            <Link href={pageRoutes.flowEdit(row.id)}>
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
      getRowKey={(row) => String(row.id)}
    />
  );
}
