"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CHART_HEIGHT = 280;
const INNER_RADIUS = 55;
const OUTER_RADIUS = 90;
const FALLBACK_COLOR = "#0ea5e9";

const TOOLTIP_STYLE = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
} as const;

export interface PieSlice {
  color?: string;
  label: string;
  value: number;
}

interface DistributionPieChartProps {
  data: PieSlice[];
  height?: number;
}

export function DistributionPieChart({
  data,
  height = CHART_HEIGHT,
}: DistributionPieChartProps) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={INNER_RADIUS}
          nameKey="label"
          outerRadius={OUTER_RADIUS}
          paddingAngle={2}
        >
          {data.map((slice) => (
            <Cell fill={slice.color ?? FALLBACK_COLOR} key={slice.label} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
