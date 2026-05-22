"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { WidgetGrid } from "@/components/widgets";
import {
  SectionDataProvider,
  useSectionData,
} from "@/features/security-dashboard/_components/section-data-provider";
import type { GridSectionProps } from "@/features/security-dashboard/_components/standard-grid-section";
import { StateSection } from "@/features/security-dashboard/_components/state-section";
import { SYSTEM_HEALTH_WIDGETS } from "@/features/security-dashboard/_components/widgets/system-health-widgets";
import {
  OK_STATUS,
  parseHealthSnapshot,
} from "@/features/security-dashboard/domain/snapshot-parser";
import type { SectionStatus } from "@/features/security-dashboard/hooks/use-section-context";

const STATE_ID = "qradar-system-health";
const SCREEN_ID = "security:system-health";

function SystemHealthSectionBody({
  editing,
  onEditingChange,
}: GridSectionProps) {
  const t = useTranslations("page.securityDashboard.states.systemHealth");
  const { detail, health, intervalSeconds, receivedAt, stale, status } =
    useSectionData();

  const snapshot = useMemo(
    () => (detail === null ? null : parseHealthSnapshot(detail)),
    [detail],
  );

  let finalStatus: SectionStatus = status;
  let statusCode: number | undefined;
  if (status === "ok" && snapshot !== null) {
    const responses = [snapshot.notifications, snapshot.diagnostics].filter(
      (part) => part !== null,
    );
    statusCode = responses[0]?.statusCode;
    const anyOk = responses.some((part) => part?.statusCode === OK_STATUS);
    if (responses.length === 0 || !anyOk) {
      finalStatus = "error";
    }
  }

  return (
    <StateSection
      health={health}
      intervalSeconds={intervalSeconds}
      receivedAt={receivedAt}
      sectionId={STATE_ID}
      stale={stale}
      status={finalStatus}
      statusCode={statusCode}
      subtitle={t("subtitle")}
      title={t("title")}
    >
      <WidgetGrid
        editing={editing}
        onEditingChange={onEditingChange}
        registry={SYSTEM_HEALTH_WIDGETS}
        screenId={SCREEN_ID}
      />
    </StateSection>
  );
}

export function SystemHealthSection(props: GridSectionProps) {
  return (
    <SectionDataProvider stateId={STATE_ID}>
      <SystemHealthSectionBody {...props} />
    </SectionDataProvider>
  );
}
