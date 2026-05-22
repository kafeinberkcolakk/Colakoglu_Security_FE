"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { DistributionPieChart } from "@/components/charts/distribution-pie-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useSectionData } from "@/features/security-dashboard/_components/section-data-provider";
import { SeverityBadge } from "@/features/security-dashboard/_components/severity-badge";
import {
  type OffenseRow,
  computeOffensesMetrics,
  offensesTrendValue,
} from "@/features/security-dashboard/domain/metrics/offenses-metrics";
import { buildTrendSeries } from "@/features/security-dashboard/domain/trend-series";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { SEVERITY_COLORS, type SeverityBucket } from "@/lib/const/severity";
import { formatNumber, formatRelative } from "@/lib/format";

export const OFFENSES_TREND_SNAPSHOTS = 24;

function useOffensesMetrics() {
  const { parsed } = useSectionData();
  return useMemo(() => computeOffensesMetrics(parsed?.body), [parsed]);
}

function OpenCountWidget() {
  const t = useTranslations("page.securityDashboard.states.offenses");
  const metrics = useOffensesMetrics();
  return (
    <MetricValue
      hint={t("openCountSubtitle")}
      value={formatNumber(metrics.openCount)}
    />
  );
}

function CriticalCountWidget() {
  const t = useTranslations("page.securityDashboard.states.offenses");
  const metrics = useOffensesMetrics();
  const isCritical = metrics.criticalCount > 0;
  return (
    <MetricValue
      hint={t("criticalCountSubtitle")}
      value={
        <span className={isCritical ? "text-destructive" : undefined}>
          {formatNumber(metrics.criticalCount)}
        </span>
      }
    />
  );
}

function MagnitudeDistWidget() {
  const t = useTranslations("page.securityDashboard");
  const metrics = useOffensesMetrics();
  const data = metrics.magnitudeDistribution.map((item) => ({
    color: SEVERITY_COLORS[item.label as SeverityBucket],
    label: t(`severity.${item.label}`),
    value: item.value,
  }));
  return (
    <WidgetState
      emptyTitle={t("states.offenses.emptyOk")}
      isEmpty={metrics.total === 0}
    >
      <DistributionPieChart data={data} />
    </WidgetState>
  );
}

function TopSourcesWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useOffensesMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.topSources.length === 0}
    >
      <CategoryBarChart data={metrics.topSources} />
    </WidgetState>
  );
}

function TrendWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const { trend } = useSectionData();
  const series = useMemo(
    () => buildTrendSeries(trend, offensesTrendValue),
    [trend],
  );
  return (
    <WidgetState emptyTitle={t("noTrend")} isEmpty={series.length === 0}>
      <TrendLineChart data={series} />
    </WidgetState>
  );
}

function RecentWidget() {
  const t = useTranslations("page.securityDashboard.states.offenses");
  const labels = useRelativeLabels();
  const metrics = useOffensesMetrics();

  const columns: TableColumn<OffenseRow>[] = [
    {
      align: "center",
      header: t("colSeverity"),
      key: "severity",
      render: (row) => <SeverityBadge score={row.severity} />,
    },
    { header: t("colDescription"), key: "description" },
    { header: t("colStatus"), key: "status", sortable: true },
    { header: t("colSource"), key: "offenseSource" },
    {
      align: "right",
      header: t("colUpdated"),
      key: "lastUpdatedTime",
      render: (row) =>
        formatRelative(new Date(row.lastUpdatedTime).toISOString(), labels),
    },
  ];

  return (
    <DataTable<OffenseRow>
      columns={columns}
      data={metrics.recent}
      emptyMessage={t("emptyOk")}
      getRowKey={(row) => String(row.id)}
    />
  );
}

export const OFFENSES_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 },
    id: "offenses.openCount",
    render: () => <OpenCountWidget />,
    titleKey: "security.offenses.openCount",
  },
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 3, y: 0 },
    id: "offenses.criticalCount",
    render: () => <CriticalCountWidget />,
    titleKey: "security.offenses.criticalCount",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 0 },
    id: "offenses.magnitudeDist",
    render: () => <MagnitudeDistWidget />,
    titleKey: "security.offenses.magnitudeDist",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 0, y: 2 },
    id: "offenses.topSources",
    render: () => <TopSourcesWidget />,
    titleKey: "security.offenses.topSources",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 6 },
    id: "offenses.trend",
    render: () => <TrendWidget />,
    titleKey: "security.offenses.trend",
  },
  {
    defaultLayout: { h: 7, minH: 4, minW: 6, w: 12, x: 0, y: 12 },
    id: "offenses.recent",
    render: () => <RecentWidget />,
    titleKey: "security.offenses.recent",
  },
];
