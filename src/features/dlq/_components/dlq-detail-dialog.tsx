"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DlqEntry } from "@/features/dlq/types/dlq";
import { formatBytes } from "@/lib/format";

interface DlqDetailDialogProps {
  entry: DlqEntry | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function DlqDetailDialog({
  entry,
  onOpenChange,
  open,
}: DlqDetailDialogProps) {
  const t = useTranslations("page.dlq.detail");
  const tCore = useTranslations("core");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        {entry && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label={t("originalSubject")} value={entry.originalSubject} />
            <Field label={t("consumer")} value={entry.consumer} />
            <Field
              label={t("payloadBytes")}
              value={formatBytes(entry.payloadBytes)}
            />
            <Field label={t("retryCount")} value={String(entry.retryCount)} />
            <Field label={t("occurredAt")} value={entry.occurredAt} />
            <Field label={t("retriedAt")} value={entry.retriedAt ?? "—"} />
            <div className="md:col-span-2">
              <Field label={t("errorMessage")} value={entry.errorMessage} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {tCore("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-all text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
