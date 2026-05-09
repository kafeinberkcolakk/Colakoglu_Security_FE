"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ChartCard } from "@/components/ui/chart-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubjectActivityChart } from "@/features/data/_components/subject-activity-chart";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import { useSubjects } from "@/features/data/hooks/use-subjects";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { FLOW_CHART_BUCKET_LIMIT } from "@/lib/const/intervals";
import { computeLast24hIso, formatRelative } from "@/lib/format";

export function SubjectReportsScreen() {
  const t = useTranslations("page.reports.subjects");
  const relativeLabels = useRelativeLabels();
  const subjectsQuery = useSubjects();
  const [userPick, setUserPick] = useState<string | null>(null);
  const subjects = subjectsQuery.data ?? [];
  const selected = userPick ?? subjects[0]?.subject ?? null;

  const [since] = useState(() => computeLast24hIso());
  const payloadsQuery = usePayloads({
    enabled: selected !== null,
    query: {
      from: since,
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject: selected ?? undefined,
    },
  });

  const buckets = useMemo(
    () => bucketByHour(payloadsQuery.data?.content ?? []),
    [payloadsQuery.data?.content],
  );

  const subjectMeta = useMemo(() => {
    if (!selected) {
      return undefined;
    }
    return subjects.find((s) => s.subject === selected);
  }, [selected, subjects]);

  const hasSubjects = subjects.length > 0;

  const renderBody = () => {
    if (subjectsQuery.isLoading) {
      return null;
    }
    if (!hasSubjects) {
      return <EmptyState title={t("noSubjects")} />;
    }
    if (selected === null) {
      return <EmptyState title={t("empty")} />;
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <MetricCard
            title={t("stats.total")}
            value={subjectMeta?.messageCount ?? "—"}
          />
          <MetricCard
            title={t("stats.last")}
            value={
              subjectMeta?.lastReceivedAt
                ? formatRelative(subjectMeta.lastReceivedAt, relativeLabels)
                : "—"
            }
          />
        </div>

        <ChartCard
          isEmpty={buckets.every((b) => b.count === 0)}
          isLoading={payloadsQuery.isLoading}
          title={t("activity.title")}
        >
          <SubjectActivityChart data={buckets} />
        </ChartCard>
      </>
    );
  };

  return (
    <div>
      <PageHeader title={t("title")}>
        {hasSubjects && (
          <Select onValueChange={setUserPick} value={selected ?? undefined}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder={t("selector.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.subject} value={s.subject}>
                  {s.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-6">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        {renderBody()}
      </div>
    </div>
  );
}
