"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryCount } from "@/features/security-dashboard/domain/metrics/metric-utils";

const CHART_HEIGHT = 280;
const DEFAULT_COLOR = "#0ea5e9";
const Y_AXIS_WIDTH = 130;
const GRADIENT_ID = "category-bar-gradient";
const GRADIENT_START_OPACITY = 0.55;
const GRADIENT_END_OPACITY = 1;
const BAR_CORNER = 4;
const BAR_RADIUS: [number, number, number, number] = [
  0,
  BAR_CORNER,
  BAR_CORNER,
  0,
];

const TOOLTIP_STYLE = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
} as const;

interface CategoryBarChartProps {
  color?: string;
  data: CategoryCount[];
  // Optional per-bar color override, keyed by label.
  highlight?: (item: CategoryCount) => string | undefined;
  height?: number;
}

export function CategoryBarChart({
  color = DEFAULT_COLOR,
  data,
  height = CHART_HEIGHT,
  highlight,
}: CategoryBarChartProps) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ bottom: 0, left: 0, right: 12, top: 8 }}
      >
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" x2="1" y1="0" y2="0">
            <stop
              offset="0%"
              stopColor={color}
              stopOpacity={GRADIENT_START_OPACITY}
            />
            <stop
              offset="100%"
              stopColor={color}
              stopOpacity={GRADIENT_END_OPACITY}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          horizontal={false}
          stroke="hsl(var(--border))"
          strokeDasharray="3 3"
        />
        <XAxis
          allowDecimals={false}
          fontSize={11}
          stroke="hsl(var(--foreground))"
          type="number"
        />
        <YAxis
          dataKey="label"
          fontSize={11}
          stroke="hsl(var(--foreground))"
          type="category"
          width={Y_AXIS_WIDTH}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: "hsl(var(--muted))" }}
        />
        <Bar dataKey="value" fill={`url(#${GRADIENT_ID})`} radius={BAR_RADIUS}>
          {data.map((item) => (
            <Cell
              fill={highlight?.(item) ?? `url(#${GRADIENT_ID})`}
              key={item.label}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
