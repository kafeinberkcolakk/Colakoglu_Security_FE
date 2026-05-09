"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
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
import { KvListInput } from "@/features/flows/_components/config/kv-list-input";
import type { FlowFormValues } from "@/features/flows/schemas/flow-schema";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

interface HttpRestConfigFieldsProps {
  form: UseFormReturn<FlowFormValues>;
}

export function HttpRestConfigFields({ form }: HttpRestConfigFieldsProps) {
  const t = useTranslations("page.flows.form.config.httpRest");
  const tValidation = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="parameters.httpUrl"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-url">{t("url")}</Label>
            <Input
              id="flow-url"
              placeholder={t("urlPlaceholder")}
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
        name="parameters.httpMethod"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-method">{t("method")}</Label>
            <Select
              onValueChange={field.onChange}
              value={typeof field.value === "string" ? field.value : "GET"}
            >
              <SelectTrigger id="flow-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="parameters.httpHeaders"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label>{t("headers")}</Label>
            <KvListInput
              keyPlaceholder={t("headerKeyPlaceholder")}
              onChange={field.onChange}
              value={Array.isArray(field.value) ? field.value : []}
              valuePlaceholder={t("headerValuePlaceholder")}
            />
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="parameters.httpBody"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flow-body">{t("body")}</Label>
            <Textarea
              id="flow-body"
              placeholder={t("bodyPlaceholder")}
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </div>
        )}
      />
    </div>
  );
}
