"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectorStatsCards } from "@/features/collectors/_components/collector-stats-cards";
import { RunsTimeline } from "@/features/collectors/_components/runs-timeline";
import { useCollectorDetail } from "@/features/collectors/hooks/use-collector-detail";
import { useDeleteCollector } from "@/features/collectors/hooks/use-collector-mutations";
import { useCollectorRuns } from "@/features/collectors/hooks/use-collector-runs";
import { pageRoutes } from "@/lib/const/pages";

interface CollectorDetailScreenProps {
  collectorId: string;
}

const SKELETON_STATS = 4;

export function CollectorDetailScreen({
  collectorId,
}: CollectorDetailScreenProps) {
  const router = useRouter();
  const t = useTranslations("page.collectors.detail");
  const tCore = useTranslations("core");
  const tTypes = useTranslations("page.collectors.types");
  const tDelete = useTranslations("page.collectors.delete");

  const collectorQuery = useCollectorDetail(collectorId);
  const runsQuery = useCollectorRuns({ collectorId });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteCollector(() => {
    setConfirmOpen(false);
    router.push(pageRoutes.collectors);
  });

  const collector = collectorQuery.data;

  return (
    <div>
      <PageHeader title={collector?.name ?? t("title")}>
        {collector && (
          <>
            <span className="text-xs text-muted-foreground">
              {tTypes(collector.type)}
            </span>
            <Button asChild={true} size="sm" variant="outline">
              <Link href={pageRoutes.collectorEdit(collector.id)}>
                <Pencil className="size-4" />
                {tCore("edit")}
              </Link>
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="size-4" />
              {tCore("close")}
            </Button>
          </>
        )}
      </PageHeader>

      <div className="flex flex-col gap-6 px-6 pb-8">
        {collectorQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: SKELETON_STATS }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <Skeleton className="h-24 w-full" key={index} />
            ))}
          </div>
        ) : (
          <CollectorStatsCards runs={runsQuery.data ?? []} />
        )}

        {collector && (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <InfoRow
              label={t("info.natsSubject")}
              value={collector.natsSubject}
            />
            <InfoRow
              label={t("info.intervalSeconds")}
              value={
                collector.intervalSeconds === null
                  ? "—"
                  : `${collector.intervalSeconds}s`
              }
            />
            <InfoRow
              label={t("info.enabled")}
              value={collector.enabled ? tCore("active") : tCore("inactive")}
            />
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {t("runs.title")}
          </h2>
          {runsQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <RunsTimeline runs={runsQuery.data ?? []} />
          )}
        </section>
      </div>

      <ConfirmDialog
        cancelLabel={tCore("cancel")}
        confirmLabel={tCore("yes")}
        description={
          collector ? tDelete("confirm", { name: collector.name }) : undefined
        }
        onConfirm={() => {
          if (collector) {
            deleteMutation.mutate(collector.id);
          }
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={tDelete("title")}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
