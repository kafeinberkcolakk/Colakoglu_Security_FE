"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  type BucketPoint,
  bucketByHourBySubject,
  freshnessClass,
  subjectFreshness,
} from "@/features/data/domain/bucket-aggregation";
import type { PayloadSummary, SubjectStats } from "@/features/data/types/data";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { pageRoutes } from "@/lib/const/pages";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SubjectSparkline } from "./subject-sparkline";

const TOP_SUBJECTS_LIMIT = 6;

interface SubjectFlowGridProps {
  payloads: PayloadSummary[];
  subjects: SubjectStats[];
}

interface SubjectFlowEntry {
  buckets: BucketPoint[];
  stat: SubjectStats;
}

function buildEntries(
  subjects: SubjectStats[],
  bucketsBySubject: Map<string, BucketPoint[]>,
): SubjectFlowEntry[] {
  return subjects.slice(0, TOP_SUBJECTS_LIMIT).map((stat) => ({
    buckets: bucketsBySubject.get(stat.subject) ?? [],
    stat,
  }));
}

export function SubjectFlowGrid({ payloads, subjects }: SubjectFlowGridProps) {
  const t = useTranslations("page.dashboard.subjectFlows");
  const relativeLabels = useRelativeLabels();

  const bucketsBySubject = useMemo(
    () => bucketByHourBySubject(payloads),
    [payloads],
  );

  const entries = useMemo(
    () => buildEntries(subjects, bucketsBySubject),
    [bucketsBySubject, subjects],
  );

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(({ buckets, stat }) => {
        const freshness = subjectFreshness(stat.lastReceivedAt);
        return (
          <Link
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary"
            href={pageRoutes.subjectDetail(stat.subject)}
            key={stat.subject}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {stat.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("messageCount", { count: stat.messageCount })}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  freshnessClass(freshness),
                )}
              >
                {formatRelative(stat.lastReceivedAt, relativeLabels)}
              </span>
            </div>
            <SubjectSparkline data={buckets} />
          </Link>
        );
      })}
    </div>
  );
}
