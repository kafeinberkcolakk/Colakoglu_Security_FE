"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { RESOURCE_COLORS, resourceLevel } from "@/lib/const/severity";

const CHART_HEIGHT = 200;
const FULL_PERCENT = 100;
const START_ANGLE = 90;
const END_ANGLE = -270;
const INNER_RADIUS = "70%";
const OUTER_RADIUS = "100%";
const TRACK_COLOR = "hsl(var(--muted))";

interface GaugeProps {
  height?: number;
  // 0-100 percentage; null renders an empty gauge.
  percent: number | null;
}

export function Gauge({ height = CHART_HEIGHT, percent }: GaugeProps) {
  const value = percent ?? 0;
  const color = RESOURCE_COLORS[resourceLevel(value)];
  const data = [{ fill: color, value }];

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <RadialBarChart
          barSize={16}
          data={data}
          endAngle={END_ANGLE}
          innerRadius={INNER_RADIUS}
          outerRadius={OUTER_RADIUS}
          startAngle={START_ANGLE}
        >
          <PolarAngleAxis
            angleAxisId={0}
            domain={[0, FULL_PERCENT]}
            tick={false}
            type="number"
          />
          <RadialBar
            angleAxisId={0}
            background={{ fill: TRACK_COLOR }}
            cornerRadius={8}
            dataKey="value"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">
          {percent === null ? "—" : `${Math.round(value)}%`}
        </span>
      </div>
    </div>
  );
}
