"use client";

import { Pencil, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetGrid } from "@/components/widgets";
import { useFlowDetail } from "@/features/flows/hooks/use-flow-detail";
import {
  useDeleteFlow,
  useRunFlow,
} from "@/features/flows/hooks/use-flow-mutations";
import { FLOW_DETAIL_WIDGETS } from "@/features/widgets/registry/flow-detail-widgets";
import { pageRoutes } from "@/lib/const/pages";

interface FlowDetailScreenProps {
  flowId: number;
}

export function FlowDetailScreen({ flowId }: FlowDetailScreenProps) {
  const router = useRouter();
  const t = useTranslations("page.flows.detail");
  const tCore = useTranslations("core");
  const tTypes = useTranslations("page.flows.types");
  const tDelete = useTranslations("page.flows.delete");

  const flowQuery = useFlowDetail(flowId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteFlow(() => {
    setConfirmOpen(false);
    router.push(pageRoutes.flows);
  });
  const runMutation = useRunFlow(flowId);

  const flow = flowQuery.data;

  if (flowQuery.isLoading || !flow) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={flow.name}>
        <span className="text-xs text-muted-foreground">
          {tTypes(flow.flowId)}
        </span>
        <Button
          disabled={runMutation.isPending}
          onClick={() => runMutation.mutate()}
          size="sm"
          variant="outline"
        >
          <Play className="size-4" />
          {t("run")}
        </Button>
        <Button asChild={true} size="sm" variant="outline">
          <Link href={pageRoutes.flowEdit(flow.id)}>
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
      </PageHeader>

      <div className="px-6 pb-6">
        <WidgetGrid
          flowId={flow.id}
          registry={FLOW_DETAIL_WIDGETS}
          screenId="flow-detail"
        />
      </div>

      <ConfirmDialog
        cancelLabel={tCore("cancel")}
        confirmLabel={tCore("yes")}
        description={tDelete("confirm", { name: flow.name })}
        onConfirm={() => deleteMutation.mutate(flow.id)}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
        title={tDelete("title")}
      />
    </div>
  );
}
