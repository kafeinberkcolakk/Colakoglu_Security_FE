"use client";

import type { ReactNode } from "react";
import { WidgetCard } from "@/components/ui/widget-card";

interface MetricCardProps {
  className?: string;
  subtitle?: string;
  title: string;
  unit?: string;
  value: ReactNode;
  viewAll?: string | (() => void);
}

export function MetricCard({
  className,
  subtitle,
  title,
  unit,
  value,
  viewAll,
}: MetricCardProps) {
  return (
    <WidgetCard
      className={className}
      subtitle={subtitle}
      title={title}
      viewAll={viewAll}
    >
      <p className="text-3xl font-semibold text-foreground">
        {value}
        {unit !== undefined && (
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </WidgetCard>
  );
}
