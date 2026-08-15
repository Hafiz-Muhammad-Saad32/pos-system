import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@/lib/query";
import { motion } from "motion/react";
import { ChevronRight, Search, Users } from "lucide-react";
import { PageHeader, EmptyState, ErrorState } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { customerService } from "@/services/customerService";
import { usePageMeta } from "@/hooks/use-page-meta";
import { formatCurrency, formatDate } from "@/utils/format";

const PAGE_SIZE = 8;

export default function CustomersPage() {
  usePageMeta({
    title: "Customers — Meridian POS",
    description: "Guest directory with order counts, lifetime spend and recent activity.",
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "spend" | "orders" | "name">("recent");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({ search, sort, page, pageSize: PAGE_SIZE }),
    [search, sort, page],
  );

  const customers = useQuery({
    queryKey: ["customers", query],
    queryFn: () => customerService.list(query),
    keepPreviousData: true,
  });

  return (
    <>
      <PageHeader
        title="Customers"
        description="Guests captured from WhatsApp, phone and counter orders."
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, phone or address…"
              aria-label="Search customers"
              className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort customers"
            className="focus-ring h-10 rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="spend">Highest spend</option>
            <option value="orders">Most orders</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {customers.isError ? (
          <ErrorState onRetry={() => customers.refetch()} />
        ) : customers.isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : customers.data && customers.data.data.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description="Try a different search term."
          />
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_90px_120px_130px_40px] gap-3 border-b border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid">
              <span>Customer</span>
              <span>Address</span>
              <span>Orders</span>
              <span>Spend</span>
              <span>Last order</span>
              <span className="sr-only">Actions</span>
            </div>
            <ul className="divide-y divide-border">
              {customers.data?.data.map((customer, i) => (
                <motion.li
                  key={customer.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.24 }}
                >
                  <Link
                    to={`/customers/${customer.id}`}
                    className="focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_90px_120px_130px_40px]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {customer.name}
                      </span>
                      <span className="numeric block truncate text-[11px] text-muted-foreground">
                        {customer.phone}
                      </span>
                    </span>
                    <span className="hidden min-w-0 truncate text-xs text-muted-foreground lg:block">
                      {customer.address}
                    </span>
                    <span className="numeric hidden text-sm lg:block">
                      {customer.totalOrders}
                    </span>
                    <span className="numeric hidden text-sm font-medium lg:block">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                    <span className="numeric text-right text-xs text-muted-foreground lg:text-left">
                      {formatDate(customer.lastOrderAt)}
                    </span>
                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            {customers.data && (
              <Pagination
                page={customers.data.page}
                totalPages={customers.data.totalPages}
                total={customers.data.total}
                pageSize={customers.data.pageSize}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
