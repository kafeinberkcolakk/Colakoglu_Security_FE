"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import {
  BUCKET_CHART_TYPES,
  BucketChart,
  type BucketChartType,
} from "@/components/charts/bucket-chart";
import { ChartTypePicker } from "@/components/charts/chart-type-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { type WidgetRegistry, WidgetState } from "@/components/widgets";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import { useFlowDetail } from "@/features/flows/hooks/use-flow-detail";
import { FLOW_CHART_BUCKET_LIMIT } from "@/lib/const/intervals";
import { SERVICE_PAYLOAD_SUBJECT } from "@/lib/const/pages";
import { computeLast24hIso, formatDate } from "@/lib/format";

const RECENT_PAYLOADS_LIMIT = 20;

interface FlowWidgetProps {
  flowName: string;
  isMaximized?: boolean;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-all text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function InfoWidget({ flowName }: FlowWidgetProps) {
  const t = useTranslations("page.flows.detail.info");
  const tCore = useTranslations("core");
  const flowQuery = useFlowDetail(flowName);
  const flow = flowQuery.data;

  return (
    <WidgetState isLoading={flowQuery.isLoading || !flow}>
      {flow && (
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <InfoRow label={t("name")} value={flow.name} />
          <InfoRow label={t("endpoint")} value={flow.endpoint} />
          <InfoRow
            label={t("intervalSeconds")}
            value={`${flow.intervalSeconds}s`}
          />
          <InfoRow label={t("currentStep")} value={flow.currentStep ?? "—"} />
          <InfoRow
            label={t("retries")}
            value={`${flow.retryCount} / ${flow.maxRetryCount}`}
          />
          <InfoRow
            label={t("active")}
            value={flow.active ? tCore("active") : tCore("inactive")}
          />
          <InfoRow
            label={t("lastIngestedAt")}
            value={
              flow.lastIngestedAt === null
                ? "—"
                : formatDate(flow.lastIngestedAt)
            }
          />
        </dl>
      )}
    </WidgetState>
  );
}

function ProductActivityWidget({
  flowName,
  isMaximized = false,
}: FlowWidgetProps) {
  const tWidgets = useTranslations("widgets.flowDetail");
  const [chartType, setChartType] = useState<BucketChartType>("area");
  const [since] = useState(() => computeLast24hIso());
  const payloadsQuery = usePayloads({
    enabled: flowName !== "",
    query: {
      from: since,
      page: 0,
      productName: flowName,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject: SERVICE_PAYLOAD_SUBJECT,
    },
  });
  const buckets = useMemo(
    () => bucketByHour(payloadsQuery.data?.content ?? []),
    [payloadsQuery.data?.content],
  );

  return (
    <WidgetState
      emptyTitle={tWidgets("activityEmpty")}
      isEmpty={buckets.every((b) => b.count === 0)}
      isLoading={payloadsQuery.isLoading}
    >
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

function RecentMessagesWidget({ flowName }: FlowWidgetProps) {
  const tWidgets = useTranslations("widgets.flowDetail");
  const payloadsQuery = usePayloads({
    enabled: flowName !== "",
    query: {
      page: 0,
      productName: flowName,
      size: RECENT_PAYLOADS_LIMIT,
      subject: SERVICE_PAYLOAD_SUBJECT,
    },
  });
  const items = payloadsQuery.data?.content ?? [];

  return (
    <WidgetState
      emptyTitle={tWidgets("recentMessagesEmpty")}
      isEmpty={items.length === 0}
      isLoading={payloadsQuery.isLoading}
    >
      <ul className="flex flex-col gap-1.5 text-xs">
        {items.map((row) => (
          <li
            className="flex items-center justify-between gap-2 rounded border border-border/40 bg-muted/20 px-2 py-1.5"
            key={row.id}
          >
            <span
              className="truncate font-mono text-foreground"
              title={row.messageId}
            >
              {row.messageId}
            </span>
            <span className="shrink-0 text-muted-foreground">
              {new Date(row.receivedAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </WidgetState>
  );
}

function renderWithFlowName(
  Component: (props: FlowWidgetProps) => ReactElement,
  ctx: { flowName?: string; isMaximized: boolean },
): ReactElement {
  if (ctx.flowName === undefined) {
    return <Skeleton className="h-full w-full" />;
  }
  return <Component flowName={ctx.flowName} isMaximized={ctx.isMaximized} />;
}

export const FLOW_DETAIL_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 4, minH: 3, w: 12, x: 0, y: 0 },
    id: "flowDetail.info",
    render: (ctx) => renderWithFlowName(InfoWidget, ctx),
    titleKey: "flowDetail.info",
  },
  {
    defaultLayout: { h: 5, minH: 4, minW: 6, w: 8, x: 0, y: 4 },
    id: "flowDetail.productActivity",
    render: (ctx) => renderWithFlowName(ProductActivityWidget, ctx),
    titleKey: "flowDetail.productActivity",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 4, w: 4, x: 8, y: 4 },
    id: "flowDetail.recentMessages",
    render: (ctx) => renderWithFlowName(RecentMessagesWidget, ctx),
    titleKey: "flowDetail.recentMessages",
  },
];
