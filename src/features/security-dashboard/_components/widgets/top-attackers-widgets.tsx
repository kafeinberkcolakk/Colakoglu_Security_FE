"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useSectionData } from "@/features/security-dashboard/_components/section-data-provider";
import {
  computeTopAttackersMetrics,
  topAttackersTrendValue,
} from "@/features/security-dashboard/domain/metrics/top-attackers-metrics";
import { buildTrendSeries } from "@/features/security-dashboard/domain/trend-series";
import { formatNumber } from "@/lib/format";

export const TOP_ATTACKERS_TREND_SNAPSHOTS = 12;

function useTopAttackersMetrics() {
  const { parsed } = useSectionData();
  return useMemo(() => computeTopAttackersMetrics(parsed?.body), [parsed]);
}

function TotalWidget() {
  const t = useTranslations("page.securityDashboard.states.topAttackers");
  const metrics = useTopAttackersMetrics();
  return (
    <MetricValue
      hint={t("totalSubtitle")}
      value={formatNumber(metrics.totalEvents)}
    />
  );
}

function DistinctWidget() {
  const t = useTranslations("page.securityDashboard.states.topAttackers");
  const metrics = useTopAttackersMetrics();
  return (
    <MetricValue
      hint={t("distinctSubtitle")}
      value={formatNumber(metrics.distinctIps)}
    />
  );
}

function TopIpsWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useTopAttackersMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.topIps.length === 0}
    >
      <CategoryBarChart data={metrics.topIps} />
    </WidgetState>
  );
}

function TrendWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const { trend } = useSectionData();
  const series = useMemo(
    () => buildTrendSeries(trend, topAttackersTrendValue),
    [trend],
  );
  return (
    <WidgetState emptyTitle={t("noTrend")} isEmpty={series.length === 0}>
      <TrendLineChart data={series} />
    </WidgetState>
  );
}

export const TOP_ATTACKERS_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 },
    id: "topAttackers.total",
    render: () => <TotalWidget />,
    titleKey: "security.topAttackers.total",
  },
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 3, y: 0 },
    id: "topAttackers.distinct",
    render: () => <DistinctWidget />,
    titleKey: "security.topAttackers.distinct",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 0 },
    id: "topAttackers.topIps",
    render: () => <TopIpsWidget />,
    titleKey: "security.topAttackers.topIps",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 0, y: 2 },
    id: "topAttackers.trend",
    render: () => <TrendWidget />,
    titleKey: "security.topAttackers.trend",
  },
];
