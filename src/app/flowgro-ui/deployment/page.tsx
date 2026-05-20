import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui/page-header";
import { FlowgroIframe } from "@/features/flowgro/_components/flowgro-iframe";

export default async function FlowgroDeploymentPage() {
  const t = await getTranslations("page.flowgro");

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <PageHeader title={t("deployment.title")} />
      <div className="min-h-0 flex-1 px-6 pb-6">
        <FlowgroIframe
          path="/flowgro/deployment"
          title={t("deployment.title")}
        />
      </div>
    </div>
  );
}
