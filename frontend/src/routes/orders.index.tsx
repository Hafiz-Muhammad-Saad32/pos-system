import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CalendarDays, ChevronRight, ReceiptText, Search, X } from "lucide-react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { PageHeader, EmptyState, ErrorState } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { orderService, ORDER_STATUSES } from "@/services/orderService";
import type { OrderQuery } from "@/services/orderService";
import type { OrderStatus } from "@/types";
import { formatCurrency, formatDateTime, itemsSummary, STATUS_LABEL } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Orders — Meridian POS" },
      {
        name: "description",
        content: "Search, filter and progress every restaurant ticket from one queue.",
      },
      { property: "og:title", content: "Orders — Meridian POS" },
      {
        property: "og:description",
        content: "Search, filter and progress every restaurant ticket from one queue.",
      },
    ],
  }),
  component: () => (
    <ProtectedPage>
      <OrdersPage />
    </ProtectedPage>
  ),
});

const PAGE_SIZE = 8;

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<NonNullable<OrderQuery["sort"]>>("newest");
  const [page, setPage] = useState(1);

  const query = useMemo<OrderQuery>(
    () => ({
      search,
      status,
      sort,
      page,
      pageSize: PAGE_SIZE,
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    }),
    [search, status, from, to, sort, page],
  );

  const orders = useQuery({
    queryKey: ["orders", query],
    queryFn: () => orderService.list(query),
    placeholderData: keepPreviousData,
  });

  const hasFilters = Boolean(search || from || to) || status !== "all";

  const reset = () => {
    setSearch("");
    setStatus("all");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every ticket from WhatsApp, counter and phone in one queue."
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order ID, customer or phone…"
              aria-label="Search orders"
              className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DateInput value={from} onChange={(v) => { setFrom(v); setPage(1); }} label="From" />
            <DateInput value={to} onChange={(v) => { setTo(v); setPage(1); }} label="To" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as OrderQuery["sort"] & string)}
              aria-label="Sort orders"
              className="focus-ring h-10 rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="total-desc">Highest total</option>
              <option value="total-asc">Lowest total</option>
            </select>
            {hasFilters && (
              <button
                onClick={reset}
                className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3">
          {(["all", ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={cn(
                "focus-ring shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                status === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {s === "all" ? "All" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {orders.isError ? (
          <ErrorState onRetry={() => orders.refetch()} />
        ) : orders.isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : orders.data && orders.data.data.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No matching orders"
            description="Try a different search term, status or date range."
            action={
              hasFilters ? (
                <button
                  onClick={reset}
                  className="focus-ring rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="hidden grid-cols-[120px_minmax(0,1fr)_minmax(0,1.2fr)_100px_120px_150px_40px] gap-3 border-b border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span>Created</span>
              <span className="sr-only">Actions</span>
            </div>
            <ul className="divide-y divide-border">
              {orders.data?.data.map((order, i) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.24 }}
                >
                  <Link
                    to="/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50 lg:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.2fr)_100px_120px_150px_40px]"
                  >
                    <span className="numeric truncate text-xs font-semibold text-primary">
                      {order.id}
                    </span>
                    <span className="hidden min-w-0 lg:block">
                      <span className="block truncate text-sm font-medium">
                        {order.customerName}
                      </span>
                      <span className="numeric block truncate text-[11px] text-muted-foreground">
                        {order.customerPhone}
                      </span>
                    </span>
                    <span className="hidden min-w-0 truncate text-xs text-muted-foreground lg:block">
                      {itemsSummary(order.items)}
                    </span>
                    <span className="numeric hidden text-sm font-medium lg:block">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="flex items-center justify-end lg:justify-start">
                      <StatusBadge status={order.status} />
                    </span>
                    <span className="hidden text-xs text-muted-foreground lg:block">
                      {formatDateTime(order.createdAt)}
                    </span>
                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            {orders.data && (
              <Pagination
                page={orders.data.page}
                totalPages={orders.data.totalPages}
                total={orders.data.total}
                pageSize={orders.data.pageSize}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}

function DateInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} date`}
        className="focus-ring h-10 rounded-xl border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none"
      />
    </div>
  );
}
