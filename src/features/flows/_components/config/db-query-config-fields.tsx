"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FlowFormValues } from "@/features/flows/schemas/flow-schema";

interface DbQueryConfigFieldsProps {
  form: UseFormReturn<FlowFormValues>;
}

interface FieldDef {
  key: "jdbcPassword" | "jdbcUrl" | "jdbcUser";
  labelKey: "jdbcUrl" | "password" | "username";
  type?: string;
}

const TEXT_FIELDS: FieldDef[] = [
  { key: "jdbcUrl", labelKey: "jdbcUrl" },
  { key: "jdbcUser", labelKey: "username" },
  { key: "jdbcPassword", labelKey: "password", type: "password" },
];

export function DbQueryConfigFields({ form }: DbQueryConfigFieldsProps) {
  const t = useTranslations("page.flows.form.config.dbQuery");
  const tValidation = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      {TEXT_FIELDS.map((entry) => (
        <Controller
          control={form.control}
          key={entry.key}
          name={`parameters.${entry.key}` as `parameters.${typeof entry.key}`}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`flow-${entry.key}`}>{t(entry.labelKey)}</Label>
              <Input
                id={`flow-${entry.key}`}
                placeholder={t(`${entry.labelKey}Placeholder`)}
                type={entry.type}
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
              />
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
      ))}

      <Controller
        control={form.control}
        name="parameters.sql"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-sql">{t("sql")}</Label>
            <Textarea
              className="min-h-32 font-mono"
              id="flow-sql"
              placeholder={t("sqlPlaceholder")}
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
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
        name="parameters.fetchSize"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-fetchSize">{t("fetchSize")}</Label>
            <Input
              id="flow-fetchSize"
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
    </div>
  );
}
