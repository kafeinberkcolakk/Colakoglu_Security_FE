"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { WidgetCard } from "@/components/ui/widget-card";
import { StatsCard } from "@/features/dashboard/_components/stats-card";
import { useDashboardAggregates } from "@/features/dashboard/hooks/use-dashboard-aggregates";
import { MessageFlowChart } from "@/features/data/_components/message-flow-chart";
import { SubjectFlowGrid } from "@/features/data/_components/subject-flow-grid";
import { SubjectsTable } from "@/features/data/_components/subjects-table";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { pageRoutes } from "@/lib/const/pages";

const SKELETON_TOP_COUNT = 4;
const SKELETON_CHART_HEIGHT = 280;
const SKELETON_GRID_HEIGHT = 110;
const SKELETON_GRID_COUNT = 6;
const TABLE_OVERFLOW_THRESHOLD = 6;

export function DashboardScreen() {
  const t = useTranslations("page.dashboard");
  const { data, isLoading } = useDashboardAggregates();

  const buckets = useMemo(
    () => bucketByHour(data?.payloadsLast24h ?? []),
    [data?.payloadsLast24h],
  );
  const overflowSubjects = useMemo(
    () => (data?.subjects ?? []).slice(TABLE_OVERFLOW_THRESHOLD),
    [data?.subjects],
  );

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title={t("title")}>
          <LiveIndicator label={t("live")} />
        </PageHeader>
        <div className="flex flex-col gap-4 px-6 pb-6">
          <SkeletonList
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
            rowClassName="h-28 w-full"
            rows={SKELETON_TOP_COUNT}
          />
          <Skeleton style={{ height: SKELETON_CHART_HEIGHT }} />
          <SkeletonList
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            rowClassName="w-full"
            rows={SKELETON_GRID_COUNT}
          />
          <Skeleton style={{ height: SKELETON_GRID_HEIGHT }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t("title")}>
        <LiveIndicator label={t("live")} />
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            subtitle={t("cards.totalSubtitle")}
            title={t("cards.total")}
            value={data.stats.totalMessages}
            viewAll={pageRoutes.data}
          />
          <StatsCard
            subtitle={t("cards.last24hSubtitle")}
            title={t("cards.last24h")}
            value={data.stats.messagesLast24h}
          />
          <StatsCard
            subtitle={t("cards.lastHourSubtitle")}
            title={t("cards.lastHour")}
            value={data.stats.messagesLastHour}
          />
          <StatsCard
            subtitle={
              data.dlqCount === 0
                ? t("cards.dlqHealthy")
                : t("cards.dlqAttention")
            }
            title={t("cards.dlq")}
            value={data.dlqCount}
            viewAll={pageRoutes.dlq}
          />
        </div>

        <WidgetCard
          subtitle={t("flow.subtitle")}
          title={t("flow.title")}
          viewAll={pageRoutes.data}
        >
          <MessageFlowChart data={buckets} />
        </WidgetCard>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              {t("subjectFlows.title")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t("subjectFlows.subtitle")}
            </span>
          </div>
          <SubjectFlowGrid
            payloads={data.payloadsLast24h}
            subjects={data.subjects}
          />
        </section>

        {overflowSubjects.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-foreground">
              {t("activeFlows")}
            </h2>
            <SubjectsTable data={overflowSubjects} />
          </section>
        )}
      </div>
    </div>
  );
}

function LiveIndicator({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-500">
      <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
      {label}
    </span>
  );
}
