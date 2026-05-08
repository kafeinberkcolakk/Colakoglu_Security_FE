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
import { collectorTypeRegistry } from "@/features/collectors/_components/config/type-registry";
import type { CollectorFormValues } from "@/features/collectors/schemas/collector-schema";
import {
  COLLECTOR_TYPES,
  type CollectorType,
} from "@/features/collectors/types/collector";

interface CollectorBaseFieldsProps {
  form: UseFormReturn<CollectorFormValues>;
  isEdit: boolean;
  onTypeChange: (type: CollectorType) => void;
}

export function CollectorBaseFields({
  form,
  isEdit,
  onTypeChange,
}: CollectorBaseFieldsProps) {
  const t = useTranslations("page.collectors.form");
  const tValidation = useTranslations();
  const tTypes = useTranslations("page.collectors.types");
  const type = form.watch("type");

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collector-type">{t("type")}</Label>
            <Select
              disabled={isEdit}
              onValueChange={(value) => onTypeChange(value as CollectorType)}
              value={field.value}
            >
              <SelectTrigger id="collector-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLLECTOR_TYPES.map((typeOption) => (
                  <SelectItem key={typeOption} value={typeOption}>
                    {tTypes(typeOption)}
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
            <Label htmlFor="collector-name">{t("name")}</Label>
            <Input
              id="collector-name"
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
        name="natsSubject"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collector-natsSubject">{t("natsSubject")}</Label>
            <Input
              id="collector-natsSubject"
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

      {type !== "WEBHOOK" && (
        <Controller
          control={form.control}
          name="intervalSeconds"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="collector-interval">{t("intervalSeconds")}</Label>
              <Input
                id="collector-interval"
                placeholder={t("intervalPlaceholder")}
                type="number"
                {...field}
                value={typeof field.value === "number" ? field.value : ""}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive">
                  {tValidation(
                    fieldState.error.message ?? "validation.positiveInt",
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
              id="collector-enabled"
              onCheckedChange={(value) => field.onChange(value === true)}
            />
            <Label htmlFor="collector-enabled">{t("enabled")}</Label>
          </div>
        )}
      />
    </div>
  );
}

export function getDefaultsForType(type: CollectorType): CollectorFormValues {
  return collectorTypeRegistry[type].defaultValues();
}
