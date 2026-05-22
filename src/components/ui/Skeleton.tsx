import { cn } from "@/lib/utils";

/**
 * Skeleton – a single shimmering block used to build Skeleton Screens.
 *
 * Usage:
 *   <Skeleton className="h-12 w-12 rounded-xl" />          // logo
 *   <Skeleton className="h-5 w-2/3 rounded-lg" />          // title
 *   <Skeleton className="h-4 w-full rounded-md" />          // body line
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Base shimmer: subtle slate tint + pulse
        "animate-pulse bg-slate-200/70 rounded-md",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
