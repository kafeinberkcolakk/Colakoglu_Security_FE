// Defensive coercion + aggregation helpers shared by every state's metrics.
// QRadar field names vary by version, so every read tolerates missing/typed-wrong values.

// Ariel AQL result columns have no alias → the count key is the literal "COUNT(*)".
export const ARIEL_COUNT_KEY = "COUNT(*)";

export interface CategoryCount {
  label: string;
  value: number;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asRecords(value: unknown): Record<string, unknown>[] {
  return asArray(value).filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}

// Ariel states return `{ events: [...] }`; everything else returns a bare array.
export function arielEvents(body: unknown): Record<string, unknown>[] {
  if (typeof body === "object" && body !== null && !Array.isArray(body)) {
    return asRecords((body as Record<string, unknown>).events);
  }
  return [];
}

export function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function toText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

export function sumField(
  records: Record<string, unknown>[],
  field: string,
): number {
  return records.reduce((total, row) => total + toNumber(row[field]), 0);
}

export function groupSum(
  records: Record<string, unknown>[],
  labelField: string,
  valueField: string,
): CategoryCount[] {
  const totals = new Map<string, number>();
  for (const row of records) {
    const label = toText(row[labelField]);
    if (label === "") {
      continue;
    }
    totals.set(label, (totals.get(label) ?? 0) + toNumber(row[valueField]));
  }
  return [...totals.entries()].map(([label, value]) => ({ label, value }));
}

export function topN(items: CategoryCount[], limit: number): CategoryCount[] {
  return [...items].sort((a, b) => b.value - a.value).slice(0, limit);
}

export const TOP_LIMIT = 10;
export const FLOW_PAIR_LIMIT = 20;
