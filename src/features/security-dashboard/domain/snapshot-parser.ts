// Unwraps the CollectorEvent envelope (FE_DASHBOARD.md §3.1) and parses the
// QRadar `body` string. system-health uses a different `parts[]` shape (§5.6).

import { parseMaybeJson } from "@/features/data/services/payload-derivation";
import type { PayloadDetail } from "@/features/data/types/data";

const UNKNOWN_STATUS = -1;
export const OK_STATUS = 200;

export interface SnapshotResponse {
  body: unknown;
  endpoint: string;
  statusCode: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function getResponse(detail: PayloadDetail): Record<string, unknown> | null {
  const payload = asRecord(parseMaybeJson(detail.payload));
  if (payload === null) {
    return null;
  }
  return asRecord(payload.response);
}

function toResponse(source: Record<string, unknown>): SnapshotResponse {
  return {
    body: parseMaybeJson(source.body),
    endpoint: typeof source.endpoint === "string" ? source.endpoint : "",
    statusCode:
      typeof source.statusCode === "number"
        ? source.statusCode
        : UNKNOWN_STATUS,
  };
}

// Single-endpoint states (offenses, ariel states, log-sources).
export function parseSnapshot(detail: PayloadDetail): SnapshotResponse | null {
  const response = getResponse(detail);
  if (response === null) {
    return null;
  }
  return toResponse(response);
}

export interface HealthSnapshot {
  diagnostics: SnapshotResponse | null;
  notifications: SnapshotResponse | null;
}

// system-health combines two GETs into `response.parts[]`; match by endpoint
// path rather than relying on array order (FE_DASHBOARD.md §5.6).
export function parseHealthSnapshot(detail: PayloadDetail): HealthSnapshot {
  const response = getResponse(detail);
  const parts =
    response !== null && Array.isArray(response.parts) ? response.parts : [];

  let notifications: SnapshotResponse | null = null;
  let diagnostics: SnapshotResponse | null = null;

  for (const part of parts) {
    const record = asRecord(part);
    if (record === null) {
      continue;
    }
    const parsed = toResponse(record);
    if (parsed.endpoint.includes("notifications")) {
      notifications = parsed;
    } else if (parsed.endpoint.includes("diagnostics")) {
      diagnostics = parsed;
    }
  }

  return { diagnostics, notifications };
}
