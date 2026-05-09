"use client";

import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
  label: string;
  paused?: boolean;
  pausedLabel?: string;
}

export function LiveIndicator({
  className,
  label,
  paused = false,
  pausedLabel,
}: LiveIndicatorProps) {
  if (paused) {
    return (
      <span
        className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground",
          className,
        )}
      >
        <span className="size-2 rounded-full bg-muted-foreground/60" />
        {pausedLabel ?? label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs text-emerald-500",
        className,
      )}
    >
      <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
      {label}
    </span>
  );
}
