/** biome-ignore-all lint/style/useNamingConvention: `Renderer` is a component reference and must be PascalCase to be used as JSX */

"use client";

import type { ComponentType } from "react";
import { MessageFlowChart } from "@/features/data/_components/message-flow-chart";
import { SubjectActivityChart } from "@/features/data/_components/subject-activity-chart";
import type { BucketPoint } from "@/features/data/domain/bucket-aggregation";

// Open/Closed: new chart variants are added by extending this registry —
// callers never need to know which concrete component renders the variant.

export type BucketChartType = "area" | "bar";

interface BucketChartRendererProps {
  data: BucketPoint[];
}

interface BucketChartVariant {
  Renderer: ComponentType<BucketChartRendererProps>;
  labelKey: "area" | "bar";
}

const BUCKET_CHART_REGISTRY: Record<BucketChartType, BucketChartVariant> = {
  area: { labelKey: "area", Renderer: MessageFlowChart },
  bar: { labelKey: "bar", Renderer: SubjectActivityChart },
};

export const BUCKET_CHART_TYPES = Object.keys(
  BUCKET_CHART_REGISTRY,
) as BucketChartType[];

export function getBucketChartVariant(
  type: BucketChartType,
): BucketChartVariant {
  return BUCKET_CHART_REGISTRY[type];
}

interface BucketChartProps {
  data: BucketPoint[];
  type: BucketChartType;
}

export function BucketChart({ data, type }: BucketChartProps) {
  const { Renderer } = getBucketChartVariant(type);
  return <Renderer data={data} />;
}
