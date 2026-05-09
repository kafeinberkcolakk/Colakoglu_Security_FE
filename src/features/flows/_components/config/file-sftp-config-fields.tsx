"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FlowFormValues } from "@/features/flows/schemas/flow-schema";

interface FileSftpConfigFieldsProps {
  form: UseFormReturn<FlowFormValues>;
}

type StringKey =
  | "sftpFilePattern"
  | "sftpHost"
  | "sftpPassword"
  | "sftpProcessedDir"
  | "sftpRemoteDir"
  | "sftpUser";

interface FieldDef {
  key: StringKey;
  labelKey:
    | "filePattern"
    | "host"
    | "password"
    | "processedDir"
    | "remoteDir"
    | "username";
  type?: string;
}

const STRING_FIELDS: FieldDef[] = [
  { key: "sftpHost", labelKey: "host" },
  { key: "sftpUser", labelKey: "username" },
  { key: "sftpPassword", labelKey: "password", type: "password" },
  { key: "sftpRemoteDir", labelKey: "remoteDir" },
  { key: "sftpFilePattern", labelKey: "filePattern" },
  { key: "sftpProcessedDir", labelKey: "processedDir" },
];

export function FileSftpConfigFields({ form }: FileSftpConfigFieldsProps) {
  const t = useTranslations("page.flows.form.config.fileSftp");
  const tValidation = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      {STRING_FIELDS.map((entry) => (
        <Controller
          control={form.control}
          key={entry.key}
          name={`parameters.${entry.key}` as `parameters.${StringKey}`}
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
        name="parameters.sftpPort"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-port">{t("port")}</Label>
            <Input
              id="flow-port"
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
        name="parameters.sftpMoveAfterDownload"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={Boolean(field.value)}
              id="flow-moveAfter"
              onCheckedChange={(value) => field.onChange(value === true)}
            />
            <Label htmlFor="flow-moveAfter">{t("moveAfterDownload")}</Label>
          </div>
        )}
      />
    </div>
  );
}
