import { Link, useParams } from "react-router-dom";
import { useQuery } from "@/lib/query";
import { ArrowLeft, MapPin, Phone, ReceiptText } from "lucide-react";
import { PageHeader, EmptyState, ErrorState } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { customerService } from "@/services/customerService";
import { usePageMeta } from "@/hooks/use-page-meta";
import { formatCurrency, formatDate, formatDateTime, itemsSummary } from "@/utils/format";

export default function CustomerDetailsPage() {
  usePageMeta({
    title: "Customer profile — Meridian POS",
    description: "Guest profile with contact details, order history and lifetime spend.",
  });

  const { customerId = "" } = useParams<{ customerId: string }>();
  const result = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerService.getById(customerId),
  });

  if (result.isError) return <ErrorState onRetry={() => result.refetch()} />;
  if (result.isLoading || !result.data) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { customer, orders } = result.data;

  return (
    <>
      <Link
        to="/customers"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        description={`Guest since ${formatDate(customer.createdAt)}`}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_1.6fr]">
        <section className="panel space-y-4 p-5">
          <h2 className="text-sm font-semibold">Personal information</h2>
          <p className="numeric flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4 shrink-0" /> {customer.phone}
          </p>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" /> {customer.address}
          </p>
          <dl className="grid grid-cols-3 gap-4 border-t border-border pt-4">
            {[
              { k: "Orders", v: String(customer.totalOrders) },
              { k: "Spend", v: formatCurrency(customer.totalSpent) },
              { k: "Last order", v: formatDate(customer.lastOrderAt) },
            ].map((s) => (
              <div key={s.k} className="min-w-0">
                <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.k}
                </dt>
                <dd className="numeric mt-1 truncate text-sm font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="panel overflow-hidden">
          <h2 className="px-5 pb-4 pt-5 text-sm font-semibold">Order history</h2>
          {orders.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No orders yet"
              description="This guest hasn't placed an order through any channel."
            />
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/orders/${order.id}`}
                    className="focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50"
                  >
                    <span className="min-w-0">
                      <span className="numeric block truncate text-xs font-semibold text-primary">
                        {order.id}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {itemsSummary(order.items)} · {formatDateTime(order.createdAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="numeric text-sm font-medium">
                        {formatCurrency(order.total)}
                      </span>
                      <StatusBadge status={order.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
