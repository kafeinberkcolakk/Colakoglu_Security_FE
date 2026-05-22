"use client";

import { AlertTriangle, Inbox, ServerCrash } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { StateHealthBadge } from "@/features/security-dashboard/_components/state-health-badge";
import { SECURITY_STATES } from "@/features/security-dashboard/domain/state-registry";
import type { SectionStatus } from "@/features/security-dashboard/hooks/use-section-context";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import type { StateHealth } from "@/lib/const/severity";
import { formatRelative } from "@/lib/format";

const SKELETON_ROWS = 3;

interface StateSectionProps {
  children: ReactNode;
  health: StateHealth;
  intervalSeconds: number | null;
  receivedAt: string | null;
  sectionId: string;
  stale: boolean;
  status: SectionStatus;
  statusCode?: number;
  subtitle: string;
  title: string;
}

export function StateSection({
  children,
  health,
  intervalSeconds,
  receivedAt,
  sectionId,
  stale,
  status,
  statusCode,
  subtitle,
  title,
}: StateSectionProps) {
  const t = useTranslations("page.securityDashboard.section");
  const labels = useRelativeLabels();

  const freshness =
    receivedAt === null ? null : formatRelative(receivedAt, labels);
  const Icon = SECURITY_STATES.find((state) => state.id === sectionId)?.icon;

  return (
    <section className="scroll-mt-24" id={sectionId}>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-2">
        {Icon !== undefined && (
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        )}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <StateHealthBadge health={health} />
        {freshness !== null && (
          <span className="text-xs text-muted-foreground">
            {t("updatedAgo", { time: freshness })}
          </span>
        )}
        {intervalSeconds !== null && (
          <span className="text-xs text-muted-foreground">
            {t("everySeconds", { seconds: intervalSeconds })}
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {subtitle}
        </span>
      </div>

      {status === "loading" && <SkeletonList rows={SKELETON_ROWS} />}

      {status === "error" && (
        <EmptyState
          description={t("errorDescription", { code: statusCode ?? "—" })}
          icon={ServerCrash}
          title={t("errorTitle")}
        />
      )}

      {status === "no-data" && (
        <EmptyState icon={Inbox} title={t("noDataTitle")} />
      )}

      {status === "ok" && (
        <div className="flex flex-col gap-4">
          {stale && (
            <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0" />
              {t("staleBanner", { time: freshness ?? "—" })}
            </div>
          )}
          {children}
        </div>
      )}
    </section>
  );
}
