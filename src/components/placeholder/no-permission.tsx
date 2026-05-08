import { useTranslations } from "next-intl";

export default function NoPermission() {
  const t = useTranslations();

  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
      <p className="max-w-md text-sm text-muted-foreground">
        {t("core.noPermission")}
      </p>
    </div>
  );
}
