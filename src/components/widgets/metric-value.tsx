import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricValueProps {
  className?: string;
  hint?: string;
  unit?: string;
  value: ReactNode;
}

export function MetricValue({
  className,
  hint,
  unit,
  value,
}: MetricValueProps) {
  return (
    <div
      className={cn("flex h-full flex-col justify-between gap-1", className)}
    >
      <p className="text-3xl font-semibold text-foreground">
        {value}
        {unit !== undefined && (
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      {hint !== undefined && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
