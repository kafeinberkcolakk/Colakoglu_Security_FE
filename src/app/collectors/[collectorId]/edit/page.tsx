"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectorFormScreen } from "@/features/collectors/_components/collector-form-screen";
import { useCollectorDetail } from "@/features/collectors/hooks/use-collector-detail";
import { toFormValues } from "@/features/collectors/services/collector-mapper";

export default function EditCollectorPage() {
  const params = useParams<{ collectorId: string }>();
  const collectorId = params.collectorId;
  const { data: collector, isLoading } = useCollectorDetail(collectorId);

  if (isLoading || !collector) {
    return (
      <div className="flex flex-col gap-3 px-6 py-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full max-w-3xl" />
        <Skeleton className="h-40 w-full max-w-3xl" />
      </div>
    );
  }

  return (
    <CollectorFormScreen
      collector={collector}
      defaultValues={toFormValues(collector)}
    />
  );
}
