import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import { ORDER_FLOW, ORDER_STATUS_LABEL, isActiveStatus } from "@/utils/format";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === "cancelled"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : status === "delivered"
        ? "border-success/40 bg-success/10 text-success"
        : "border-primary/40 bg-primary/10 text-primary";

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em]", tone)}
    >
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}

export function OrderStatusTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h3 className="text-lg text-foreground">Order cancelled</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This order was cancelled and any payment has been refunded to the original method. Need it
          after all?{" "}
          <Link to="/menu" className="text-primary underline-offset-4 hover:underline">
            Reorder from the menu
          </Link>
          .
        </p>
      </div>
    );
  }

  const currentIndex = ORDER_FLOW.indexOf(order.status);

  return (
    <ol className="relative space-y-0">
      {ORDER_FLOW.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const last = index === ORDER_FLOW.length - 1;

        return (
          <li key={step} className="relative flex gap-4 pb-7 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[15px] top-8 h-full w-px",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
            <motion.span
              initial={false}
              animate={{ scale: current ? 1.06 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary bg-primary/15 text-primary",
                !done && !current && "border-border bg-surface text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
            </motion.span>
            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  done || current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {ORDER_STATUS_LABEL[step]}
              </p>
              {current ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-primary"
                >
                  {isActiveStatus(order.status)
                    ? "Happening now — live updates will arrive here."
                    : "Completed"}
                </motion.p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
