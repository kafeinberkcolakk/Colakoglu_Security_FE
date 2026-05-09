import { useTranslations } from "next-intl";

export function WebhookConfigFields() {
  const t = useTranslations("page.flows.form.config.webhook");

  return (
    <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      {t("hint")}
    </div>
  );
}
