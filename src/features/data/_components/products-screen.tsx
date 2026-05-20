"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { type FilterField, FilterPanel } from "@/components/ui/filter-panel";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { ProductsTable } from "@/features/data/_components/products-table";
import { aggregateProducts } from "@/features/data/domain/product-aggregation";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import type { ProductStats } from "@/features/data/types/data";
import { FLOW_CHART_BUCKET_LIMIT } from "@/lib/const/intervals";
import { SERVICE_PAYLOAD_SUBJECT } from "@/lib/const/pages";

const SKELETON_ROWS = 6;

function filterProducts(
  rows: ProductStats[],
  filters: Record<string, string>,
): ProductStats[] {
  const search = filters.productName?.trim().toLowerCase() ?? "";
  if (search === "") {
    return rows;
  }
  return rows.filter((row) => row.productName.toLowerCase().includes(search));
}

export function ProductsScreen() {
  const t = useTranslations("page.data.products");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const payloadsQuery = usePayloads({
    query: {
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject: SERVICE_PAYLOAD_SUBJECT,
    },
  });

  const aggregated = useMemo(
    () => aggregateProducts(payloadsQuery.data?.content ?? []),
    [payloadsQuery.data?.content],
  );
  const filtered = useMemo(
    () => filterProducts(aggregated, filters),
    [aggregated, filters],
  );

  const fields: FilterField[] = useMemo(
    () => [{ key: "productName", label: t("filter.productName") }],
    [t],
  );

  return (
    <div>
      <PageHeader title={t("title")} />
      <p className="px-6 pb-2 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="px-6 pb-6">
        <FilterPanel fields={fields} onSearch={setFilters} />

        {payloadsQuery.isLoading ? (
          <SkeletonList rows={SKELETON_ROWS} />
        ) : (
          <ProductsTable data={filtered} />
        )}
      </div>
    </div>
  );
}
