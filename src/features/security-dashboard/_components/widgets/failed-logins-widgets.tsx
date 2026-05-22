"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useSectionData } from "@/features/security-dashboard/_components/section-data-provider";
import {
  BRUTE_FORCE_THRESHOLD,
  computeFailedLoginsMetrics,
  failedLoginsTrendValue,
} from "@/features/security-dashboard/domain/metrics/failed-logins-metrics";
import type { CategoryCount } from "@/features/security-dashboard/domain/metrics/metric-utils";
import { buildTrendSeries } from "@/features/security-dashboard/domain/trend-series";
import { SEVERITY_COLORS } from "@/lib/const/severity";
import { formatNumber } from "@/lib/format";

export const FAILED_LOGINS_TREND_SNAPSHOTS = 12;

function bruteForceColor(item: CategoryCount): string | undefined {
  return item.value > BRUTE_FORCE_THRESHOLD
    ? SEVERITY_COLORS.critical
    : undefined;
}

function useFailedLoginsMetrics() {
  const { parsed } = useSectionData();
  return useMemo(() => computeFailedLoginsMetrics(parsed?.body), [parsed]);
}

function TotalWidget() {
  const t = useTranslations("page.securityDashboard.states.failedLogins");
  const metrics = useFailedLoginsMetrics();
  return (
    <MetricValue
      hint={t("totalSubtitle")}
      value={formatNumber(metrics.totalFailures)}
    />
  );
}

function AffectedWidget() {
  const t = useTranslations("page.securityDashboard.states.failedLogins");
  const metrics = useFailedLoginsMetrics();
  return (
    <MetricValue
      hint={t("affectedSubtitle")}
      value={formatNumber(metrics.affectedUsers)}
    />
  );
}

function TopUsersWidget() {
  const t = useTranslations("page.securityDashboard.states.failedLogins");
  const metrics = useFailedLoginsMetrics();
  return (
    <WidgetState
      emptyTitle={t("emptyOk")}
      isEmpty={metrics.topUsers.length === 0}
    >
      <CategoryBarChart data={metrics.topUsers} highlight={bruteForceColor} />
    </WidgetState>
  );
}

function TrendWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const { trend } = useSectionData();
  const series = useMemo(
    () => buildTrendSeries(trend, failedLoginsTrendValue),
    [trend],
  );
  return (
    <WidgetState emptyTitle={t("noTrend")} isEmpty={series.length === 0}>
      <TrendLineChart data={series} />
    </WidgetState>
  );
}

function UserDetailWidget() {
  const t = useTranslations("page.securityDashboard.states.failedLogins");
  const metrics = useFailedLoginsMetrics();

  const columns: TableColumn<CategoryCount>[] = [
    { header: t("colUser"), key: "label", sortable: true },
    {
      align: "right",
      header: t("colCount"),
      key: "value",
      render: (row) => formatNumber(row.value),
      sortable: true,
    },
  ];

  return (
    <DataTable<CategoryCount>
      columns={columns}
      data={metrics.userRows}
      emptyMessage={t("emptyOk")}
      getRowKey={(row) => row.label}
    />
  );
}

export const FAILED_LOGINS_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 },
    id: "failedLogins.total",
    render: () => <TotalWidget />,
    titleKey: "security.failedLogins.total",
  },
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 3, y: 0 },
    id: "failedLogins.affected",
    render: () => <AffectedWidget />,
    titleKey: "security.failedLogins.affected",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 0 },
    id: "failedLogins.topUsers",
    render: () => <TopUsersWidget />,
    titleKey: "security.failedLogins.topUsers",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 0, y: 2 },
    id: "failedLogins.trend",
    render: () => <TrendWidget />,
    titleKey: "security.failedLogins.trend",
  },
  {
    defaultLayout: { h: 7, minH: 4, minW: 6, w: 12, x: 0, y: 8 },
    id: "failedLogins.userDetail",
    render: () => <UserDetailWidget />,
    titleKey: "security.failedLogins.userDetail",
  },
];
