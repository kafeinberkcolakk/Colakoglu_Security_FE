"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { SubjectSparkline } from "@/features/data/_components/subject-sparkline";
import {
  type BucketPoint,
  bucketByHourByProduct,
  freshnessClass,
  subjectFreshness,
} from "@/features/data/domain/bucket-aggregation";
import { aggregateProducts } from "@/features/data/domain/product-aggregation";
import type { PayloadSummary } from "@/features/data/types/data";
import { useRelativeLabels } from "@/hooks/use-relative-labels";
import { pageRoutes } from "@/lib/const/pages";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

const TOP_PRODUCTS_LIMIT = 6;

interface ProductFlowGridProps {
  payloads: PayloadSummary[];
}

interface ProductFlowEntry {
  buckets: BucketPoint[];
  lastReceivedAt: string;
  messageCount: number;
  productName: string;
}

export function ProductFlowGrid({ payloads }: ProductFlowGridProps) {
  const t = useTranslations("page.dashboard.productFlows");
  const relativeLabels = useRelativeLabels();

  const entries = useMemo<ProductFlowEntry[]>(() => {
    const bucketsByProduct = bucketByHourByProduct(payloads);
    return aggregateProducts(payloads)
      .slice(0, TOP_PRODUCTS_LIMIT)
      .map((stat) => ({
        buckets: bucketsByProduct.get(stat.productName) ?? [],
        lastReceivedAt: stat.lastReceivedAt,
        messageCount: stat.messageCount,
        productName: stat.productName,
      }));
  }, [payloads]);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => {
        const freshness = subjectFreshness(entry.lastReceivedAt);
        return (
          <Link
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary"
            href={pageRoutes.dataProductDetail(entry.productName)}
            key={entry.productName}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-semibold text-foreground">
                  {entry.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("messageCount", { count: entry.messageCount })}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  freshnessClass(freshness),
                )}
              >
                {formatRelative(entry.lastReceivedAt, relativeLabels)}
              </span>
            </div>
            <SubjectSparkline data={entry.buckets} />
          </Link>
        );
      })}
    </div>
  );
}
