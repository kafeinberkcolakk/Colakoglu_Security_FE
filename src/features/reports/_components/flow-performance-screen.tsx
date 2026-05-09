"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import { WidgetGrid } from "@/components/widgets";
import { FLOW_PERFORMANCE_WIDGETS } from "@/features/widgets/registry/flow-performance-widgets";

export function FlowPerformanceScreen() {
  const t = useTranslations("page.reports.flowPerformance");

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="flex flex-col gap-3 px-6 pb-6">
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <WidgetGrid
          registry={FLOW_PERFORMANCE_WIDGETS}
          screenId="flow-performance"
        />
      </div>
    </div>
  );
}
