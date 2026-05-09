"use client";

import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface WidgetStateProps {
  children: ReactNode;
  emptyTitle?: string;
  errorTitle?: string;
  isEmpty?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  loadingClassName?: string;
}

export function WidgetState({
  children,
  emptyTitle,
  errorTitle,
  isEmpty = false,
  isError = false,
  isLoading = false,
  loadingClassName = "h-full w-full",
}: WidgetStateProps) {
  if (isLoading) {
    return <Skeleton className={loadingClassName} />;
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
  return <>{children}</>;
}
