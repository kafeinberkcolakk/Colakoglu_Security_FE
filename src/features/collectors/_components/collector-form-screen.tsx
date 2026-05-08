"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  CollectorBaseFields,
  getDefaultsForType,
} from "@/features/collectors/_components/collector-base-fields";
import { collectorTypeRegistry } from "@/features/collectors/_components/config/type-registry";
import {
  useCreateCollector,
  useUpdateCollector,
} from "@/features/collectors/hooks/use-collector-mutations";
import {
  CollectorFormSchema,
  type CollectorFormValues,
} from "@/features/collectors/schemas/collector-schema";
import {
  toCreateRequest,
  toUpdateRequest,
} from "@/features/collectors/services/collector-mapper";
import type {
  Collector,
  CollectorType,
} from "@/features/collectors/types/collector";
import { pageRoutes } from "@/lib/const/pages";

interface CollectorFormScreenProps {
  collector?: Collector;
  defaultValues: CollectorFormValues;
}

export function CollectorFormScreen({
  collector,
  defaultValues,
}: CollectorFormScreenProps) {
  const router = useRouter();
  const t = useTranslations("page.collectors.form");
  const tCore = useTranslations("core");
  const tValidation = useTranslations();
  const isEdit = collector !== undefined;

  const form = useForm<CollectorFormValues>({
    defaultValues,
    resolver: zodResolver(
      CollectorFormSchema,
    ) as unknown as Resolver<CollectorFormValues>,
  });

  const createMutation = useCreateCollector((created) => {
    router.push(pageRoutes.collectorDetail(created.id));
  });
  const updateMutation = useUpdateCollector(collector?.id ?? "", (updated) => {
    router.push(pageRoutes.collectorDetail(updated.id));
  });

  const handleTypeChange = (nextType: CollectorType) => {
    form.reset(getDefaultsForType(nextType));
  };

  const handleSubmit = (values: CollectorFormValues) => {
    if (isEdit) {
      updateMutation.mutate(toUpdateRequest(values));
    } else {
      createMutation.mutate(toCreateRequest(values));
    }
  };

  const type = form.watch("type");
  const secretIntent = form.watch("secretIntent");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const TypeFields = collectorTypeRegistry[type].Fields as React.ComponentType<{
    form: typeof form;
  }>;

  const showSecretInput = !isEdit || secretIntent === "change";

  return (
    <div>
      <PageHeader title={isEdit ? t("titleEdit") : t("titleNew")} />

      <form
        className="flex max-w-3xl flex-col gap-6 px-6 pb-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <CollectorBaseFields
          form={form}
          isEdit={isEdit}
          onTypeChange={handleTypeChange}
        />

        <section className="flex flex-col gap-3 rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("config.title")}
          </h2>
          <TypeFields form={form} />
        </section>

        <section className="flex flex-col gap-3 rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("secret.title")}
          </h2>

          {isEdit && (
            <Controller
              control={form.control}
              name="secretIntent"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value === "change"}
                    id="collector-secret-intent"
                    onCheckedChange={(value) =>
                      field.onChange(value === true ? "change" : "keep")
                    }
                  />
                  <Label htmlFor="collector-secret-intent">
                    {t("secret.changeToggle")}
                  </Label>
                  {collector?.hasSecret && field.value === "keep" && (
                    <span className="text-xs text-muted-foreground">
                      {t("secret.keepHint")}
                    </span>
                  )}
                </div>
              )}
            />
          )}

          {showSecretInput && (
            <Controller
              control={form.control}
              name="secret"
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="collector-secret">{t("secret.label")}</Label>
                  <Input
                    id="collector-secret"
                    placeholder={t("secret.placeholder")}
                    type="password"
                    {...field}
                    value={field.value ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("secret.hint")}
                  </p>
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
