import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@/lib/query";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, MapPin, Phone, Ban } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ErrorState } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { orderService, STATUS_FLOW } from "@/services/orderService";
import type { OrderStatus } from "@/types";
import { usePageMeta } from "@/hooks/use-page-meta";
import { formatCurrency, formatDateTime, STATUS_LABEL } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  usePageMeta({
    title: "Order details — Meridian POS",
    description: "Full ticket breakdown, customer details and kitchen status timeline.",
  });

  const { orderId = "" } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  const order = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getById(orderId),
  });

  const mutation = useMutation({
    mutationFn: (status: OrderStatus) => orderService.updateStatus(orderId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(["order", orderId], updated);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success(`Order marked ${STATUS_LABEL[updated.status].toLowerCase()}`);
    },
    onError: () => toast.error("Could not update the order status"),
  });

  if (order.isError) return <ErrorState onRetry={() => order.refetch()} />;

  if (order.isLoading || !order.data) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const data = order.data;
  const currentIndex = STATUS_FLOW.indexOf(data.status);
  const isCancelled = data.status === "cancelled";
  const nextStatus = !isCancelled && currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIndex + 1]!
    : null;

  return (
    <>
      <Link
        to="/orders"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      <PageHeader
        title={data.id}
        description={`${formatDateTime(data.createdAt)} · ${data.channel} order`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={data.status} />
            {nextStatus && (
              <button
                onClick={() => setPendingStatus(nextStatus)}
                disabled={mutation.isPending}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Mark {STATUS_LABEL[nextStatus]}
              </button>
            )}
            {!isCancelled && data.status !== "delivered" && (
              <button
                onClick={() => setPendingStatus("cancelled")}
                disabled={mutation.isPending}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
              >
                <Ban className="size-4" /> Cancel
              </button>
            )}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="panel overflow-hidden">
          <h2 className="px-5 pb-4 pt-5 text-sm font-semibold">Ordered items</h2>
          <ul className="divide-y divide-border border-y border-border">
            {data.items.map((item) => (
              <li
                key={item.foodId}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="numeric block text-xs text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.price)}
                  </span>
                </span>
                <span className="numeric text-sm font-semibold">
                  {formatCurrency(item.quantity * item.price)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 px-5 py-4 text-sm">
            <Row label="Subtotal" value={formatCurrency(data.subtotal)} />
            <Row
              label="Discount"
              value={`− ${formatCurrency(data.discount)}`}
              tone="success"
            />
            <div className="mt-2 border-t border-border pt-3">
              <Row label="Total" value={formatCurrency(data.total)} strong />
            </div>
          </dl>
        </section>

        <div className="space-y-5">
          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Customer</h2>
            <p className="mt-3 text-base font-medium">{data.customerName}</p>
            <p className="numeric mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 shrink-0" /> {data.customerPhone}
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {data.customerAddress}
            </p>
            {data.note && (
              <p className="mt-4 rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs text-warning">
                {data.note}
              </p>
            )}
          </section>

          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Status timeline</h2>
            {isCancelled ? (
              <p className="mt-3 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
                This order was cancelled on {formatDateTime(data.updatedAt)}.
              </p>
            ) : (
              <ol className="mt-4 space-y-0">
                {STATUS_FLOW.map((step, i) => {
                  const done = i <= currentIndex;
                  const active = i === currentIndex;
                  return (
                    <li key={step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <motion.span
                          initial={false}
                          animate={{ scale: active ? 1.15 : 1 }}
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full border",
                            done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-surface-2 text-muted-foreground",
                          )}
                        >
                          {done ? (
                            <Check className="size-3.5" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-current" />
                          )}
                        </motion.span>
                        {i < STATUS_FLOW.length - 1 && (
                          <span
                            className={cn(
                              "my-1 w-px flex-1",
                              i < currentIndex ? "bg-primary" : "bg-border",
                            )}
                          />
                        )}
                      </div>
                      <div className="pb-5">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            done ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {step === "pending" ? "Order Received" : STATUS_LABEL[step]}
                        </p>
                        {active && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Updated {formatDateTime(data.updatedAt)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      </div>

      <AlertDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => !open && setPendingStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatus === "cancelled"
                ? "Cancel this order?"
                : `Mark order as ${pendingStatus ? STATUS_LABEL[pendingStatus] : ""}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus === "cancelled"
                ? "The kitchen will stop preparation and the customer will be notified. This cannot be undone."
                : "The order status will move forward and the kitchen display will update."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep as is</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingStatus) mutation.mutate(pendingStatus);
                setPendingStatus(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "success";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={cn("text-muted-foreground", strong && "font-semibold text-foreground")}>
        {label}
      </dt>
      <dd
        className={cn(
          "numeric font-medium",
          strong && "text-base font-semibold",
          tone === "success" && "text-success",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
