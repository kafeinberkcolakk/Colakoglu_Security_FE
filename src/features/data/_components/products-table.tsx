"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import {
  freshnessClass,
  subjectFreshness,
} from "@/features/data/domain/bucket-aggregation";
import type { ProductStats } from "@/features/data/types/data";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { pageRoutes } from "@/lib/const/pages";
import { formatRelative } from "@/lib/format";

interface ProductsTableProps {
  data: ProductStats[];
}

export function ProductsTable({ data }: ProductsTableProps) {
  const t = useTranslations("page.data.products.table");
  const tCore = useTranslations("core");
  const relativeLabels = useRelativeLabels();

  const columns: TableColumn<ProductStats>[] = [
    {
      header: t("productName"),
      key: "productName",
      render: (row) => (
        <Link
          className="font-mono font-medium text-primary hover:underline"
          href={pageRoutes.dataProductDetail(row.productName)}
        >
          {row.productName}
        </Link>
      ),
      sortable: true,
    },
    {
      align: "right",
      header: t("messageCount"),
      key: "messageCount",
      sortable: true,
    },
    {
      header: t("lastReceivedAt"),
      key: "lastReceivedAt",
      render: (row) => {
        const freshness = subjectFreshness(row.lastReceivedAt);
        return (
          <span className={freshnessClass(freshness)}>
            {formatRelative(row.lastReceivedAt, relativeLabels)}
          </span>
        );
      },
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage={tCore("noData")}
      getRowKey={(row) => row.productName}
    />
  );
}
