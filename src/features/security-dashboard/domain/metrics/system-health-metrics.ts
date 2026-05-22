// qradar-system-health metrics — FE_DASHBOARD.md §5.6.
// Built from the two-part snapshot: notifications array + diagnostics object.

import type { HealthSnapshot } from "@/features/security-dashboard/domain/snapshot-parser";
import { asRecords, toNumber, toText } from "./metric-utils";

export interface SystemNotification {
  category: string;
  id: number;
  message: string;
  severity: string;
  timestamp: number;
}

export interface SystemHealthMetrics {
  cpuPercent: number | null;
  diskPercent: number | null;
  hasDiagnostics: boolean;
  memoryPercent: number | null;
  notifications: SystemNotification[];
  parsingErrors: number;
  problemNotificationCount: number;
}

function readPercent(
  diagnostics: Record<string, unknown>,
  key: string,
): number | null {
  const value = diagnostics[key];
  return typeof value === "number" ? value : null;
}

function toNotification(row: Record<string, unknown>): SystemNotification {
  return {
    category: toText(row.category),
    id: toNumber(row.id),
    message: toText(row.message),
    severity: toText(row.severity).toUpperCase(),
    timestamp: toNumber(row.timestamp),
  };
}

const PROBLEM_SEVERITIES = new Set(["WARN", "WARNING", "ERROR"]);

export function computeSystemHealthMetrics(
  snapshot: HealthSnapshot,
): SystemHealthMetrics {
  const notifications = asRecords(snapshot.notifications?.body)
    .map(toNotification)
    .sort((a, b) => b.timestamp - a.timestamp);

  const diagnosticsBody = snapshot.diagnostics?.body;
  const diagnostics =
    typeof diagnosticsBody === "object" &&
    diagnosticsBody !== null &&
    !Array.isArray(diagnosticsBody)
      ? (diagnosticsBody as Record<string, unknown>)
      : null;

  const problemNotificationCount = notifications.filter((item) =>
    PROBLEM_SEVERITIES.has(item.severity),
  ).length;

  return {
    cpuPercent:
      diagnostics === null
        ? null
        : readPercent(diagnostics, "cpu_usage_percent"),
    diskPercent:
      diagnostics === null
        ? null
        : readPercent(diagnostics, "disk_usage_percent"),
    hasDiagnostics: diagnostics !== null,
    memoryPercent:
      diagnostics === null
        ? null
        : readPercent(diagnostics, "memory_usage_percent"),
    notifications,
    parsingErrors:
      diagnostics === null ? 0 : toNumber(diagnostics.parsing_errors),
    problemNotificationCount,
  };
}
