"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  MetricValue,
  type WidgetRegistry,
  WidgetState,
} from "@/components/widgets";
import { useDashboardAggregates } from "@/features/dashboard/hooks/use-dashboard-aggregates";
import { MessageFlowChart } from "@/features/data/_components/message-flow-chart";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import { DlqSparkline } from "@/features/reports/_components/dlq-sparkline";
import { bucketDlqByHour } from "@/features/reports/domain/dlq-bucket";

const FLOWS_LIMIT = 200;

function TotalCard() {
  const t = useTranslations("page.reports.system.cards");
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

function Last24hCard() {
  const t = useTranslations("page.reports.system.cards");
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

function SubjectsCard() {
  const t = useTranslations("page.reports.system.cards");
  const { data, isLoading } = useDashboardAggregates();
  return (
    <WidgetState isLoading={isLoading}>
      <MetricValue
        hint={t("subjectsSubtitle")}
        value={data?.stats.distinctSubjects ?? 0}
      />
    </WidgetState>
  );
}

function ActiveFlowsCard() {
  const t = useTranslations("page.reports.system.cards");
  const flowsQuery = useFlowsList({ limit: FLOWS_LIMIT });
  const activeFlowCount = useMemo(
    () => (flowsQuery.data?.items ?? []).filter((flow) => flow.enabled).length,
    [flowsQuery.data?.items],
  );
  return (
    <WidgetState isLoading={flowsQuery.isLoading}>
      <MetricValue hint={t("activeFlowsSubtitle")} value={activeFlowCount} />
    </WidgetState>
  );
}

function DlqCard() {
  const t = useTranslations("page.reports.system.cards");
  const { data, isLoading } = useDashboardAggregates();
  const dlqCount = data?.dlqCount ?? 0;
  return (
    <WidgetState isLoading={isLoading}>
      <MetricValue
        hint={dlqCount === 0 ? t("dlqHealthy") : t("dlqNeedsAttention")}
        value={dlqCount}
      />
    </WidgetState>
  );
}

function MessageFlowChartWidget() {
  const { data, isLoading } = useDashboardAggregates();
  const buckets = useMemo(
    () => bucketByHour(data?.payloadsLast24h ?? []),
    [data?.payloadsLast24h],
  );
  return (
    <WidgetState isEmpty={buckets.length === 0} isLoading={isLoading}>
      <MessageFlowChart data={buckets} />
    </WidgetState>
  );
}

function DlqTrendWidget() {
  const { data, isLoading } = useDashboardAggregates();
  const dlqBuckets = useMemo(
    () => bucketDlqByHour(data?.recentDlq ?? []),
    [data?.recentDlq],
  );
  return (
    <WidgetState
      isEmpty={dlqBuckets.every((b) => b.count === 0)}
      isLoading={isLoading}
    >
      <DlqSparkline buckets={dlqBuckets} />
    </WidgetState>
  );
}

export const SYSTEM_REPORTS_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 2, w: 3, x: 0, y: 0 },
    id: "system.total",
    render: () => <TotalCard />,
    titleKey: "system.total",
  },
  {
    defaultLayout: { h: 2, w: 3, x: 3, y: 0 },
    id: "system.last24h",
    render: () => <Last24hCard />,
    titleKey: "system.last24h",
  },
  {
    defaultLayout: { h: 2, w: 2, x: 6, y: 0 },
    id: "system.subjects",
    render: () => <SubjectsCard />,
    titleKey: "system.subjects",
  },
  {
    defaultLayout: { h: 2, w: 2, x: 8, y: 0 },
    id: "system.activeFlows",
    render: () => <ActiveFlowsCard />,
    titleKey: "system.activeFlows",
  },
  {
    defaultLayout: { h: 2, w: 2, x: 10, y: 0 },
    id: "system.dlq",
    render: () => <DlqCard />,
    titleKey: "system.dlq",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 6, w: 8, x: 0, y: 2 },
    id: "system.messageFlow",
    render: () => <MessageFlowChartWidget />,
    titleKey: "system.messageFlow",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 4, w: 4, x: 8, y: 2 },
    id: "system.dlqTrend",
    render: () => <DlqTrendWidget />,
    titleKey: "system.dlqTrend",
  },
];
