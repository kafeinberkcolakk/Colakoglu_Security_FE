"use client";

import { AreaChart, BarChart3, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type BucketChartType,
  getBucketChartVariant,
} from "@/components/charts/bucket-chart";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<BucketChartType, LucideIcon> = {
  area: AreaChart,
  bar: BarChart3,
};

interface ChartTypePickerProps {
  className?: string;
  onChange: (next: BucketChartType) => void;
  types: readonly BucketChartType[];
  value: BucketChartType;
}

export function ChartTypePicker({
  className,
  onChange,
  types,
  value,
}: ChartTypePickerProps) {
  const t = useTranslations("widgets.chartTypes");

  return (
    <fieldset
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/30 p-0.5",
        className,
      )}
    >
      <legend className="sr-only">{t("legend")}</legend>
      {types.map((type) => {
        const Icon = TYPE_ICONS[type];
        const { labelKey } = getBucketChartVariant(type);
        const isActive = type === value;
        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={type}
            onClick={() => onChange(type)}
            type="button"
          >
            <Icon className="size-3.5" />
            {t(labelKey)}
          </button>
        );
      })}
    </fieldset>
  );
}
