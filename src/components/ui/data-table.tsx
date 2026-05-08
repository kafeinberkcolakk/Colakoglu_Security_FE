"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 10;
const MEDIUM_PAGE_SIZE = 20;
const LARGE_PAGE_SIZE = 50;
const XL_PAGE_SIZE = 100;
const PAGE_SIZE_OPTIONS = [
  DEFAULT_PAGE_SIZE,
  MEDIUM_PAGE_SIZE,
  LARGE_PAGE_SIZE,
  XL_PAGE_SIZE,
] as const;

export type SortDir = "asc" | "desc" | null;

export interface TableColumn<T = unknown> {
  align?: "left" | "center" | "right";
  header: ReactNode;
  key: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableTab {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  activeTab?: string;
  className?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  getRowKey: (row: T) => string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (next: { direction: SortDir; key: string | null }) => void;
  onTabChange?: (tab: string) => void;
  page?: number;
  pageSize?: number;
  paginationLabels?: {
    next?: string;
    page?: string;
    previous?: string;
    rowsPerPage?: string;
  };
  sortState?: {
    direction: SortDir;
    key: string | null;
  };
  tabs?: TableTab[];
  totalElements?: number;
}

function resolveSortIcon(direction: SortDir, isActive: boolean) {
  if (!isActive) {
    return <ArrowUpDown className="size-3.5 opacity-40" />;
  }

  if (direction === "asc") {
    return <ArrowUp className="size-3.5" />;
  }

  return <ArrowDown className="size-3.5" />;
}

export function DataTable<T>({
  activeTab,
  className,
  columns,
  data,
  emptyMessage = "No data available.",
  getRowKey,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onTabChange,
  page,
  pageSize,
  paginationLabels,
  sortState,
  tabs,
  totalElements,
}: DataTableProps<T>) {
  const [internalSortKey, setInternalSortKey] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(null);
  const isControlledSort = Boolean(onSortChange && sortState);

  const effectiveSortKey = isControlledSort
    ? (sortState?.key ?? null)
    : internalSortKey;
  const effectiveSortDir = isControlledSort
    ? (sortState?.direction ?? null)
    : internalSortDir;

  const handleSort = (key: string) => {
    let nextSort: { direction: SortDir; key: string | null };

    if (effectiveSortKey !== key) {
      nextSort = { direction: "asc" as SortDir, key };
    } else if (effectiveSortDir === "asc") {
      nextSort = { direction: "desc" as SortDir, key };
    } else {
      nextSort = { direction: null as SortDir, key: null };
    }

    if (isControlledSort) {
      onSortChange?.(nextSort);
      return;
    }

    setInternalSortKey(nextSort.key);
    setInternalSortDir(nextSort.direction);
  };

  const sortedData = [...data].sort((left, right) => {
    if (isControlledSort || !effectiveSortKey || !effectiveSortDir) {
      return 0;
    }

    const leftRecord = left as Record<string, unknown>;
    const rightRecord = right as Record<string, unknown>;
    const comparison = String(leftRecord[effectiveSortKey] ?? "").localeCompare(
      String(rightRecord[effectiveSortKey] ?? ""),
      undefined,
      { numeric: true },
    );

    if (effectiveSortDir === "asc") {
      return comparison;
    }

    return -comparison;
  });

  const hasPagination =
    typeof page === "number" &&
    typeof pageSize === "number" &&
    typeof totalElements === "number";
  const totalPages =
    hasPagination && pageSize > 0
      ? Math.max(1, Math.ceil(totalElements / pageSize))
      : 1;

  return (
    <div className={cn("", className)}>
      {tabs && tabs.length > 0 && (
        <div className="mb-0 flex border-b border-border">
          {tabs.map((tab) => (
            <button
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              key={tab.value}
              onClick={() => onTabChange?.(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-foreground/60",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    !column.align && "text-left",
                    column.width,
                  )}
                  key={column.key}
                >
                  {column.sortable ? (
                    <button
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      onClick={() => handleSort(column.key)}
                      type="button"
                    >
                      {column.header}
                      {resolveSortIcon(
                        effectiveSortDir,
                        effectiveSortKey === column.key,
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  className="border-b border-border transition-colors hover:bg-muted/30"
                  key={getRowKey(row)}
                >
                  {columns.map((column) => (
                    <td
                      className={cn(
                        "px-4 py-3.5 text-sm text-foreground/80",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                      key={column.key}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (row as Record<string, unknown>)[column.key] ?? "",
                          )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hasPagination && pageSize !== undefined && page !== undefined && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{paginationLabels?.rowsPerPage ?? "Rows per page"}</span>
            <select
              className="rounded border border-border bg-background px-2 py-1 text-foreground"
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              value={pageSize}
            >
              {PAGE_SIZE_OPTIONS.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {paginationLabels?.page ?? "Page"} {page + 1} / {totalPages}
            </span>
            <Button
              disabled={page <= 0}
              onClick={() => onPageChange?.(page - 1)}
              size="sm"
              type="button"
              variant="outline"
            >
              {paginationLabels?.previous ?? "Previous"}
            </Button>
            <Button
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              size="sm"
              type="button"
              variant="outline"
            >
              {paginationLabels?.next ?? "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
