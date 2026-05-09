"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/ui/widget-card";
import {
  type SentinelOneAgent,
  isAgentAtRisk,
} from "@/features/reports/domain/threats";
import { useThreatRollup } from "@/features/reports/hooks/use-threat-rollup";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { SENTINELONE_AGENTS_SUBJECT } from "@/lib/const/subjects";
import { formatRelative } from "@/lib/format";

const TABLE_LIMIT = 25;

function statusBadge(agent: SentinelOneAgent): string {
  const issues: string[] = [];
  if ((agent.activeThreats ?? 0) > 0) {
    issues.push(`threats:${agent.activeThreats}`);
  }
  if (agent.firewallEnabled === false) {
    issues.push("firewall-off");
  }
  if (
    agent.appsVulnerabilityStatus !== undefined &&
    agent.appsVulnerabilityStatus !== "up_to_date"
  ) {
    issues.push("vulnerable");
  }
  return issues.join(", ");
}

export function ThreatsScreen() {
  const t = useTranslations("page.reports.threats");
  const relativeLabels = useRelativeLabels();
  const { isLoading, rollup, subject } = useThreatRollup(
    SENTINELONE_AGENTS_SUBJECT,
  );

  const atRisk = useMemo(
    () => rollup.agents.filter(isAgentAtRisk).slice(0, TABLE_LIMIT),
    [rollup.agents],
  );

  const renderTable = () => {
    if (atRisk.length === 0) {
      return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
    }
    return (
      <table className="w-full text-left text-sm">
        <thead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2">{t("table.computerName")}</th>
            <th className="px-3 py-2">{t("table.osType")}</th>
            <th className="px-3 py-2">{t("table.agentVersion")}</th>
            <th className="px-3 py-2">{t("table.lastActiveDate")}</th>
            <th className="px-3 py-2">{t("table.status")}</th>
          </tr>
        </thead>
        <tbody>
          {atRisk.map((agent, index) => (
            <tr
              className="border-t border-border/40"
              key={agent.id ?? `${agent.computerName ?? "agent"}-${index}`}
            >
              <td className="px-3 py-2 font-medium text-foreground">
                {agent.computerName ?? "—"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {agent.osType ?? "—"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {agent.agentVersion ?? "—"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {agent.lastActiveDate
                  ? formatRelative(agent.lastActiveDate, relativeLabels)
                  : "—"}
              </td>
              <td className="px-3 py-2 text-destructive">
                {statusBadge(agent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return <Skeleton className="h-32 w-full" />;
    }
    if (rollup.total === 0) {
      return <EmptyState title={t("empty")} />;
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            subtitle={t("cards.totalSubtitle")}
            title={t("cards.total")}
            value={rollup.total}
          />
          <MetricCard
            subtitle={t("cards.activeSubtitle")}
            title={t("cards.active")}
            value={rollup.activeThreats}
          />
          <MetricCard
            subtitle={t("cards.vulnerableSubtitle")}
            title={t("cards.vulnerable")}
            value={rollup.vulnerable}
          />
          <MetricCard
            subtitle={t("cards.firewallOffSubtitle")}
            title={t("cards.firewallOff")}
            value={rollup.firewallOff}
          />
          <MetricCard
            subtitle={t("cards.outdatedAgentSubtitle")}
            title={t("cards.outdatedAgent")}
            value={rollup.outdatedAgents}
          />
        </div>

        <WidgetCard title={t("table.title")}>{renderTable()}</WidgetCard>
      </>
    );
  };

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="flex flex-col gap-6 px-6 pb-6">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <p className="text-xs text-muted-foreground">
          {t("subject", { subject })}
        </p>
        {renderBody()}
      </div>
    </div>
  );
}
