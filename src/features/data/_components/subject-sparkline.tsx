"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BucketPoint } from "@/features/data/domain/bucket-aggregation";

const SPARK_HEIGHT = 60;
const STROKE_COLOR = "#0ea5e9";
const FILL_OPACITY = 0.3;
const STROKE_WIDTH = 2;

interface SubjectSparklineProps {
  data: BucketPoint[];
}

export function SubjectSparkline({ data }: SubjectSparklineProps) {
  return (
    <ResponsiveContainer height={SPARK_HEIGHT} width="100%">
      <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 0, top: 4 }}>
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            color: "hsl(var(--foreground))",
            fontSize: 11,
            padding: "4px 8px",
          }}
          labelStyle={{ display: "none" }}
        />
        <Area
          dataKey="count"
          fill={STROKE_COLOR}
          fillOpacity={FILL_OPACITY}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_WIDTH}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
