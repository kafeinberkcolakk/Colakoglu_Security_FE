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

const CHART_HEIGHT = 280;
const DEFAULT_COLOR = "#0ea5e9";
const GRADIENT_ID = "trend-area-gradient";
const FILL_OPACITY_TOP = 0.3;
const FILL_OPACITY_BOTTOM = 0;
const GRADIENT_TOP_OFFSET = "5%";
const GRADIENT_BOTTOM_OFFSET = "95%";

const TOOLTIP_STYLE = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--foreground))",
  fontSize: 12,
} as const;

export interface TrendPoint {
  label: string;
  value: number;
}

interface TrendLineChartProps {
  color?: string;
  data: TrendPoint[];
  height?: number;
}

export function TrendLineChart({
  color = DEFAULT_COLOR,
  data,
  height = CHART_HEIGHT,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset={GRADIENT_TOP_OFFSET}
              stopColor={color}
              stopOpacity={FILL_OPACITY_TOP}
            />
            <stop
              offset={GRADIENT_BOTTOM_OFFSET}
              stopColor={color}
              stopOpacity={FILL_OPACITY_BOTTOM}
            />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={11} stroke="hsl(var(--foreground))" />
        <YAxis
          allowDecimals={false}
          fontSize={11}
          stroke="hsl(var(--foreground))"
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area
          dataKey="value"
          fill={`url(#${GRADIENT_ID})`}
          stroke={color}
          strokeWidth={2}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
