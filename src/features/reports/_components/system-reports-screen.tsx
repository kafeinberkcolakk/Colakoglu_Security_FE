"use client";

import { useTranslations } from "next-intl";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { WidgetGrid } from "@/components/widgets";
import { SYSTEM_REPORTS_WIDGETS } from "@/features/widgets/registry/system-reports-widgets";

export function SystemReportsScreen() {
  const t = useTranslations("page.reports.system");
  const tDashboard = useTranslations("page.dashboard");

  return (
    <div>
      <PageHeader title={t("title")}>
        <LiveIndicator label={tDashboard("live")} />
      </PageHeader>

      <div className="flex flex-col gap-3 px-6 pb-6">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <WidgetGrid
          registry={SYSTEM_REPORTS_WIDGETS}
          screenId="system-reports"
        />
      </div>
    </div>
  );
}
