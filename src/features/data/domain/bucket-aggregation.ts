import type { PayloadSummary } from "@/features/data/types/data";
import {
  HOURS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
} from "@/lib/const/intervals";

const FRESH_THRESHOLD_MINUTES = 5;
const FRESH_THRESHOLD_MS = FRESH_THRESHOLD_MINUTES * MS_PER_MINUTE;
const RECENT_THRESHOLD_MS = MS_PER_HOUR;
const STALE_THRESHOLD_MS = HOURS_PER_DAY * MS_PER_HOUR;

export type SubjectFreshness = "fresh" | "recent" | "stale" | "dormant";

export interface BucketPoint {
  count: number;
  hour: string;
  label: string;
}

function startOfHourIso(date: Date): string {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  return next.toISOString();
}

function formatHourLabel(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, "0");
  return `${hours}:00`;
}

function emptyBuckets(hours: number, now: Date): Map<string, number> {
  const start = new Date(now.getTime() - hours * MS_PER_HOUR);
  const buckets = new Map<string, number>();
  for (let offset = 0; offset <= hours; offset++) {
    const point = new Date(start.getTime() + offset * MS_PER_HOUR);
    buckets.set(startOfHourIso(point), 0);
  }
  return buckets;
}

function bucketsToPoints(buckets: Map<string, number>): BucketPoint[] {
  return Array.from(buckets.entries())
    .map(([hour, count]) => ({
      count,
      hour,
      label: formatHourLabel(hour),
    }))
    .sort((left, right) => left.hour.localeCompare(right.hour));
}

export function bucketByHour(
  payloads: PayloadSummary[],
  hours = HOURS_PER_DAY,
): BucketPoint[] {
  const now = new Date();
  const buckets = emptyBuckets(hours, now);
  const startMs = now.getTime() - hours * MS_PER_HOUR;

  for (const payload of payloads) {
    const time = Date.parse(payload.receivedAt);
    if (!Number.isFinite(time) || time < startMs) {
      continue;
    }
    const key = startOfHourIso(new Date(time));
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return bucketsToPoints(buckets);
}

export function bucketByHourBySubject(
  payloads: PayloadSummary[],
  hours = HOURS_PER_DAY,
): Map<string, BucketPoint[]> {
  const now = new Date();
  const startMs = now.getTime() - hours * MS_PER_HOUR;
  const perSubject = new Map<string, Map<string, number>>();

  for (const payload of payloads) {
    const time = Date.parse(payload.receivedAt);
    if (!Number.isFinite(time) || time < startMs) {
      continue;
    }
    let buckets = perSubject.get(payload.subject);
    if (!buckets) {
      buckets = emptyBuckets(hours, now);
      perSubject.set(payload.subject, buckets);
    }
    const key = startOfHourIso(new Date(time));
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  const result = new Map<string, BucketPoint[]>();
  for (const [subject, buckets] of perSubject.entries()) {
    result.set(subject, bucketsToPoints(buckets));
  }
  return result;
}

export function bucketByHourByProduct(
  payloads: PayloadSummary[],
  hours = HOURS_PER_DAY,
): Map<string, BucketPoint[]> {
  const now = new Date();
  const startMs = now.getTime() - hours * MS_PER_HOUR;
  const perProduct = new Map<string, Map<string, number>>();

  for (const payload of payloads) {
    const productName = payload.productName;
    if (productName === undefined || productName === "") {
      continue;
    }
    const time = Date.parse(payload.receivedAt);
    if (!Number.isFinite(time) || time < startMs) {
      continue;
    }
    let buckets = perProduct.get(productName);
    if (!buckets) {
      buckets = emptyBuckets(hours, now);
      perProduct.set(productName, buckets);
    }
    const key = startOfHourIso(new Date(time));
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  const result = new Map<string, BucketPoint[]>();
  for (const [productName, buckets] of perProduct.entries()) {
    result.set(productName, bucketsToPoints(buckets));
  }
  return result;
}

export function subjectFreshness(lastReceivedAt: string): SubjectFreshness {
  const lastTime = Date.parse(lastReceivedAt);
  if (!Number.isFinite(lastTime)) {
    return "dormant";
  }
  const elapsed = Date.now() - lastTime;
  if (elapsed < FRESH_THRESHOLD_MS) {
    return "fresh";
  }
  if (elapsed < RECENT_THRESHOLD_MS) {
    return "recent";
  }
  if (elapsed < STALE_THRESHOLD_MS) {
    return "stale";
  }
  return "dormant";
}

const FRESHNESS_CLASS: Record<SubjectFreshness, string> = {
  dormant: "text-muted-foreground",
  fresh: "text-emerald-500",
  recent: "text-sky-500",
  stale: "text-amber-500",
};

export function freshnessClass(freshness: SubjectFreshness): string {
  return FRESHNESS_CLASS[freshness];
}
