"use client";

import { cn } from "@/lib/utils";

export interface TimeRangePreset {
  label: string;
  value: string;
}

interface TimeRangePickerProps {
  className?: string;
  legend?: string;
  onChange: (value: string) => void;
  presets: TimeRangePreset[];
  value: string;
}

export function TimeRangePicker({
  className,
  legend,
  onChange,
  presets,
  value,
}: TimeRangePickerProps) {
  return (
    <fieldset
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/30 p-0.5",
        className,
      )}
    >
      {legend !== undefined && <legend className="sr-only">{legend}</legend>}
      {presets.map((preset) => {
        const isActive = preset.value === value;
        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={preset.value}
            onClick={() => onChange(preset.value)}
            type="button"
          >
            {preset.label}
          </button>
        );
      })}
    </fieldset>
  );
}
