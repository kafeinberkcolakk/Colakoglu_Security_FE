import { useQuery } from "@tanstack/react-query";
import { dataApi } from "@/features/data/api/data-api";
import type { PayloadDetail } from "@/features/data/types/data";
import type { SecurityStateId } from "@/features/security-dashboard/domain/state-registry";
import { useVisiblePolling } from "@/hooks/use-visibility-pause";
import { SECURITY_REFETCH_INTERVAL_MS } from "@/lib/const/intervals";
import { SERVICE_PAYLOAD_SUBJECT } from "@/lib/const/pages";

// Latest snapshot recipe — FE_DASHBOARD.md §3.2:
//   payloads?productName=…&limit=1 → items[0].id → payloads/{id}
export interface StateSnapshot {
  detail: PayloadDetail | null;
  receivedAt: string | null;
}

async function loadSnapshot(productName: string): Promise<StateSnapshot> {
  const page = await dataApi.payloads({
    page: 0,
    productName,
    size: 1,
    subject: SERVICE_PAYLOAD_SUBJECT,
  });
  const first = page.content[0];
  if (first === undefined) {
    return { detail: null, receivedAt: null };
  }
  const detail = await dataApi.payloadDetail(first.id);
  return { detail, receivedAt: first.receivedAt };
}

export const stateSnapshotKey = (productName: SecurityStateId) =>
  ["security", "snapshot", productName] as const;

export function useStateSnapshot(productName: SecurityStateId) {
  const refetchInterval = useVisiblePolling(SECURITY_REFETCH_INTERVAL_MS);
  return useQuery({
    queryFn: () => loadSnapshot(productName),
    queryKey: stateSnapshotKey(productName),
    refetchInterval,
  });
}
