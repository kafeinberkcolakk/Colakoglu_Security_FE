"use client";

import { useTranslations } from "next-intl";
import { WidgetGrid, type WidgetRegistry } from "@/components/widgets";
import {
  SectionDataProvider,
  useSectionData,
} from "@/features/security-dashboard/_components/section-data-provider";
import { StateSection } from "@/features/security-dashboard/_components/state-section";
import type { SecurityStateId } from "@/features/security-dashboard/domain/state-registry";
import { withResponseStatus } from "@/features/security-dashboard/hooks/use-section-context";

// Generic section shell for the 5 single-endpoint QRadar states (offenses,
// failed-logins, top-attackers, firewall-deny, log-sources). system-health has
// its own section because its two-part response needs different status logic.
export interface GridSectionProps {
  editing: boolean;
  onEditingChange: (next: boolean) => void;
}

interface StandardGridSectionProps extends GridSectionProps {
  messageKey: string;
  registry: WidgetRegistry;
  screenId: string;
  stateId: SecurityStateId;
  trendSnapshots?: number;
}

function StandardGridSectionBody({
  editing,
  messageKey,
  onEditingChange,
  registry,
  screenId,
  stateId,
}: Omit<StandardGridSectionProps, "trendSnapshots">) {
  const t = useTranslations(`page.securityDashboard.states.${messageKey}`);
  const { health, intervalSeconds, parsed, receivedAt, stale, status } =
    useSectionData();

  return (
    <StateSection
      health={health}
      intervalSeconds={intervalSeconds}
      receivedAt={receivedAt}
      sectionId={stateId}
      stale={stale}
      status={withResponseStatus(status, parsed)}
      statusCode={parsed?.statusCode}
      subtitle={t("subtitle")}
      title={t("title")}
    >
      <WidgetGrid
        editing={editing}
        onEditingChange={onEditingChange}
        registry={registry}
        screenId={screenId}
      />
    </StateSection>
  );
}

export function StandardGridSection({
  trendSnapshots,
  ...body
}: StandardGridSectionProps) {
  return (
    <SectionDataProvider stateId={body.stateId} trendSnapshots={trendSnapshots}>
      <StandardGridSectionBody {...body} />
    </SectionDataProvider>
  );
}
