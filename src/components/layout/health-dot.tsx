"use client";

import { useTranslations } from "next-intl";
import { useHealthStatus } from "@/features/system/hooks/use-health-status";
import { cn } from "@/lib/utils";

function pickLabel(
  isLoading: boolean,
  isUp: boolean,
  loading: string,
  up: string,
  down: string,
): string {
  if (isLoading) {
    return loading;
  }
  return isUp ? up : down;
}

export function HealthDot() {
  const tCore = useTranslations("core");
  const { data, isLoading } = useHealthStatus();
  const isUp = data?.status === "UP";
  const label = pickLabel(
    isLoading,
    isUp,
    tCore("loading"),
    tCore("backendUp"),
    tCore("backendDown"),
  );

  return (
    <span
      className={cn(
        "size-2 rounded-full transition-colors",
        isUp ? "bg-emerald-400" : "bg-red-500",
      )}
      title={label}
    />
  );
}
