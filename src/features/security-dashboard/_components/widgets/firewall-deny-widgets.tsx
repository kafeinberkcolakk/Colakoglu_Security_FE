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
  type FlowPair,
  computeFirewallDenyMetrics,
  firewallDenyTrendValue,
} from "@/features/security-dashboard/domain/metrics/firewall-deny-metrics";
import { buildTrendSeries } from "@/features/security-dashboard/domain/trend-series";
import { formatNumber } from "@/lib/format";

export const FIREWALL_DENY_TREND_SNAPSHOTS = 12;

function useFirewallDenyMetrics() {
  const { parsed } = useSectionData();
  return useMemo(() => computeFirewallDenyMetrics(parsed?.body), [parsed]);
}

function TotalWidget() {
  const t = useTranslations("page.securityDashboard.states.firewallDeny");
  const metrics = useFirewallDenyMetrics();
  return (
    <MetricValue
      hint={t("totalSubtitle")}
      value={formatNumber(metrics.totalDeny)}
    />
  );
}

function TopSourcesWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useFirewallDenyMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.topSources.length === 0}
    >
      <CategoryBarChart data={metrics.topSources} />
    </WidgetState>
  );
}

function TopDestinationsWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const metrics = useFirewallDenyMetrics();
  return (
    <WidgetState
      emptyTitle={t("noDataTitle")}
      isEmpty={metrics.topDestinations.length === 0}
    >
      <CategoryBarChart data={metrics.topDestinations} />
    </WidgetState>
  );
}

function TrendWidget() {
  const t = useTranslations("page.securityDashboard.section");
  const { trend } = useSectionData();
  const series = useMemo(
    () => buildTrendSeries(trend, firewallDenyTrendValue),
    [trend],
  );
  return (
    <WidgetState emptyTitle={t("noTrend")} isEmpty={series.length === 0}>
      <TrendLineChart data={series} />
    </WidgetState>
  );
}

function FlowPairsWidget() {
  const t = useTranslations("page.securityDashboard");
  const tState = useTranslations("page.securityDashboard.states.firewallDeny");
  const metrics = useFirewallDenyMetrics();

  const columns: TableColumn<FlowPair>[] = [
    { header: tState("colSource"), key: "source" },
    { header: tState("colDestination"), key: "destination" },
    {
      align: "right",
      header: tState("colCount"),
      key: "count",
      render: (row) => formatNumber(row.count),
      sortable: true,
    },
  ];

  return (
    <DataTable<FlowPair>
      columns={columns}
      data={metrics.flowPairs}
      emptyMessage={t("section.noDataTitle")}
      getRowKey={(row) => `${row.source}>${row.destination}`}
    />
  );
}

export const FIREWALL_DENY_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 0 },
    id: "firewallDeny.total",
    render: () => <TotalWidget />,
    titleKey: "security.firewallDeny.total",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 3, y: 0 },
    id: "firewallDeny.topSources",
    render: () => <TopSourcesWidget />,
    titleKey: "security.firewallDeny.topSources",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 0, y: 2 },
    id: "firewallDeny.topDestinations",
    render: () => <TopDestinationsWidget />,
    titleKey: "security.firewallDeny.topDestinations",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 6, x: 6, y: 2 },
    id: "firewallDeny.trend",
    render: () => <TrendWidget />,
    titleKey: "security.firewallDeny.trend",
  },
  {
    defaultLayout: { h: 7, minH: 4, minW: 6, w: 12, x: 0, y: 8 },
    id: "firewallDeny.flowPairs",
    render: () => <FlowPairsWidget />,
    titleKey: "security.firewallDeny.flowPairs",
  },
];
