import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  className,
  showValue = true,
}: {
  value: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
      {showValue ? (
        <span className="text-xs font-medium tabular-nums text-foreground/80">
          {value.toFixed(1)}
        </span>
      ) : null}
      <span className="sr-only">{value.toFixed(1)} out of 5</span>
    </span>
  );
}
