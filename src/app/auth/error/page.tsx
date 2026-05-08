import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { apiRoutes, pageRoutes } from "@/lib/const/pages";

export default async function AuthErrorPage() {
  const t = await getTranslations();
  const loginHref = `${apiRoutes.login}?returnUrl=${encodeURIComponent(pageRoutes.home)}`;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title={t("page.authError.title")} />
      <div className="px-6 pb-6">
        <div className="max-w-2xl rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            {t("page.authError.description")}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button asChild={true}>
              <a href={loginHref}>{t("page.authError.actions.retry")}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
