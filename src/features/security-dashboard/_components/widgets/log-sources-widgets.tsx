"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { DistributionPieChart } from "@/components/charts/distribution-pie-chart";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useSectionData } from "@/features/security-dashboard/_components/section-data-provider";
import {
  type LogSourceRow,
  computeLogSourcesMetrics,
} from "@/features/security-dashboard/domain/metrics/log-sources-metrics";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { HEALTH_COLORS } from "@/lib/const/severity";
import { formatNumber, formatRelative } from "@/lib/format";

function useLogSourcesMetrics() {
  const { parsed } = useSectionData();
  return useMemo(() => computeLogSourcesMetrics(parsed?.body), [parsed]);
}

function TotalWidget() {
  const t = useTranslations("page.securityDashboard.states.logSources");
  const metrics = useLogSourcesMetrics();
  return (
    <MetricValue
      hint={t("totalSubtitle")}
      value={formatNumber(metrics.total)}
    />
  );
}

function UnhealthyWidget() {
  const t = useTranslations("page.securityDashboard.states.logSources");
  const metrics = useLogSourcesMetrics();
  const isCritical = metrics.unhealthyCount > 0;
  return (
    <MetricValue
      hint={t("unhealthySubtitle")}
      value={
        <span className={isCritical ? "text-destructive" : undefined}>
          {formatNumber(metrics.unhealthyCount)}
        </span>
      }
    />
  );
}

function ActiveVsInactiveWidget() {
  const t = useTranslations("page.securityDashboard");
  const tState = useTranslations("page.securityDashboard.states.logSources");
  const metrics = useLogSourcesMetrics();
  const data = [
    {
      color: HEALTH_COLORS.healthy,
      label: tState("active"),
      value: metrics.activeCount,
    },
    {
      color: HEALTH_COLORS.unknown,
      label: tState("inactive"),
      value: metrics.inactiveCount,
    },
  ];
  return (
    <WidgetState
      emptyTitle={t("section.noDataTitle")}
      isEmpty={metrics.total === 0}
    >
      <DistributionPieChart data={data} />
    </WidgetState>
  );
}

function TypeDistributionWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useLogSourcesMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.typeDistribution.length === 0}
    >
      <CategoryBarChart data={metrics.typeDistribution} />
    </WidgetState>
  );
}

function TopEpsWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useLogSourcesMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.topEps.length === 0}
    >
      <CategoryBarChart data={metrics.topEps} />
    </WidgetState>
  );
}

function SourceListWidget() {
  const t = useTranslations("page.securityDashboard");
  const tState = useTranslations("page.securityDashboard.states.logSources");
  const labels = useRelativeLabels();
  const metrics = useLogSourcesMetrics();

  const columns: TableColumn<LogSourceRow>[] = [
    { header: tState("colName"), key: "name", sortable: true },
    { header: tState("colType"), key: "typeName" },
    {
      header: tState("colEnabled"),
      key: "enabled",
      render: (row) => (row.enabled ? tState("active") : tState("inactive")),
      sortable: true,
    },
    {
      header: tState("colLastEvent"),
      key: "lastEventTime",
      render: (row) =>
        row.lastEventTime > 0
          ? formatRelative(new Date(row.lastEventTime).toISOString(), labels)
          : "—",
    },
    {
      align: "right",
      header: tState("colEps"),
      key: "averageEps",
      render: (row) => formatNumber(row.averageEps),
      sortable: true,
    },
  ];

  return (
    <DataTable<LogSourceRow>
      columns={columns}
      data={metrics.rows}
      emptyMessage={t("section.noDataTitle")}
      getRowKey={(row) => row.name}
    />
  );
}

export const LOG_SOURCES_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 },
    id: "logSources.total",
    render: () => <TotalWidget />,
    titleKey: "security.logSources.total",
  },
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 3, y: 0 },
    id: "logSources.unhealthy",
    render: () => <UnhealthyWidget />,
    titleKey: "security.logSources.unhealthy",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 0 },
    id: "logSources.activeVsInactive",
    render: () => <ActiveVsInactiveWidget />,
    titleKey: "security.logSources.activeVsInactive",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 0, y: 2 },
    id: "logSources.typeDistribution",
    render: () => <TypeDistributionWidget />,
    titleKey: "security.logSources.typeDistribution",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 6 },
    id: "logSources.topEps",
    render: () => <TopEpsWidget />,
    titleKey: "security.logSources.topEps",
  },
  {
    defaultLayout: { h: 7, minH: 4, minW: 6, w: 12, x: 0, y: 12 },
    id: "logSources.sourceList",
    render: () => <SourceListWidget />,
    titleKey: "security.logSources.sourceList",
  },
];
