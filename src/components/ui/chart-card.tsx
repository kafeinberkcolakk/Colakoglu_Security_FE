"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/ui/widget-card";

const DEFAULT_CHART_HEIGHT = 280;

interface ChartCardProps {
  children: ReactNode;
  className?: string;
  emptyTitle?: string;
  errorTitle?: string;
  height?: number;
  isEmpty?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  onMaximize?: () => void;
  subtitle?: string;
  title: string;
  viewAll?: string | (() => void);
}

export function ChartCard({
  children,
  className,
  emptyTitle,
  errorTitle,
  height = DEFAULT_CHART_HEIGHT,
  isEmpty = false,
  isError = false,
  isLoading = false,
  onMaximize,
  subtitle,
  title,
  viewAll,
}: ChartCardProps) {
  const renderState = () => {
    if (isLoading) {
      return <Skeleton className="h-full w-full" style={{ height }} />;
    }
    if (isError) {
      return (
        <EmptyState
          description={errorTitle}
          icon={AlertCircle}
          title={errorTitle ?? "Error"}
        />
      );
    }
    if (isEmpty) {
      return <EmptyState title={emptyTitle ?? "—"} />;
    }
    return children;
  };

  return (
    <WidgetCard
      className={className}
      onMaximize={onMaximize}
      subtitle={subtitle}
      title={title}
      viewAll={viewAll}
    >
      <div style={{ minHeight: height }}>{renderState()}</div>
    </WidgetCard>
  );
}
