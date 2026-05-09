"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { flowTypeRegistry } from "@/features/flows/_components/config/type-registry";
import {
  FlowBaseFields,
  getDefaultsForFlowId,
} from "@/features/flows/_components/flow-base-fields";
import {
  useCreateFlow,
  useUpdateFlow,
} from "@/features/flows/hooks/use-flow-mutations";
import {
  FlowFormSchema,
  type FlowFormValues,
} from "@/features/flows/schemas/flow-schema";
import {
  toCreateRequest,
  toUpdateRequest,
} from "@/features/flows/services/flow-mapper";
import type { Flow, FlowId } from "@/features/flows/types/flow";
import { pageRoutes } from "@/lib/const/pages";

interface FlowFormScreenProps {
  defaultValues: FlowFormValues;
  flow?: Flow;
}

export function FlowFormScreen({ flow, defaultValues }: FlowFormScreenProps) {
  const router = useRouter();
  const t = useTranslations("page.flows.form");
  const tCore = useTranslations("core");
  const isEdit = flow !== undefined;

  const form = useForm<FlowFormValues>({
    defaultValues,
    resolver: zodResolver(
      FlowFormSchema,
    ) as unknown as Resolver<FlowFormValues>,
  });

  const createMutation = useCreateFlow((id) => {
    router.push(pageRoutes.flowDetail(id));
  });
  const updateMutation = useUpdateFlow(flow?.id ?? 0, () => {
    if (flow !== undefined) {
      router.push(pageRoutes.flowDetail(flow.id));
    }
  });

  const handleFlowIdChange = (nextFlowId: FlowId) => {
    form.reset(getDefaultsForFlowId(nextFlowId));
  };

  const handleSubmit = (values: FlowFormValues) => {
    if (isEdit && flow !== undefined) {
      updateMutation.mutate(toUpdateRequest(flow.id, values));
    } else {
      createMutation.mutate(toCreateRequest(values));
    }
  };

  const flowId = form.watch("flowId");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const TypeFields = flowTypeRegistry[flowId].Fields as React.ComponentType<{
    form: typeof form;
  }>;

  return (
    <div>
      <PageHeader title={isEdit ? t("titleEdit") : t("titleNew")} />

      <form
        className="flex max-w-3xl flex-col gap-6 px-6 pb-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FlowBaseFields
          form={form}
          isEdit={isEdit}
          onFlowIdChange={handleFlowIdChange}
        />

        <section className="flex flex-col gap-3 rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("config.title")}
          </h2>
          <TypeFields form={form} />
        </section>

        <div className="flex gap-2">
          <Button disabled={isPending} type="submit">
            {tCore("save")}
          </Button>
          <Button
            disabled={isPending}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            {tCore("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
