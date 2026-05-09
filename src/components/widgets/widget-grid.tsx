"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetDefinition, WidgetRegistry } from "./types";
import { useWidgetLayout } from "./use-widget-layout";
import { WIDGET_DRAG_HANDLE_CLASS, WidgetFrame } from "./widget-frame";
import { WidgetMaximizeDialog } from "./widget-maximize-dialog";

const ROW_HEIGHT = 56;
const GRID_COLUMNS = 12;
const GRID_COLUMNS_SM = 6;
const GRID_GAP_PX = 12;
const BREAKPOINT_LG = 1200;
const BREAKPOINT_MD = 996;
const BREAKPOINT_SM = 768;
const GRID_MARGIN: [number, number] = [GRID_GAP_PX, GRID_GAP_PX];

const ResponsiveGridLayout = dynamic(
  () =>
    import("react-grid-layout").then((mod) =>
      mod.WidthProvider(mod.Responsive),
    ),
  { loading: () => <Skeleton className="h-96 w-full" />, ssr: false },
);

interface WidgetGridProps {
  flowId?: number;
  registry: WidgetRegistry;
  screenId: string;
}

export function WidgetGrid({ flowId, registry, screenId }: WidgetGridProps) {
  const tWidgets = useTranslations("widgets");
  const layoutCtl = useWidgetLayout(screenId, registry);
  const [maximized, setMaximized] = useState<WidgetDefinition | null>(null);

  const visibleLayouts = layoutCtl.layout.filter((entry) =>
    layoutCtl.visibleDefinitions.some((def) => def.id === entry.i),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2">
        <button
          className="rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          onClick={() => layoutCtl.setEditing(!layoutCtl.editing)}
          type="button"
        >
          {layoutCtl.editing
            ? tWidgets("actions.done")
            : tWidgets("actions.edit")}
        </button>
        {layoutCtl.editing && (
          <button
            className="rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            onClick={() => layoutCtl.reset()}
            type="button"
          >
            {tWidgets("actions.reset")}
          </button>
        )}
      </div>

      <ResponsiveGridLayout
        breakpoints={{
          lg: BREAKPOINT_LG,
          md: BREAKPOINT_MD,
          sm: BREAKPOINT_SM,
        }}
        cols={{
          lg: GRID_COLUMNS,
          md: GRID_COLUMNS,
          sm: GRID_COLUMNS_SM,
        }}
        draggableHandle={`.${WIDGET_DRAG_HANDLE_CLASS}`}
        isDraggable={layoutCtl.editing}
        isResizable={layoutCtl.editing}
        layouts={{ lg: visibleLayouts, md: visibleLayouts, sm: visibleLayouts }}
        margin={GRID_MARGIN}
        onLayoutChange={(next) => {
          if (layoutCtl.editing) {
            layoutCtl.setLayout(next);
          }
        }}
        rowHeight={ROW_HEIGHT}
      >
        {layoutCtl.visibleDefinitions.map((def) => (
          <div key={def.id}>
            <WidgetFrame
              editing={layoutCtl.editing}
              onMaximize={() => setMaximized(def)}
              onRemove={() => layoutCtl.hideWidget(def.id)}
              title={tWidgets(def.titleKey)}
            >
              {def.render({ flowId, isMaximized: false })}
            </WidgetFrame>
          </div>
        ))}
      </ResponsiveGridLayout>

      <WidgetMaximizeDialog
        onOpenChange={(open) => {
          if (!open) {
            setMaximized(null);
          }
        }}
        open={maximized !== null}
        title={maximized ? tWidgets(maximized.titleKey) : ""}
      >
        {maximized?.render({ flowId, isMaximized: true })}
      </WidgetMaximizeDialog>
    </div>
  );
}
