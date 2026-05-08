"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BucketPoint } from "@/features/data/domain/bucket-aggregation";

const CHART_HEIGHT = 200;
const BAR_COLOR = "#22c55e";
const BAR_TOP_RADIUS = 4;
const BAR_BOTTOM_RADIUS = 0;
const BAR_RADIUS: [number, number, number, number] = [
  BAR_TOP_RADIUS,
  BAR_TOP_RADIUS,
  BAR_BOTTOM_RADIUS,
  BAR_BOTTOM_RADIUS,
];

interface SubjectActivityChartProps {
  data: BucketPoint[];
}

export function SubjectActivityChart({ data }: SubjectActivityChartProps) {
  return (
    <ResponsiveContainer height={CHART_HEIGHT} width="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={11} stroke="hsl(var(--foreground))" />
        <YAxis
          allowDecimals={false}
          fontSize={11}
          stroke="hsl(var(--foreground))"
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            color: "hsl(var(--foreground))",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill={BAR_COLOR} radius={BAR_RADIUS} />
      </BarChart>
    </ResponsiveContainer>
  );
}
