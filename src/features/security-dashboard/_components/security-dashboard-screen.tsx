"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { GlobalKpiStrip } from "@/features/security-dashboard/_components/global-kpi-strip";
import { SystemHealthSection } from "@/features/security-dashboard/_components/sections/system-health-section";
import { StandardGridSection } from "@/features/security-dashboard/_components/standard-grid-section";
import { StateNav } from "@/features/security-dashboard/_components/state-nav";
import {
  FAILED_LOGINS_TREND_SNAPSHOTS,
  FAILED_LOGINS_WIDGETS,
} from "@/features/security-dashboard/_components/widgets/failed-logins-widgets";
import {
  FIREWALL_DENY_TREND_SNAPSHOTS,
  FIREWALL_DENY_WIDGETS,
} from "@/features/security-dashboard/_components/widgets/firewall-deny-widgets";
import { LOG_SOURCES_WIDGETS } from "@/features/security-dashboard/_components/widgets/log-sources-widgets";
import {
  OFFENSES_TREND_SNAPSHOTS,
  OFFENSES_WIDGETS,
} from "@/features/security-dashboard/_components/widgets/offenses-widgets";
import {
  TOP_ATTACKERS_TREND_SNAPSHOTS,
  TOP_ATTACKERS_WIDGETS,
} from "@/features/security-dashboard/_components/widgets/top-attackers-widgets";

export function SecurityDashboardScreen() {
  const t = useTranslations("page.securityDashboard");
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["security"] });
    queryClient.invalidateQueries({ queryKey: ["flows"] });
  };

  return (
    <div>
      <PageHeader title={t("title")}>
        <LiveIndicator label={t("live")} />
        <Button
          onClick={() => setEditing((prev) => !prev)}
          size="sm"
          variant={editing ? "default" : "outline"}
        >
          <LayoutGrid className="size-4" />
          {editing ? t("editLayoutDone") : t("editLayout")}
        </Button>
        <Button onClick={handleRefresh} size="sm" variant="outline">
          <RotateCw className="size-4" />
          {t("refresh")}
        </Button>
      </PageHeader>

      <div className="px-6 pb-6">
        <GlobalKpiStrip />
        <StateNav />
        <div className="flex flex-col gap-8">
          <StandardGridSection
            editing={editing}
            messageKey="offenses"
            onEditingChange={setEditing}
            registry={OFFENSES_WIDGETS}
            screenId="security:offenses"
            stateId="qradar-offenses"
            trendSnapshots={OFFENSES_TREND_SNAPSHOTS}
          />
          <StandardGridSection
            editing={editing}
            messageKey="failedLogins"
            onEditingChange={setEditing}
            registry={FAILED_LOGINS_WIDGETS}
            screenId="security:failed-logins"
            stateId="qradar-failed-logins"
            trendSnapshots={FAILED_LOGINS_TREND_SNAPSHOTS}
          />
          <StandardGridSection
            editing={editing}
            messageKey="topAttackers"
            onEditingChange={setEditing}
            registry={TOP_ATTACKERS_WIDGETS}
            screenId="security:top-attackers"
            stateId="qradar-top-attackers"
            trendSnapshots={TOP_ATTACKERS_TREND_SNAPSHOTS}
          />
          <StandardGridSection
            editing={editing}
            messageKey="firewallDeny"
            onEditingChange={setEditing}
            registry={FIREWALL_DENY_WIDGETS}
            screenId="security:firewall-deny"
            stateId="qradar-firewall-deny"
            trendSnapshots={FIREWALL_DENY_TREND_SNAPSHOTS}
          />
          <StandardGridSection
            editing={editing}
            messageKey="logSources"
            onEditingChange={setEditing}
            registry={LOG_SOURCES_WIDGETS}
            screenId="security:log-sources"
            stateId="qradar-log-sources"
          />
          <SystemHealthSection editing={editing} onEditingChange={setEditing} />
        </div>
      </div>
    </div>
  );
}
