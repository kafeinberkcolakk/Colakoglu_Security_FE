"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { flowTypeRegistry } from "@/features/flows/_components/config/type-registry";
import type { FlowFormValues } from "@/features/flows/schemas/flow-schema";
import { FLOW_IDS, type FlowId } from "@/features/flows/types/flow";

interface FlowBaseFieldsProps {
  form: UseFormReturn<FlowFormValues>;
  isEdit: boolean;
  onFlowIdChange: (flowId: FlowId) => void;
}

export function FlowBaseFields({
  form,
  isEdit,
  onFlowIdChange,
}: FlowBaseFieldsProps) {
  const t = useTranslations("page.flows.form");
  const tValidation = useTranslations();
  const tTypes = useTranslations("page.flows.types");
  const flowId = form.watch("flowId");

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="flowId"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-type">{t("type")}</Label>
            <Select
              disabled={isEdit}
              onValueChange={(value) => onFlowIdChange(value as FlowId)}
              value={field.value}
            >
              <SelectTrigger id="flow-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FLOW_IDS.map((flowIdOption) => (
                  <SelectItem key={flowIdOption} value={flowIdOption}>
                    {tTypes(flowIdOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEdit && (
              <p className="text-xs text-muted-foreground">{t("typeLocked")}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-name">{t("name")}</Label>
            <Input
              id="flow-name"
              placeholder={t("namePlaceholder")}
              {...field}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive">
                {tValidation(fieldState.error.message ?? "validation.required")}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-description">{t("description")}</Label>
            <Textarea
              id="flow-description"
              placeholder={t("descriptionPlaceholder")}
              {...field}
            />
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="natsSubject"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-natsSubject">{t("natsSubject")}</Label>
            <Input
              id="flow-natsSubject"
              placeholder={t("natsSubjectPlaceholder")}
              {...field}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive">
                {tValidation(fieldState.error.message ?? "validation.required")}
              </p>
            )}
          </div>
        )}
      />

      {flowId !== "webhook_collector" && (
        <Controller
          control={form.control}
          name="cronExpression"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="flow-cron">{t("cronExpression")}</Label>
              <Input
                id="flow-cron"
                placeholder={t("cronPlaceholder")}
                {...field}
                value={field.value ?? ""}
              />
              <p className="text-xs text-muted-foreground">{t("cronHint")}</p>
              {fieldState.error && (
                <p className="text-xs text-destructive">
                  {tValidation(
                    fieldState.error.message ?? "validation.required",
                  )}
                </p>
              )}
            </div>
          )}
        />
      )}

      <Controller
        control={form.control}
        name="enabled"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={field.value}
              id="flow-enabled"
              onCheckedChange={(value) => field.onChange(value === true)}
            />
            <Label htmlFor="flow-enabled">{t("enabled")}</Label>
          </div>
        )}
      />
    </div>
  );
}

export function getDefaultsForFlowId(flowId: FlowId): FlowFormValues {
  return flowTypeRegistry[flowId].defaultValues();
}
