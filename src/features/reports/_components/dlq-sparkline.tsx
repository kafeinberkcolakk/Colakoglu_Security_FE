"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { DlqBucket } from "@/features/reports/domain/dlq-bucket";

const SPARKLINE_HEIGHT = 200;

interface DlqSparklineProps {
  buckets: DlqBucket[];
}

function formatHour(iso: unknown): string {
  if (typeof iso !== "string") {
    return "";
  }
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:00`;
}

export function DlqSparkline({ buckets }: DlqSparklineProps) {
  return (
    <ResponsiveContainer height={SPARKLINE_HEIGHT} width="100%">
      <AreaChart data={buckets}>
        <XAxis
          dataKey="hour"
          fontSize={11}
          stroke="currentColor"
          tickFormatter={formatHour}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelFormatter={formatHour}
        />
        <Area
          dataKey="count"
          fill="#ef4444"
          fillOpacity={0.18}
          stroke="#ef4444"
          strokeWidth={2}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
