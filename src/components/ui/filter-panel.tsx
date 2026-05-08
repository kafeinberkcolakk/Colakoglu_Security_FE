"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterField {
  key: string;
  label: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  placeholder?: string;
  type?: "date" | "select" | "text";
}

interface FilterPanelProps {
  fields: FilterField[];
  onSearch?: (values: Record<string, string>) => void;
  onReset?: () => void;
  defaultExpanded?: boolean;
  className?: string;
  resetLabel?: string;
  searchLabel?: string;
  title?: ReactNode;
}

export function FilterPanel({
  fields,
  onSearch,
  onReset,
  defaultExpanded = true,
  className,
  resetLabel,
  searchLabel,
  title,
}: FilterPanelProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [values, setValues] = useState<Record<string, string>>({});
  const effectiveResetLabel = resetLabel ?? t("core.clear");
  const effectiveSearchLabel = searchLabel ?? t("core.search");
  const effectiveTitle = title ?? t("core.filters");

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(values);
  };

  const handleReset = () => {
    setValues({});
    onReset?.();
    onSearch?.({});
  };

  const renderFieldControl = (field: FilterField) => {
    const fieldId = `filter-${field.key}`;
    const placeholder = field.placeholder ?? t("core.enter");

    if (field.type === "select") {
      return (
        <Select
          onValueChange={(value) => handleChange(field.key, value)}
          value={values[field.key]}
        >
          <SelectTrigger className="h-8 text-sm" id={fieldId}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        className="h-8 text-sm"
        id={fieldId}
        onChange={(event) => handleChange(field.key, event.target.value)}
        placeholder={placeholder}
        type={field.type === "date" ? "date" : "text"}
        value={values[field.key] ?? ""}
      />
    );
  };

  return (
    <div className={cn("mb-4", className)}>
      <button
        className="flex items-center gap-1.5 py-1 text-sm text-muted-foreground hover:text-foreground select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            !isExpanded && "-rotate-90",
          )}
        />
        <span>{effectiveTitle}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          {fields.map((field) => (
            <div className="flex min-w-[140px] flex-col gap-1" key={field.key}>
              <label
                className="text-xs font-medium text-foreground/70"
                htmlFor={`filter-${field.key}`}
              >
                {field.label}
              </label>
              {renderFieldControl(field)}
            </div>
          ))}

          <div className="flex items-end gap-2">
            <Button className="h-8" onClick={handleSearch} size="sm">
              {effectiveSearchLabel}
            </Button>
            <Button
              aria-label={effectiveResetLabel}
              className="size-8"
              onClick={handleReset}
              size="icon-sm"
              variant="outline"
            >
              <ListFilter className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
