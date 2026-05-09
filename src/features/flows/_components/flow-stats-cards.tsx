"use client";

import { useTranslations } from "next-intl";
import { MetricCard } from "@/components/ui/metric-card";
import {
  avgDurationMs,
  lastErrorMessage,
  p95DurationMs,
  successRate,
  totalMessagesPublished,
} from "@/features/flows/domain/run-aggregations";
import type { FlowRun } from "@/features/flows/types/flow";
import { truncate } from "@/lib/utils";

interface FlowStatsCardsProps {
  runs: FlowRun[];
}

export function FlowStatsCards({ runs }: FlowStatsCardsProps) {
  const t = useTranslations("page.flows.detail.stats");

  const successPercent = successRate(runs);
  const avgMs = avgDurationMs(runs);
  const p95Ms = p95DurationMs(runs);
  const lastError = lastErrorMessage(runs);
  const totalMessages = totalMessagesPublished(runs);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        subtitle={t("totalRuns", { count: runs.length })}
        title={t("successRate")}
        unit="%"
        value={successPercent}
      />
      <MetricCard
        subtitle={t("p95Subtitle")}
        title={t("avgDuration")}
        unit="ms"
        value={avgMs}
      />
      <MetricCard
        subtitle={t("p95Subtitle")}
        title={t("p95Duration")}
        unit="ms"
        value={p95Ms}
      />
      <MetricCard
        subtitle={t("messagesSubtitle", { count: totalMessages })}
        title={t("lastError")}
        value={
          lastError === null ? (
            <span className="text-sm text-muted-foreground">
              {t("noError")}
            </span>
          ) : (
            <span className="text-sm text-destructive">
              {truncate(lastError)}
            </span>
          )
        }
      />
    </div>
  );
}
