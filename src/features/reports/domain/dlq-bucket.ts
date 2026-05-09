import type { DlqEntry } from "@/features/dlq/types/dlq";
import { HOURS_PER_DAY, MS_PER_HOUR } from "@/lib/const/intervals";

export interface DlqBucket {
  count: number;
  hour: string;
}

export function bucketDlqByHour(entries: DlqEntry[]): DlqBucket[] {
  const since = Date.now() - HOURS_PER_DAY * MS_PER_HOUR;
  const buckets = new Map<string, number>();

  for (let i = 0; i < HOURS_PER_DAY; i += 1) {
    const ts = new Date(since + i * MS_PER_HOUR);
    ts.setMinutes(0, 0, 0);
    buckets.set(ts.toISOString(), 0);
  }

  for (const entry of entries) {
    const occurred = new Date(entry.occurredAt).getTime();
    if (occurred < since) {
      continue;
    }
    const ts = new Date(occurred);
    ts.setMinutes(0, 0, 0);
    const key = ts.toISOString();
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .map(([hour, count]) => ({ count, hour }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}
