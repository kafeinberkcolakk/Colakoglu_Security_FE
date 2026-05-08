"use client";

import { Copy, Download } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { JsonTreeView } from "@/components/ui/json-tree-view";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { dataApi } from "@/features/data/api/data-api";
import { usePayloadDetail } from "@/features/data/hooks/use-payload-detail";
import type { PayloadDetail } from "@/features/data/types/data";
import { pageRoutes } from "@/lib/const/pages";
import { formatBytes } from "@/lib/format";

interface PayloadDetailScreenProps {
  payloadId: string;
}

const BASE64_PADDING_REGEX = /=+$/;
const BASE64_BYTES_PER_GROUP = 3;
const BASE64_CHARS_PER_GROUP = 4;

function payloadByteLength(payload: PayloadDetail): number {
  if (payload.payload !== undefined) {
    return new Blob([JSON.stringify(payload.payload)]).size;
  }
  if (payload.rawPayloadBase64) {
    const padding = (
      payload.rawPayloadBase64.match(BASE64_PADDING_REGEX)?.[0] ?? ""
    ).length;
    const base64Length = payload.rawPayloadBase64.length;
    return (
      (base64Length * BASE64_BYTES_PER_GROUP) / BASE64_CHARS_PER_GROUP - padding
    );
  }
  return 0;
}

export function PayloadDetailScreen({ payloadId }: PayloadDetailScreenProps) {
  const t = useTranslations("page.data.payload");
  const tCore = useTranslations("core");
  const { data, isLoading } = usePayloadDetail(payloadId);

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
                value={formatBytes(payloadByteLength(data))}
              />
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">
                {t("payload.title")}
              </h2>
              <PayloadBody
                emptyLabel={t("payload.empty")}
                payload={data.payload}
                rawBase64={data.rawPayloadBase64}
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
  payload?: Record<string, unknown> | unknown[];
  rawBase64?: string;
}

function PayloadBody({ emptyLabel, payload, rawBase64 }: PayloadBodyProps) {
  if (payload) {
    return <JsonTreeView data={payload} />;
  }
  if (rawBase64) {
    return (
      <pre className="max-h-96 overflow-auto rounded-md border border-border bg-card p-3 font-mono text-xs">
        {rawBase64}
      </pre>
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
