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
import { SubjectFlowGrid } from "@/features/data/_components/subject-flow-grid";
import { SubjectsTable } from "@/features/data/_components/subjects-table";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";

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

function DlqWidget() {
  const t = useTranslations("page.dashboard.cards");
  const { data, isLoading } = useDashboardAggregates();
  const count = data?.dlqCount ?? 0;
  return (
    <WidgetState isLoading={isLoading}>
      <MetricValue
        hint={count === 0 ? t("dlqHealthy") : t("dlqAttention")}
        value={count}
      />
    </WidgetState>
  );
}

function MessageFlowWidget() {
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

function SubjectFlowWidget() {
  const { data, isLoading } = useDashboardAggregates();
  return (
    <WidgetState
      isEmpty={(data?.subjects ?? []).length === 0}
      isLoading={isLoading}
    >
      <SubjectFlowGrid
        payloads={data?.payloadsLast24h ?? []}
        subjects={data?.subjects ?? []}
      />
    </WidgetState>
  );
}

function SubjectsTableWidget() {
  const { data, isLoading } = useDashboardAggregates();
  const overflowSubjects = useMemo(
    () => (data?.subjects ?? []).slice(TABLE_OVERFLOW_THRESHOLD),
    [data?.subjects],
  );
  return (
    <WidgetState isEmpty={overflowSubjects.length === 0} isLoading={isLoading}>
      <SubjectsTable data={overflowSubjects} />
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
    id: "dashboard.dlq",
    render: () => <DlqWidget />,
    titleKey: "dashboard.dlq",
  },
  {
    defaultLayout: { h: 6, minH: 4, minW: 6, w: 12, x: 0, y: 2 },
    id: "dashboard.messageFlow",
    render: () => <MessageFlowWidget />,
    titleKey: "dashboard.messageFlow",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 6, w: 12, x: 0, y: 8 },
    id: "dashboard.subjectFlow",
    render: () => <SubjectFlowWidget />,
    titleKey: "dashboard.subjectFlow",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 6, w: 12, x: 0, y: 13 },
    id: "dashboard.subjectsTable",
    render: () => <SubjectsTableWidget />,
    titleKey: "dashboard.subjectsTable",
  },
];
