"use client";

import { Download, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/ui/widget-card";
import { LiveFeedTable } from "@/features/data/_components/live-feed-table";
import { SubjectActivityChart } from "@/features/data/_components/subject-activity-chart";
import { bucketByHour } from "@/features/data/domain/bucket-aggregation";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import { useSubjects } from "@/features/data/hooks/use-subjects";
import type { PayloadSummary } from "@/features/data/types/data";
import { useExponentialBackoff } from "@/hooks/use-exponential-backoff";
import { useDocumentHidden } from "@/hooks/use-visibility-pause";
import {
  DEFAULT_PAYLOAD_PAGE_SIZE,
  FLOW_CHART_BUCKET_LIMIT,
  LIVE_FEED_REFETCH_INTERVAL_MS,
} from "@/lib/const/intervals";
import { computeLast24hIso } from "@/lib/format";

const SKELETON_BAR_HEIGHT = 200;
const HIGHLIGHT_TIMEOUT_MS = 2000;

interface SubjectDetailScreenProps {
  subject: string;
}

function toCsv(rows: PayloadSummary[]): string {
  const header = ["id", "messageId", "receivedAt", "payloadSize", "isJson"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.messageId,
        row.receivedAt,
        String(row.payloadSize),
        String(row.hasJson),
      ]
        .map((cell) => `"${cell.replace(/"/g, '""')}"`)
        .join(","),
    );
  }
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") {
    return;
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SubjectDetailScreen({ subject }: SubjectDetailScreenProps) {
  const t = useTranslations("page.data.live");
  const tCore = useTranslations("core");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAYLOAD_PAGE_SIZE);
  const [manualPaused, setManualPaused] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const previousNewestIdRef = useRef<string | null>(null);

  const tabHidden = useDocumentHidden();
  const paused = manualPaused || tabHidden;
  const backoff = useExponentialBackoff(LIVE_FEED_REFETCH_INTERVAL_MS);

  const subjectsQuery = useSubjects();
  const subjectStats = subjectsQuery.data?.find(
    (entry) => entry.subject === subject,
  );

  const listQuery = usePayloads({
    query: { page, size: pageSize, subject },
    refetchInterval: paused ? false : backoff.intervalMs,
  });

  const [fromIso] = useState(computeLast24hIso);

  const flowQuery = usePayloads({
    query: {
      from: fromIso,
      page: 0,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject,
    },
  });

  const buckets = useMemo(
    () => bucketByHour(flowQuery.data?.content ?? []),
    [flowQuery.data],
  );

  useEffect(() => {
    const newest = listQuery.data?.content[0];
    if (!newest) {
      return;
    }
    if (
      previousNewestIdRef.current !== null &&
      newest.id !== previousNewestIdRef.current
    ) {
      setHighlightId(newest.id);
      const timer = setTimeout(
        () => setHighlightId(null),
        HIGHLIGHT_TIMEOUT_MS,
      );
      previousNewestIdRef.current = newest.id;
      return () => clearTimeout(timer);
    }
    previousNewestIdRef.current = newest.id;
  }, [listQuery.data]);

  const { onError: onBackoffError, onSuccess: onBackoffSuccess } = backoff;
  useEffect(() => {
    if (listQuery.isError) {
      onBackoffError();
    } else if (listQuery.isSuccess) {
      onBackoffSuccess();
    }
  }, [
    listQuery.isError,
    listQuery.isSuccess,
    onBackoffError,
    onBackoffSuccess,
  ]);

  const handleExport = () => {
    const rows = listQuery.data?.content ?? [];
    if (rows.length === 0) {
      toast.error(t("export.empty"));
      return;
    }
    downloadCsv(
      `${subject}-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(rows),
    );
  };

  return (
    <div>
      <PageHeader title={subject}>
        <LiveIndicator
          label={t("status.live")}
          paused={paused}
          pausedLabel={t("status.paused")}
        />
        <Button
          aria-label={paused ? tCore("update") : t("status.pause")}
          onClick={() => setManualPaused((prev) => !prev)}
          size="icon-sm"
          variant="outline"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button onClick={handleExport} size="sm" variant="outline">
          <Download className="size-4" />
          {tCore("export")}
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <WidgetCard
            subtitle={t("stats.totalSubtitle")}
            title={t("stats.total")}
          >
            <p className="text-3xl font-semibold text-foreground">
              {subjectStats?.messageCount ?? 0}
            </p>
          </WidgetCard>
          <WidgetCard
            subtitle={t("stats.lastSubtitle")}
            title={t("stats.last")}
          >
            <p className="text-sm text-foreground">
              {subjectStats?.lastReceivedAt
                ? new Date(subjectStats.lastReceivedAt).toLocaleString()
                : "—"}
            </p>
          </WidgetCard>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {t("activity.title")}
          </h2>
          {flowQuery.isLoading ? (
            <Skeleton style={{ height: SKELETON_BAR_HEIGHT }} />
          ) : (
            <SubjectActivityChart data={buckets} />
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {t("messages.title")}
          </h2>
          {listQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <LiveFeedTable
              data={listQuery.data?.content ?? []}
              highlightId={highlightId}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(0);
              }}
              page={page}
              pageSize={pageSize}
              totalElements={listQuery.data?.totalElements ?? 0}
            />
          )}
        </section>
      </div>
    </div>
  );
}
