import type { PayloadSummary, ProductStats } from "@/features/data/types/data";

export function aggregateProducts(rows: PayloadSummary[]): ProductStats[] {
  const map = new Map<string, ProductStats>();
  for (const row of rows) {
    const name = row.productName;
    if (name === undefined || name === "") {
      continue;
    }
    const existing = map.get(name);
    if (existing === undefined) {
      map.set(name, {
        lastReceivedAt: row.receivedAt,
        messageCount: 1,
        productName: name,
      });
    } else {
      existing.messageCount += 1;
      if (row.receivedAt > existing.lastReceivedAt) {
        existing.lastReceivedAt = row.receivedAt;
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => b.messageCount - a.messageCount,
  );
}
