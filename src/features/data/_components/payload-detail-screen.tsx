"use client";

import { Copy, Download } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { dataApi } from "@/features/data/api/data-api";
import { usePayloadDetail } from "@/features/data/hooks/use-payload-detail";
import type { PayloadDetail } from "@/features/data/types/data";
import { pageRoutes } from "@/lib/const/pages";
import { formatBytes } from "@/lib/format";

const LARGE_PAYLOAD_THRESHOLD_BYTES = 1_000_000;

const JsonTreeView = dynamic(
  () =>
    import("@/components/ui/json-tree-view").then((mod) => mod.JsonTreeView),
  { loading: () => <Skeleton className="h-40 w-full" />, ssr: false },
);

interface PayloadDetailScreenProps {
  payloadId: string;
}

function computePayloadSize(detail: PayloadDetail): number {
  if (detail.payload !== undefined) {
    return new Blob([JSON.stringify(detail.payload)]).size;
  }
  return detail.rawSize;
}

export function PayloadDetailScreen({ payloadId }: PayloadDetailScreenProps) {
  const t = useTranslations("page.data.payload");
  const tCore = useTranslations("core");
  const { data, isLoading } = usePayloadDetail(payloadId);

  const payloadSize = useMemo(
    () => (data ? computePayloadSize(data) : 0),
    [data],
  );

  const handleCopy = async () => {
    if (!data?.payload) {
      return;
    }
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(data.payload, null, 2),
      );
      toast.success(t("copy.success"));
    } catch {
      toast.error(t("copy.error"));
    }
  };

  return (
    <div>
      <PageHeader title={t("title")}>
        {data && (
          <>
            <Button asChild={true} size="sm" variant="outline">
              <Link href={pageRoutes.subjectDetail(data.subject)}>
                {tCore("close")}
              </Link>
            </Button>
            {data.payload && (
              <Button onClick={handleCopy} size="sm" variant="outline">
                <Copy className="size-4" />
                {t("copy.label")}
              </Button>
            )}
            <Button asChild={true} size="sm" variant="outline">
              <a
                download={`${data.messageId}.bin`}
                href={dataApi.payloadRawUrl(data.id)}
              >
                <Download className="size-4" />
                {t("downloadRaw")}
              </a>
            </Button>
          </>
        )}
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-8">
        {isLoading || !data ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <>
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label={t("fields.id")} value={data.id} />
              <Field label={t("fields.messageId")} value={data.messageId} />
              <Field label={t("fields.subject")} value={data.subject} />
              <Field
                label={t("fields.receivedAt")}
                value={new Date(data.receivedAt).toLocaleString()}
              />
              <Field
                label={t("fields.format")}
                value={data.payload ? "JSON" : t("fields.formatRaw")}
              />
              <Field
                label={t("fields.size")}
                value={formatBytes(payloadSize)}
              />
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">
                {t("payload.title")}
              </h2>
              <PayloadBody
                emptyLabel={t("payload.empty")}
                largeLabel={t("payload.large")}
                payload={data.payload}
                size={payloadSize}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

interface PayloadBodyProps {
  emptyLabel: string;
  largeLabel: string;
  payload?: Record<string, unknown> | unknown[];
  size: number;
}

function PayloadBody({
  emptyLabel,
  largeLabel,
  payload,
  size,
}: PayloadBodyProps) {
  if (payload) {
    if (size > LARGE_PAYLOAD_THRESHOLD_BYTES) {
      return (
        <p className="text-sm text-muted-foreground">
          {largeLabel.replace("{size}", formatBytes(size))}
        </p>
      );
    }
    return <JsonTreeView data={payload} />;
  }
  if (size > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {largeLabel.replace("{size}", formatBytes(size))}
      </p>
    );
  }
  return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-all text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
