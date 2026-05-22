"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { WidgetCard } from "@/components/ui/widget-card";
import { cn } from "@/lib/utils";

export type MetricTone = "default" | "warning" | "critical";

const TONE_CARD: Record<MetricTone, string> = {
  critical: "border-destructive/60 ring-1 ring-destructive/15",
  default: "",
  warning: "border-amber-500/60 ring-1 ring-amber-500/15",
};

const TONE_VALUE: Record<MetricTone, string> = {
  critical: "text-destructive",
  default: "text-foreground",
  warning: "text-amber-600 dark:text-amber-400",
};

const TONE_CHIP: Record<MetricTone, string> = {
  critical: "bg-destructive/10 text-destructive",
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

interface MetricCardProps {
  className?: string;
  icon?: LucideIcon;
  subtitle?: string;
  title: string;
  tone?: MetricTone;
  unit?: string;
  value: ReactNode;
  viewAll?: string | (() => void);
}

export function MetricCard({
  className,
  icon: Icon,
  subtitle,
  title,
  tone = "default",
  unit,
  value,
  viewAll,
}: MetricCardProps) {
  return (
    <WidgetCard
      className={cn(TONE_CARD[tone], className)}
      subtitle={subtitle}
      title={title}
      viewAll={viewAll}
    >
      <div className="flex items-center gap-3">
        {Icon !== undefined && (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              TONE_CHIP[tone],
            )}
          >
            <Icon className="size-5" />
          </span>
        )}
        <p
          className={cn(
            "text-3xl font-semibold tabular-nums",
            TONE_VALUE[tone],
          )}
        >
          {value}
          {unit !== undefined && (
            <span className="ml-1 text-base font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      </div>
    </WidgetCard>
  );
}
