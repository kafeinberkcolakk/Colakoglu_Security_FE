import { cn } from "@/lib/utils";

const PERCENT_SCALE = 100;

interface DataSourceItemProps {
  name: string;
  sensitiveTypes: number;
  sensitive: number;
  nonSensitive: number;
  className?: string;
}

export function DataSourceItem({
  name,
  sensitiveTypes,
  sensitive,
  nonSensitive,
  className,
}: DataSourceItemProps) {
  const total = sensitive + nonSensitive;
  const sensitivePercent = total > 0 ? (sensitive / total) * PERCENT_SCALE : 0;
  const nonSensitivePercent =
    total > 0 ? (nonSensitive / total) * PERCENT_SCALE : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-foreground truncate">
          {name}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {sensitiveTypes} Sensitive Type
        </span>
      </div>

      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {sensitivePercent > 0 && (
          <div
            className="h-full bg-red-500 shrink-0"
            style={{ width: `${sensitivePercent}%` }}
          />
        )}
        {nonSensitivePercent > 0 && (
          <div
            className="h-full bg-blue-500 shrink-0"
            style={{ width: `${nonSensitivePercent}%` }}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{sensitive.toLocaleString()} Sensitive</span>
        <span>{nonSensitive.toLocaleString()} Non-Sensitive</span>
      </div>
    </div>
  );
}
