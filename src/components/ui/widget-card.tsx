"use client";

import { GripVertical, Maximize2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  /**
   * Pass a URL string to render a Next.js Link,
   * or a callback function to render a plain button.
   */
  viewAll?: string | (() => void);
  onMaximize?: () => void;
  className?: string;
  children: ReactNode;
}

export function WidgetCard({
  title,
  subtitle,
  viewAll,
  onMaximize,
  className,
  children,
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-1.5">
          <GripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {viewAll &&
            (typeof viewAll === "string" ? (
              <Link
                className="text-xs font-medium text-primary hover:underline"
                href={viewAll}
              >
                View All
              </Link>
            ) : (
              <button
                className="text-xs font-medium text-primary hover:underline"
                onClick={viewAll}
                type="button"
              >
                View All
              </button>
            ))}
          <button
            className="flex size-6 items-center justify-center rounded border border-border bg-background transition-colors hover:bg-muted"
            onClick={onMaximize}
            type="button"
          >
            <Maximize2 className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1">{children}</div>
    </div>
  );
}
