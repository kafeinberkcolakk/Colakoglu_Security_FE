"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BucketPoint } from "@/features/data/domain/bucket-aggregation";

const CHART_HEIGHT = 280;
const STROKE_COLOR = "#0ea5e9";
const FILL_OPACITY = 0.25;

interface MessageFlowChartProps {
  data: BucketPoint[];
}

export function MessageFlowChart({ data }: MessageFlowChartProps) {
  return (
    <ResponsiveContainer height={CHART_HEIGHT} width="100%">
      <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
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
        <Area
          dataKey="count"
          fill={STROKE_COLOR}
          fillOpacity={FILL_OPACITY}
          stroke={STROKE_COLOR}
          strokeWidth={2}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
