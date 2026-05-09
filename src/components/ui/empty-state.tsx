import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  description?: string;
  icon?: LucideIcon;
  title: string;
}

export function EmptyState({
  action,
  className,
  description,
  icon: Icon = Inbox,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/60 bg-card/40 px-6 py-10 text-center",
        className,
      )}
    >
      <Icon className="size-8 text-muted-foreground/70" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description !== undefined && (
        <p className="max-w-md text-xs text-muted-foreground">{description}</p>
      )}
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}
