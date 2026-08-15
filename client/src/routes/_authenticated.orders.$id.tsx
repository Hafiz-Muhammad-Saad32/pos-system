import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Package } from "lucide-react";
import { useEffect } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import { OrderStatusBadge, OrderStatusTimeline } from "@/components/orders/OrderStatus";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/services/orderService";
import { formatDate, formatPrice, isActiveStatus } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order tracking — Meridian" },
      { name: "description", content: "Follow your Meridian order from the pass to your door." },
      { property: "og:title", content: "Order tracking — Meridian" },
      { property: "og:description", content: "Follow your order from the pass to your door." },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["order", user?.id, id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(user),  // still need user for auth check
    retry: false,
  });

  const order = query.data;

  // TODO: Replace with a real WebSocket/SSE connection to backend for live status updates
  // e.g., useEffect(() => { const socket = io(...); socket.on("orderStatus", ...); }, [id]);

  if (query.isLoading) {
    return (
      <div className="container-page py-16">
        <ListSkeleton rows={2} />
      </div>
    );
  }

  if (query.isError || !order) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={Package}
          title="Order not found"
          description="We couldn't find an order with that reference on your account."
          action={
            <Button asChild className="rounded-full">
              <Link to="/orders">Back to my orders</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div className="min-w-0">
          <p className="eyebrow">Order tracking</p>
          <h1 className="display-lg mt-3 text-foreground">{order.id}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt)} · {order.source === "whatsapp" ? "WhatsApp" : "Website"}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl text-foreground">Progress</h2>
          <div className="mt-6">
            <OrderStatusTimeline order={order} />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl text-foreground">Items</h2>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li key={item.foodId} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    width={100}
                    height={100}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </span>
                  <span className="text-sm tabular-nums text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="tabular-nums">
                  {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <dt className="text-foreground">Total</dt>
                <dd className="font-display text-2xl tabular-nums text-foreground">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                Customer
              </h3>
              <p className="mt-3 text-sm text-foreground">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                Delivery address
              </h3>
              <p className="mt-3 text-sm text-foreground">{order.deliveryAddress.address}</p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress.city} {order.deliveryAddress.postalCode}
              </p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                Payment
              </h3>
              <p className="mt-3 text-sm capitalize text-foreground">
                {order.paymentMethod} · {order.paymentStatus}
              </p>
            </div>
            {order.note ? (
              <div>
                <h3 className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                  Delivery note
                </h3>
                <p className="mt-3 text-sm text-foreground">{order.note}</p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
