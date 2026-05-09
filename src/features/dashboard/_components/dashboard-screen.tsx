"use client";

import { useTranslations } from "next-intl";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { PageHeader } from "@/components/ui/page-header";
import { WidgetGrid } from "@/components/widgets";
import { DASHBOARD_WIDGETS } from "@/features/widgets/registry/dashboard-widgets";

export function DashboardScreen() {
  const t = useTranslations("page.dashboard");

  return (
    <div>
      <PageHeader title={t("title")}>
        <LiveIndicator label={t("live")} />
      </PageHeader>

      <div className="px-6 pb-6">
        <WidgetGrid registry={DASHBOARD_WIDGETS} screenId="dashboard" />
      </div>
    </div>
  );
}
