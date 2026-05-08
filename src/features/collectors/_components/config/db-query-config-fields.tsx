"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CollectorFormValues } from "@/features/collectors/schemas/collector-schema";

interface DbQueryConfigFieldsProps {
  form: UseFormReturn<CollectorFormValues>;
}

interface FieldDef {
  key: "fetchSize" | "jdbcUrl" | "password" | "username";
  type?: string;
}

const TEXT_FIELDS: FieldDef[] = [
  { key: "jdbcUrl" },
  { key: "username" },
  { key: "password", type: "password" },
];

export function DbQueryConfigFields({ form }: DbQueryConfigFieldsProps) {
  const t = useTranslations("page.collectors.form.config.dbQuery");
  const tValidation = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      {TEXT_FIELDS.map((entry) => (
        <Controller
          control={form.control}
          key={entry.key}
          name={`config.${entry.key}` as `config.${typeof entry.key}`}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`collector-${entry.key}`}>{t(entry.key)}</Label>
              <Input
                id={`collector-${entry.key}`}
                placeholder={t(`${entry.key}Placeholder`)}
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
        name="config.sql"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collector-sql">{t("sql")}</Label>
            <Textarea
              className="min-h-32 font-mono"
              id="collector-sql"
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
        name="config.fetchSize"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collector-fetchSize">{t("fetchSize")}</Label>
            <Input
              id="collector-fetchSize"
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
