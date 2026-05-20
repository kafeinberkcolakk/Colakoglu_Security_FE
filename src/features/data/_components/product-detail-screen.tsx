"use client";

import { Copy, Pause, Play } from "lucide-react";
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
import { useExponentialBackoff } from "@/hooks/use-exponential-backoff";
import { useDocumentHidden } from "@/hooks/use-visibility-pause";
import {
  DEFAULT_PAYLOAD_PAGE_SIZE,
  FLOW_CHART_BUCKET_LIMIT,
  LIVE_FEED_REFETCH_INTERVAL_MS,
} from "@/lib/const/intervals";
import { SERVICE_PAYLOAD_SUBJECT, beApiRoutes } from "@/lib/const/pages";
import { computeLast24hIso } from "@/lib/format";

const SKELETON_BAR_HEIGHT = 200;
const HIGHLIGHT_TIMEOUT_MS = 2000;

interface ProductDetailScreenProps {
  productName: string;
}

function buildWebhookUrl(productName: string): string {
  const base = typeof window === "undefined" ? "" : window.location.origin;
  return `${base}${beApiRoutes.integration.collectorEvents(productName)}`;
}

export function ProductDetailScreen({ productName }: ProductDetailScreenProps) {
  const t = useTranslations("page.data.products.detail");
  const tLive = useTranslations("page.data.live");
  const tCore = useTranslations("core");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAYLOAD_PAGE_SIZE);
  const [manualPaused, setManualPaused] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const previousNewestIdRef = useRef<string | null>(null);

  const tabHidden = useDocumentHidden();
  const paused = manualPaused || tabHidden;
  const backoff = useExponentialBackoff(LIVE_FEED_REFETCH_INTERVAL_MS);

  const listQuery = usePayloads({
    query: {
      page,
      productName,
      size: pageSize,
      subject: SERVICE_PAYLOAD_SUBJECT,
    },
    refetchInterval: paused ? false : backoff.intervalMs,
  });

  const [fromIso] = useState(computeLast24hIso);

  const activityQuery = usePayloads({
    query: {
      from: fromIso,
      page: 0,
      productName,
      size: FLOW_CHART_BUCKET_LIMIT,
      subject: SERVICE_PAYLOAD_SUBJECT,
    },
  });

  const buckets = useMemo(
    () => bucketByHour(activityQuery.data?.content ?? []),
    [activityQuery.data],
  );

  const webhookUrl = useMemo(() => buildWebhookUrl(productName), [productName]);

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

  const handleCopyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success(t("webhookCopied"));
    } catch {
      toast.error(t("webhookCopyFailed"));
    }
  };

  const totalMessages = listQuery.data?.totalElements ?? 0;
  const latest = listQuery.data?.content[0]?.receivedAt;

  return (
    <div>
      <PageHeader title={productName}>
        <LiveIndicator
          label={tLive("status.live")}
          paused={paused}
          pausedLabel={tLive("status.paused")}
        />
        <Button
          aria-label={paused ? tCore("update") : tLive("status.pause")}
          onClick={() => setManualPaused((prev) => !prev)}
          size="icon-sm"
          variant="outline"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </Button>
        <Button onClick={handleCopyWebhook} size="sm" variant="outline">
          <Copy className="size-4" />
          {t("copyWebhook")}
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <WidgetCard
            subtitle={tLive("stats.totalSubtitle")}
            title={tLive("stats.total")}
          >
            <p className="text-3xl font-semibold text-foreground">
              {totalMessages}
            </p>
          </WidgetCard>
          <WidgetCard
            subtitle={tLive("stats.lastSubtitle")}
            title={tLive("stats.last")}
          >
            <p className="text-sm text-foreground">
              {latest ? new Date(latest).toLocaleString() : "—"}
            </p>
          </WidgetCard>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {tLive("activity.title")}
          </h2>
          {activityQuery.isLoading ? (
            <Skeleton style={{ height: SKELETON_BAR_HEIGHT }} />
          ) : (
            <SubjectActivityChart data={buckets} />
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {tLive("messages.title")}
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
