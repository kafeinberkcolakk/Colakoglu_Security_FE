import type { ReactNode } from "react";

export interface WidgetLayout {
  h: number;
  i: string;
  minH?: number;
  minW?: number;
  w: number;
  x: number;
  y: number;
}

export interface WidgetContext {
  flowId?: number;
  isMaximized: boolean;
}

export interface WidgetDefinition {
  defaultLayout: Omit<WidgetLayout, "i">;
  id: string;
  render: (ctx: WidgetContext) => ReactNode;
  titleKey: string;
}

export type WidgetRegistry = readonly WidgetDefinition[];
