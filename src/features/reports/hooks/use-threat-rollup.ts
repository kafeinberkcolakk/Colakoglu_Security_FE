"use client";

import { useMemo } from "react";
import { usePayloadDetail } from "@/features/data/hooks/use-payload-detail";
import { usePayloads } from "@/features/data/hooks/use-payloads";
import {
  type ThreatRollup,
  rollUpThreats,
} from "@/features/reports/domain/threats";

interface UseThreatRollupResult {
  isLoading: boolean;
  rollup: ThreatRollup;
  subject: string;
}

export function useThreatRollup(subject: string): UseThreatRollupResult {
  const listQuery = usePayloads({
    query: { page: 0, size: 1, subject },
  });

  const latestId = listQuery.data?.content[0]?.id ?? "";
  const detailQuery = usePayloadDetail(latestId);

  const rollup = useMemo(
    () => rollUpThreats(detailQuery.data?.payload),
    [detailQuery.data?.payload],
  );

  return {
    isLoading:
      listQuery.isLoading || (latestId !== "" && detailQuery.isLoading),
    rollup,
    subject,
  };
}
