import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonListProps {
  className?: string;
  rowClassName?: string;
  rows: number;
}

export function SkeletonList({
  className,
  rowClassName = "h-10 w-full",
  rows,
}: SkeletonListProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
        <Skeleton className={rowClassName} key={index} />
      ))}
    </div>
  );
}
