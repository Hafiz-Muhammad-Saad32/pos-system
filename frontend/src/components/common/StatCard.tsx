import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  loading,
  index = 0,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number | undefined;
  hint?: string | undefined;
  loading?: boolean | undefined;
  index?: number | undefined;
  tone?: "default" | "warning" | "success" | undefined;

}) {
  if (loading) {
    return (
      <div className="panel p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-32" />
        <Skeleton className="mt-3 h-3 w-20" />
      </div>
    );
  }

  const positive = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="panel group relative overflow-hidden p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg border",
            tone === "warning"
              ? "border-warning/25 bg-warning/10 text-warning"
              : tone === "success"
                ? "border-success/25 bg-success/10 text-success"
                : "border-primary/25 bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="numeric mt-4 text-3xl font-semibold text-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="truncate">{hint}</span>}
      </div>
    </motion.div>
  );
}
