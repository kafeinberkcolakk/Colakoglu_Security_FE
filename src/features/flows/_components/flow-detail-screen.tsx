"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetGrid } from "@/components/widgets";
import { useFlowDetail } from "@/features/flows/hooks/use-flow-detail";
import { FLOW_DETAIL_WIDGETS } from "@/features/widgets/registry/flow-detail-widgets";

interface FlowDetailScreenProps {
  flowName: string;
}

export function FlowDetailScreen({ flowName }: FlowDetailScreenProps) {
  const t = useTranslations("page.flows.detail");
  const tCore = useTranslations("core");
  const { data: flow, isLoading } = useFlowDetail(flowName);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!flow) {
    return (
      <div>
        <PageHeader title={t("title")} />
        <div className="px-6 pb-6 text-sm text-muted-foreground">
          {tCore("noData")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={flow.name} />

      <div className="px-6 pb-6">
        <WidgetGrid
          flowName={flow.name}
          registry={FLOW_DETAIL_WIDGETS}
          screenId="flow-detail"
        />
      </div>
    </div>
  );
}
