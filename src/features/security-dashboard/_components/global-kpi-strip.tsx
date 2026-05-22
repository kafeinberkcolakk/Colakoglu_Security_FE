"use client";

import { Crosshair, Flame, ServerCog, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import type { PayloadDetail } from "@/features/data/types/data";
import { useFlowsList } from "@/features/flows/hooks/use-flows-list";
import { computeStateHealth } from "@/features/security-dashboard/domain/health-badge";
import { computeOffensesMetrics } from "@/features/security-dashboard/domain/metrics/offenses-metrics";
import { computeTopAttackersMetrics } from "@/features/security-dashboard/domain/metrics/top-attackers-metrics";
import { parseSnapshot } from "@/features/security-dashboard/domain/snapshot-parser";
import { useStateSnapshot } from "@/features/security-dashboard/hooks/use-state-snapshot";
import { formatNumber } from "@/lib/format";

function snapshotBody(detail: PayloadDetail | null): unknown {
  if (detail === null) {
    return undefined;
  }
  return parseSnapshot(detail)?.body;
}

export function GlobalKpiStrip() {
  const t = useTranslations("page.securityDashboard.global");
  const offenses = useStateSnapshot("qradar-offenses");
  const attackers = useStateSnapshot("qradar-top-attackers");
  const flowsQuery = useFlowsList();

  const offenseMetrics = useMemo(
    () => computeOffensesMetrics(snapshotBody(offenses.data?.detail ?? null)),
    [offenses.data?.detail],
  );
  const attackerMetrics = useMemo(
    () =>
      computeTopAttackersMetrics(snapshotBody(attackers.data?.detail ?? null)),
    [attackers.data?.detail],
  );

  const collectorHealth = useMemo(() => {
    const items = flowsQuery.data?.items ?? [];
    const healthy = items.filter(
      (flow) => computeStateHealth(flow) === "healthy",
    ).length;
    return { healthy, total: items.length };
  }, [flowsQuery.data?.items]);

  const collectorsDegraded = collectorHealth.healthy < collectorHealth.total;

  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={ShieldAlert}
          subtitle={t("openOffensesSubtitle")}
          title={t("openOffenses")}
          value={formatNumber(offenseMetrics.openCount)}
        />
        <MetricCard
          icon={Flame}
          subtitle={t("criticalSubtitle")}
          title={t("critical")}
          tone={offenseMetrics.criticalCount > 0 ? "critical" : "default"}
          value={formatNumber(offenseMetrics.criticalCount)}
        />
        <MetricCard
          icon={Crosshair}
          subtitle={t("activeThreatsSubtitle")}
          title={t("activeThreats")}
          value={formatNumber(attackerMetrics.distinctIps)}
        />
        <MetricCard
          icon={ServerCog}
          subtitle={t("healthyCollectorsSubtitle")}
          title={t("healthyCollectors")}
          tone={collectorsDegraded ? "warning" : "default"}
          value={`${collectorHealth.healthy}/${collectorHealth.total}`}
        />
      </div>
    </section>
  );
}
