"use client";

import { GripVertical, Maximize2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const WIDGET_DRAG_HANDLE_CLASS = "widget-drag-handle";

interface WidgetFrameProps {
  children: ReactNode;
  className?: string;
  editing: boolean;
  onMaximize: () => void;
  onRemove?: () => void;
  title: string;
}

export function WidgetFrame({
  children,
  className,
  editing,
  onMaximize,
  onRemove,
  title,
}: WidgetFrameProps) {
  const tCore = useTranslations("core");
  const tWidgets = useTranslations("widgets.actions");

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-border bg-card",
        editing && "ring-1 ring-primary/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {editing && (
            <span
              className={cn(
                WIDGET_DRAG_HANDLE_CLASS,
                "cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing",
              )}
              title={tWidgets("drag")}
            >
              <GripVertical className="size-4" />
            </span>
          )}
          <h3 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h3>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity",
            editing
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          )}
        >
          <button
            aria-label={tWidgets("maximize")}
            className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onMaximize}
            type="button"
          >
            <Maximize2 className="size-3.5" />
          </button>
          {editing && onRemove !== undefined && (
            <button
              aria-label={tCore("close")}
              className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
              type="button"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
    </div>
  );
}
