"use client";

import { SEVERITY_COLORS, severityBucket } from "@/lib/const/severity";

interface SeverityBadgeProps {
  // QRadar 1-10 severity/magnitude score.
  score: number;
}

export function SeverityBadge({ score }: SeverityBadgeProps) {
  const color = SEVERITY_COLORS[severityBucket(score)];
  return (
    <span
      className="inline-flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold text-white"
      style={{ background: color }}
    >
      {score}
    </span>
  );
}
