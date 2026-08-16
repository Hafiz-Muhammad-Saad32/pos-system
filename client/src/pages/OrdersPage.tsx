import { Link } from "react-router-dom";

import { PageMeta } from "@/components/common/PageMeta";
import { useQuery } from "@/hooks/useQuery";
import { Package } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import { OrderStatusBadge } from "@/components/orders/OrderStatus";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { getOrders } from "@/services/orderService";
import { formatDate, formatPrice, isActiveStatus } from "@/utils/format";

type Filter = "all" | "active" | "delivered" | "cancelled";

export function OrdersPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const query = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: () => getOrders(),
    enabled: Boolean(user),
  });

  const orders = (query.data ?? []).filter((order) => {
    if (filter === "active") return isActiveStatus(order.status);
    if (filter === "delivered") return order.status === "delivered";
    if (filter === "cancelled") return order.status === "cancelled";
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <>
      <PageMeta
        title="My orders — Meridian"
        description="Track active Meridian orders and revisit past ones."
        ogDescription="Track active orders and revisit past ones."
      />
      <PageHeader
        eyebrow="Order history"
        title="My orders"
        description="Every order placed from the website — plus anything ordered through our WhatsApp line, once that's connected."
      />

      <div className="container-page py-12">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                filter === item.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {query.isLoading ? (
          <ListSkeleton rows={3} />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : !orders.length ? (
          <EmptyState
            icon={Package}
            title="No orders here yet"
            description="Once you place an order it appears here with live status updates."
            action={
              <Button asChild className="rounded-full">
                <Link to="/menu">Start an order</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-display text-xl text-foreground">{order.id}</p>
                      <OrderStatusBadge status={order.status} />
                      {order.source === "whatsapp" ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                          WhatsApp
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} ·{" "}
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display text-2xl text-foreground">
                      {formatPrice(order.total)}
                    </p>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to={`/orders/${order.id}`}>View order</Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
