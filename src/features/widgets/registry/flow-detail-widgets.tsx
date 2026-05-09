"use client";

import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { type WidgetRegistry, WidgetState } from "@/components/widgets";
import { MessageFlowChart } from "@/features/data/_components/message-flow-chart";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import { RunsTimeline } from "@/features/flows/_components/runs-timeline";
import {
  avgDurationMs,
  lastErrorMessage,
  p95DurationMs,
  successRate,
} from "@/features/flows/domain/run-aggregations";
import { useFlowDetail } from "@/features/flows/hooks/use-flow-detail";
import { useFlowRuns } from "@/features/flows/hooks/use-flow-runs";
import { getNatsSubject } from "@/features/flows/services/flow-accessors";
import { FLOW_CHART_BUCKET_LIMIT } from "@/lib/const/intervals";
import { computeLast24hIso } from "@/lib/format";
import { truncate } from "@/lib/utils";

const RECENT_PAYLOADS_LIMIT = 20;
const ERROR_TRUNCATE = 80;

interface FlowWidgetProps {
  flowId: number;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-all text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function InfoWidget({ flowId }: FlowWidgetProps) {
  const t = useTranslations("page.flows.detail.info");
  const tCore = useTranslations("core");
  const flowQuery = useFlowDetail(flowId);
  const flow = flowQuery.data;

  return (
    <WidgetState isLoading={flowQuery.isLoading || !flow}>
      {flow && (
        <dl className="grid grid-cols-1 gap-3 text-sm">
          <InfoRow
            label={t("natsSubject")}
            value={getNatsSubject(flow) || "—"}
          />
          <InfoRow
            label={t("cronExpression")}
            value={flow.cronExpression ?? "—"}
          />
          <InfoRow
            label={t("enabled")}
            value={flow.enabled ? tCore("active") : tCore("inactive")}
          />
          <InfoRow label={t("code")} value={flow.code} />
        </dl>
      )}
    </WidgetState>
  );
}

function RunStatMetric({
  hint,
  unit,
  value,
}: {
  hint: string;
  unit?: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border/60 bg-muted/20 p-3">
      <span className="text-xs text-muted-foreground">{hint}</span>
      <span className="text-xl font-semibold text-foreground">
        {value}
        {unit !== undefined && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

function RunStatsWidget({ flowId }: FlowWidgetProps) {
  const t = useTranslations("page.flows.detail.stats");
  const runsQuery = useFlowRuns({ flowId });
  const runs = runsQuery.data ?? [];
  const lastError = lastErrorMessage(runs);

  return (
    <WidgetState isLoading={runsQuery.isLoading}>
      <div className="grid grid-cols-2 gap-2">
        <RunStatMetric
          hint={t("successRate")}
          unit="%"
          value={String(successRate(runs))}
        />
        <RunStatMetric
          hint={t("avgDuration")}
          unit="ms"
          value={String(avgDurationMs(runs))}
        />
        <RunStatMetric
          hint={t("p95Duration")}
          unit="ms"
          value={String(p95DurationMs(runs))}
        />
        <RunStatMetric
          hint={t("totalRuns", { count: runs.length })}
          value={String(runs.length)}
        />
      </div>
      {lastError !== null && (
        <p className="mt-3 text-xs text-destructive">
          {truncate(lastError, ERROR_TRUNCATE)}
        </p>
      )}
    </WidgetState>
  );
}

function RunTimelineWidget({ flowId }: FlowWidgetProps) {
  const runsQuery = useFlowRuns({ flowId });
  const runs = runsQuery.data ?? [];

  return (
    <WidgetState isEmpty={runs.length === 0} isLoading={runsQuery.isLoading}>
      <RunsTimeline runs={runs} />
    </WidgetState>
  );
}

function SubjectFlowWidget({ flowId }: FlowWidgetProps) {
  const tWidgets = useTranslations("widgets.flowDetail");
  const flowQuery = useFlowDetail(flowId);
  const subject = flowQuery.data ? getNatsSubject(flowQuery.data) : "";
  const [since] = useState(() => computeLast24hIso());
  const payloadsQuery = usePayloads({
    enabled: subject !== "",
    query: {
      from: since,
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject,
    },
  });
  const buckets = useMemo(
    () => bucketByHour(payloadsQuery.data?.content ?? []),
    [payloadsQuery.data?.content],
  );

  return (
    <WidgetState
      emptyTitle={subject === "" ? tWidgets("subjectFlowNoSubject") : undefined}
      isEmpty={subject === "" || buckets.every((b) => b.count === 0)}
      isLoading={
        flowQuery.isLoading || (subject !== "" && payloadsQuery.isLoading)
      }
    >
      <MessageFlowChart data={buckets} />
    </WidgetState>
  );
}

function RecentMessagesWidget({ flowId }: FlowWidgetProps) {
  const tWidgets = useTranslations("widgets.flowDetail");
  const flowQuery = useFlowDetail(flowId);
  const subject = flowQuery.data ? getNatsSubject(flowQuery.data) : "";
  const payloadsQuery = usePayloads({
    enabled: subject !== "",
    query: { page: 0, size: RECENT_PAYLOADS_LIMIT, subject },
  });
  const items = payloadsQuery.data?.content ?? [];

  return (
    <WidgetState
      emptyTitle={
        subject === ""
          ? tWidgets("recentMessagesNoSubject")
          : tWidgets("recentMessagesEmpty")
      }
      isEmpty={subject === "" || items.length === 0}
      isLoading={
        flowQuery.isLoading || (subject !== "" && payloadsQuery.isLoading)
      }
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

function renderWithFlowId(
  Component: (props: FlowWidgetProps) => ReactElement,
  ctx: { flowId?: number },
): ReactElement {
  if (ctx.flowId === undefined) {
    return <Skeleton className="h-full w-full" />;
  }
  return <Component flowId={ctx.flowId} />;
}

export const FLOW_DETAIL_WIDGETS: WidgetRegistry = [
  {
    defaultLayout: { h: 4, minH: 3, w: 6, x: 0, y: 0 },
    id: "flowDetail.info",
    render: (ctx) => renderWithFlowId(InfoWidget, ctx),
    titleKey: "flowDetail.info",
  },
  {
    defaultLayout: { h: 4, minH: 3, w: 6, x: 6, y: 0 },
    id: "flowDetail.runStats",
    render: (ctx) => renderWithFlowId(RunStatsWidget, ctx),
    titleKey: "flowDetail.runStats",
  },
  {
    defaultLayout: { h: 5, minH: 4, minW: 6, w: 8, x: 0, y: 4 },
    id: "flowDetail.subjectFlow",
    render: (ctx) => renderWithFlowId(SubjectFlowWidget, ctx),
    titleKey: "flowDetail.subjectFlow",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 4, w: 4, x: 8, y: 4 },
    id: "flowDetail.recentMessages",
    render: (ctx) => renderWithFlowId(RecentMessagesWidget, ctx),
    titleKey: "flowDetail.recentMessages",
  },
  {
    defaultLayout: { h: 5, minH: 3, minW: 6, w: 12, x: 0, y: 9 },
    id: "flowDetail.runTimeline",
    render: (ctx) => renderWithFlowId(RunTimelineWidget, ctx),
    titleKey: "flowDetail.runTimeline",
  },
];
