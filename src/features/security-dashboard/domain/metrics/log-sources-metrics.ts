// qradar-log-sources metrics — FE_DASHBOARD.md §5.5. `body` is a log-source array.

import {
  type CategoryCount,
  TOP_LIMIT,
  asRecords,
  toNumber,
  toText,
  topN,
} from "./metric-utils";

const MS_PER_HOUR = 3_600_000;
// A log source is "unhealthy" if enabled but silent longer than this.
const SILENT_THRESHOLD_MS = MS_PER_HOUR;

export interface LogSourceRow {
  averageEps: number;
  enabled: boolean;
  lastEventTime: number;
  name: string;
  status: string;
  typeName: string;
  unhealthy: boolean;
}

export interface LogSourcesMetrics {
  activeCount: number;
  inactiveCount: number;
  rows: LogSourceRow[];
  topEps: CategoryCount[];
  total: number;
  typeDistribution: CategoryCount[];
  unhealthyCount: number;
}

function readStatus(row: Record<string, unknown>): {
  lastEventTime: number;
  status: string;
} {
  const status = row.status;
  if (typeof status === "object" && status !== null) {
    const record = status as Record<string, unknown>;
    return {
      lastEventTime: toNumber(record.last_event_time),
      status: toText(record.status),
    };
  }
  return { lastEventTime: 0, status: toText(status) };
}

function readTypeName(row: Record<string, unknown>): string {
  const direct = toText(row.type_name);
  if (direct !== "") {
    return direct;
  }
  const nested = row.log_source_type;
  if (typeof nested === "object" && nested !== null) {
    return toText((nested as Record<string, unknown>).name);
  }
  return "";
}

function toLogSourceRow(row: Record<string, unknown>): LogSourceRow {
  const enabled = row.enabled === true;
  const { lastEventTime, status } = readStatus(row);
  const silent =
    lastEventTime > 0 && Date.now() - lastEventTime > SILENT_THRESHOLD_MS;
  const unhealthy =
    enabled && (silent || (status !== "" && status !== "SUCCESS"));
  return {
    averageEps: toNumber(row.average_eps),
    enabled,
    lastEventTime,
    name: toText(row.name),
    status,
    typeName: readTypeName(row),
    unhealthy,
  };
}

export function computeLogSourcesMetrics(body: unknown): LogSourcesMetrics {
  const records = asRecords(body);
  const rows = records.map(toLogSourceRow);

  const typeCounts = new Map<string, number>();
  for (const row of rows) {
    const key = row.typeName === "" ? "—" : row.typeName;
    typeCounts.set(key, (typeCounts.get(key) ?? 0) + 1);
  }

  const epsRows = rows.map((row) => ({
    label: row.name,
    value: row.averageEps,
  }));

  return {
    activeCount: rows.filter((row) => row.enabled).length,
    inactiveCount: rows.filter((row) => !row.enabled).length,
    rows,
    topEps: topN(epsRows, TOP_LIMIT),
    total: rows.length,
    typeDistribution: [...typeCounts.entries()].map(([label, value]) => ({
      label,
      value,
    })),
    unhealthyCount: rows.filter((row) => row.unhealthy).length,
  };
}

export function logSourcesTrendValue(body: unknown): number {
  return computeLogSourcesMetrics(body).unhealthyCount;
}
