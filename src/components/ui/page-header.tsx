import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-5 bg-background",
        className,
      )}
    >
      <h1 className="text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
