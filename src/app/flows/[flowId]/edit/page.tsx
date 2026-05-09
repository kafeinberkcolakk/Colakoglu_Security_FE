"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { FlowFormScreen } from "@/features/flows/_components/flow-form-screen";
import { useFlowDetail } from "@/features/flows/hooks/use-flow-detail";
import { toFormValues } from "@/features/flows/services/flow-mapper";

export default function EditFlowPage() {
  const params = useParams<{ flowId: string }>();
  const flowId = Number.parseInt(params.flowId, 10);
  const { data: flow, isLoading } = useFlowDetail(flowId);

  if (isLoading || !flow) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full max-w-3xl" />
        <Skeleton className="h-40 w-full max-w-3xl" />
      </div>
    );
  }

  return <FlowFormScreen defaultValues={toFormValues(flow)} flow={flow} />;
}
