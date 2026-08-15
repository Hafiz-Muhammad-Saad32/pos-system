import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/utils/format";
import type { OrderStatus } from "@/types";

const STYLES: Record<OrderStatus, string> = {
  pending:
    "bg-warning/12 text-warning border-warning/30 [--dot:var(--color-warning)]",
  preparing: "bg-info/12 text-info border-info/30 [--dot:var(--color-info)]",
  ready:
    "bg-primary/12 text-primary border-primary/30 [--dot:var(--color-primary)]",
  delivered:
    "bg-success/12 text-success border-success/30 [--dot:var(--color-success)]",
  cancelled:
    "bg-destructive/12 text-destructive border-destructive/30 [--dot:var(--color-destructive)]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[status],
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: "var(--dot)" }}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        available
          ? "border-success/30 bg-success/12 text-success"
          : "border-destructive/30 bg-destructive/12 text-destructive",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          available ? "bg-success" : "bg-destructive",
        )}
        aria-hidden
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
