"use client";

import { useTranslations } from "next-intl";
import { WidgetCard } from "@/components/ui/widget-card";
import {
  avgDurationMs,
  lastErrorMessage,
  p95DurationMs,
  successRate,
  totalMessagesPublished,
} from "@/features/collectors/domain/run-aggregations";
import type { CollectorRun } from "@/features/collectors/types/collector";

interface CollectorStatsCardsProps {
  runs: CollectorRun[];
}

const TRUNCATE_AFTER = 240;

function truncate(text: string): string {
  if (text.length <= TRUNCATE_AFTER) {
    return text;
  }
  return `${text.slice(0, TRUNCATE_AFTER)}…`;
}

export function CollectorStatsCards({ runs }: CollectorStatsCardsProps) {
  const t = useTranslations("page.collectors.detail.stats");

  const successPercent = successRate(runs);
  const avgMs = avgDurationMs(runs);
  const p95Ms = p95DurationMs(runs);
  const lastError = lastErrorMessage(runs);
  const totalMessages = totalMessagesPublished(runs);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <WidgetCard
        subtitle={t("totalRuns", { count: runs.length })}
        title={t("successRate")}
      >
        <p className="text-3xl font-semibold text-foreground">
          {successPercent}%
        </p>
      </WidgetCard>
      <WidgetCard subtitle={t("p95Subtitle")} title={t("avgDuration")}>
        <p className="text-3xl font-semibold text-foreground">
          {avgMs}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            ms
          </span>
        </p>
      </WidgetCard>
      <WidgetCard subtitle={t("p95Subtitle")} title={t("p95Duration")}>
        <p className="text-3xl font-semibold text-foreground">
          {p95Ms}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            ms
          </span>
        </p>
      </WidgetCard>
      <WidgetCard
        subtitle={t("messagesSubtitle", { count: totalMessages })}
        title={t("lastError")}
      >
        {lastError === null ? (
          <p className="text-sm text-muted-foreground">{t("noError")}</p>
        ) : (
          <p className="text-sm text-destructive">{truncate(lastError)}</p>
        )}
      </WidgetCard>
    </div>
  );
}
