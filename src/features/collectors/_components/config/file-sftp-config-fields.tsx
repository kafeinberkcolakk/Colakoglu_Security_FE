"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollectorFormValues } from "@/features/collectors/schemas/collector-schema";

interface FileSftpConfigFieldsProps {
  form: UseFormReturn<CollectorFormValues>;
}

type StringKey =
  | "filePattern"
  | "host"
  | "password"
  | "processedDir"
  | "remoteDir"
  | "username";

const STRING_FIELDS: { key: StringKey; type?: string }[] = [
  { key: "host" },
  { key: "username" },
  { key: "password", type: "password" },
  { key: "remoteDir" },
  { key: "filePattern" },
  { key: "processedDir" },
];

export function FileSftpConfigFields({ form }: FileSftpConfigFieldsProps) {
  const t = useTranslations("page.collectors.form.config.fileSftp");
  const tValidation = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      {STRING_FIELDS.map((entry) => (
        <Controller
          control={form.control}
          key={entry.key}
          name={`config.${entry.key}` as `config.${StringKey}`}
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
        name="config.port"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collector-port">{t("port")}</Label>
            <Input
              id="collector-port"
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

      <Controller
        control={form.control}
        name="config.moveAfterDownload"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(field.value)}
              id="collector-moveAfter"
              onCheckedChange={(value) => field.onChange(value === true)}
            />
            <Label htmlFor="collector-moveAfter">
              {t("moveAfterDownload")}
            </Label>
          </div>
        )}
      />
    </div>
  );
}
