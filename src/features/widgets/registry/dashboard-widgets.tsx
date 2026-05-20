"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  BUCKET_CHART_TYPES,
  BucketChart,
  type BucketChartType,
} from "@/components/charts/bucket-chart";
import { ChartTypePicker } from "@/components/charts/chart-type-picker";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useDashboardAggregates } from "@/features/dashboard/hooks/use-dashboard-aggregates";
import { ProductFlowGrid } from "@/features/data/_components/product-flow-grid";
import { ProductsTable } from "@/features/data/_components/products-table";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { aggregateProducts } from "@/features/data/domain/product-aggregation";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";

const TABLE_OVERFLOW_THRESHOLD = 6;

function TotalMessagesWidget() {
  const t = useTranslations("page.dashboard.cards");
  const { data, isLoading } = useDashboardAggregates();
  return (
    <WidgetState isLoading={isLoading}>
      <MetricValue
        hint={t("totalSubtitle")}
        value={data?.stats.totalMessages ?? 0}
      />
    </WidgetState>
  );
}

function Last24hWidget() {
  const t = useTranslations("page.dashboard.cards");
  const { data, isLoading } = useDashboardAggregates();
  return (
    <WidgetState isLoading={isLoading}>
      <MetricValue
        hint={t("last24hSubtitle")}
        value={data?.stats.messagesLast24h ?? 0}
      />
    </WidgetState>
  );
}

function ActiveFlowsWidget() {
  const t = useTranslations("page.dashboard.cards");
  const flowsQuery = useFlowsList();
  const items = useMemo(
    () => flowsQuery.data?.items ?? [],
    [flowsQuery.data?.items],
  );
  const activeCount = useMemo(
    () => items.filter((flow) => flow.active).length,
    [items],
  );
  return (
    <WidgetState isLoading={flowsQuery.isLoading}>
      <MetricValue
        hint={t("activeFlowsSubtitle", { total: items.length })}
        value={activeCount}
      />
    </WidgetState>
  );
}

function MessageFlowWidget({ isMaximized }: { isMaximized: boolean }) {
  const { data, isLoading } = useDashboardAggregates();
  const [chartType, setChartType] = useState<BucketChartType>("area");
  const buckets = useMemo(
    () => bucketByHour(data?.payloadsLast24h ?? []),
    [data?.payloadsLast24h],
  );
  return (
    <WidgetState isEmpty={buckets.length === 0} isLoading={isLoading}>
      <div className="flex h-full flex-col gap-2">
        {isMaximized && (
          <div className="flex justify-end">
            <ChartTypePicker
              onChange={setChartType}
              types={BUCKET_CHART_TYPES}
              value={chartType}
            />
          </div>
        )}
        <div className="min-h-0 flex-1">
          <BucketChart data={buckets} type={chartType} />
        </div>
      </div>
    </WidgetState>
  );
}

function ProductFlowWidget() {
  const { data, isLoading } = useDashboardAggregates();
  const payloads = useMemo(
    () => data?.payloadsLast24h ?? [],
    [data?.payloadsLast24h],
  );
  const products = useMemo(() => aggregateProducts(payloads), [payloads]);
  return (
    <WidgetState isEmpty={products.length === 0} isLoading={isLoading}>
      <ProductFlowGrid payloads={payloads} />
    </WidgetState>
  );
}

function ProductsTableWidget() {
  const { data, isLoading } = useDashboardAggregates();
  const overflowProducts = useMemo(
    () =>
      aggregateProducts(data?.payloadsLast24h ?? []).slice(
        TABLE_OVERFLOW_THRESHOLD,
      ),
    [data?.payloadsLast24h],
  );
  return (
    <WidgetState isEmpty={overflowProducts.length === 0} isLoading={isLoading}>
      <ProductsTable data={overflowProducts} />
    </WidgetState>
  );
}

export const DASHBOARD_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, w: 4, x: 0, y: 0 },
    id: "dashboard.totalMessages",
    render: () => <TotalMessagesWidget />,
    titleKey: "dashboard.totalMessages",
  },
  {
    defaultLayout: { h: 2, w: 4, x: 4, y: 0 },
    id: "dashboard.last24h",
    render: () => <Last24hWidget />,
    titleKey: "dashboard.last24h",
  },
  {
    defaultLayout: { h: 2, w: 4, x: 8, y: 0 },
    id: "dashboard.activeFlows",
    render: () => <ActiveFlowsWidget />,
    titleKey: "dashboard.activeFlows",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 6, w: 12, x: 0, y: 2 },
    id: "dashboard.messageFlow",
    render: (ctx) => <MessageFlowWidget isMaximized={ctx.isMaximized} />,
    titleKey: "dashboard.messageFlow",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 6, w: 12, x: 0, y: 8 },
    id: "dashboard.productFlow",
    render: () => <ProductFlowWidget />,
    titleKey: "dashboard.productFlow",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 6, w: 12, x: 0, y: 13 },
    id: "dashboard.productsTable",
    render: () => <ProductsTableWidget />,
    titleKey: "dashboard.productsTable",
  },
];
