"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Gauge } from "@/components/charts/gauge";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { MetricValue, type WidgetRegistry } from "@/components/widgets";
import { useSectionData } from "@/features/security-dashboard/_components/section-data-provider";
import {
  type SystemHealthMetrics,
  type SystemNotification,
  computeSystemHealthMetrics,
} from "@/features/security-dashboard/domain/metrics/system-health-metrics";
import { parseHealthSnapshot } from "@/features/security-dashboard/domain/snapshot-parser";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { formatNumber, formatRelative } from "@/lib/format";

function useSystemHealthMetrics(): SystemHealthMetrics | null {
  const { detail } = useSectionData();
  return useMemo(
    () =>
      detail === null
        ? null
        : computeSystemHealthMetrics(parseHealthSnapshot(detail)),
    [detail],
  );
}

function CpuWidget() {
  const metrics = useSystemHealthMetrics();
  return <Gauge percent={metrics?.cpuPercent ?? null} />;
}

function MemoryWidget() {
  const metrics = useSystemHealthMetrics();
  return <Gauge percent={metrics?.memoryPercent ?? null} />;
}

function DiskWidget() {
  const metrics = useSystemHealthMetrics();
  return <Gauge percent={metrics?.diskPercent ?? null} />;
}

function ErrorsWidget() {
  const t = useTranslations("page.securityDashboard.states.systemHealth");
  const metrics = useSystemHealthMetrics();
  const total =
    (metrics?.parsingErrors ?? 0) + (metrics?.problemNotificationCount ?? 0);
  return (
    <MetricValue
      hint={t("errorsSubtitle")}
      value={
        <span className={total > 0 ? "text-destructive" : undefined}>
          {formatNumber(total)}
        </span>
      }
    />
  );
}

function NotificationsWidget() {
  const t = useTranslations("page.securityDashboard.states.systemHealth");
  const labels = useRelativeLabels();
  const metrics = useSystemHealthMetrics();

  const columns: TableColumn<SystemNotification>[] = [
    { header: t("colSeverity"), key: "severity", sortable: true },
    { header: t("colMessage"), key: "message" },
    { header: t("colCategory"), key: "category", sortable: true },
    {
      align: "right",
      header: t("colTime"),
      key: "timestamp",
      render: (row) =>
        row.timestamp > 0
          ? formatRelative(new Date(row.timestamp).toISOString(), labels)
          : "—",
    },
  ];

  return (
    <DataTable<SystemNotification>
      columns={columns}
      data={metrics?.notifications ?? []}
      emptyMessage={t("emptyOk")}
      getRowKey={(row) => String(row.id)}
    />
  );
}

export const SYSTEM_HEALTH_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 5, minH: 4, minW: 3, w: 4, x: 0, y: 0 },
    id: "systemHealth.cpu",
    render: () => <CpuWidget />,
    titleKey: "security.systemHealth.cpu",
  },
  {
    defaultLayout: { h: 5, minH: 4, minW: 3, w: 4, x: 4, y: 0 },
    id: "systemHealth.memory",
    render: () => <MemoryWidget />,
    titleKey: "security.systemHealth.memory",
  },
  {
    defaultLayout: { h: 5, minH: 4, minW: 3, w: 4, x: 8, y: 0 },
    id: "systemHealth.disk",
    render: () => <DiskWidget />,
    titleKey: "security.systemHealth.disk",
  },
  {
    defaultLayout: { h: 2, minH: 2, minW: 2, w: 3, x: 0, y: 5 },
    id: "systemHealth.errors",
    render: () => <ErrorsWidget />,
    titleKey: "security.systemHealth.errors",
  },
  {
    defaultLayout: { h: 7, minH: 4, minW: 6, w: 12, x: 0, y: 7 },
    id: "systemHealth.notifications",
    render: () => <NotificationsWidget />,
    titleKey: "security.systemHealth.notifications",
  },
];
