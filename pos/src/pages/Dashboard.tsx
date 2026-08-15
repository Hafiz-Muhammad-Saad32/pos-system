import { Link } from "react-router-dom";
import { useQuery } from "@/lib/query";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  Flame,
  PackageX,
  ReceiptText,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SalesChart } from "@/features/dashboard/SalesChart";
import { StatusDonut } from "@/features/dashboard/StatusDonut";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService } from "@/services/analyticsService";
import { orderService } from "@/services/orderService";
import { useAuth } from "@/store/auth";
import { usePageMeta } from "@/hooks/use-page-meta";
import { formatCurrency, itemsSummary, timeAgo } from "@/utils/format";

export default function DashboardPage() {
  usePageMeta({
    title: "Dashboard — Meridian POS",
    description:
      "Live service overview: today's orders, revenue, prep queue and menu availability.",
  });

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const stats = useQuery({ queryKey: ["stats"], queryFn: () => analyticsService.stats() });
  const series = useQuery({
    queryKey: ["sales", "daily"],
    queryFn: () => analyticsService.salesSeries("daily"),
  });
  const statuses = useQuery({
    queryKey: ["status-breakdown"],
    queryFn: () => analyticsService.statusBreakdown(),
  });
  const popular = useQuery({
    queryKey: ["popular", 5],
    queryFn: () => analyticsService.popularFoods(5),
  });
  const unavailable = useQuery({
    queryKey: ["unavailable"],
    queryFn: () => analyticsService.unavailableFoods(),
  });
  const recent = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => orderService.list({ page: 1, pageSize: 6, sort: "newest" }),
  });

  return (
    <>
      <PageHeader
        title={`Good service, ${user?.name.split(" ")[0]}`}
        description="Saturday, 8 August 2026 · Dinner service in progress"
        actions={
          <Link
            to="/orders"
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ReceiptText className="size-4" /> Order queue
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Orders"
          value={String(stats.data?.todayOrders ?? 0)}
          icon={ReceiptText}
          delta={stats.data?.ordersDelta}
          hint="vs yesterday"
          loading={stats.isLoading}
          index={0}
        />
        <StatCard
          label="Today's Revenue"
          value={formatCurrency(stats.data?.todayRevenue ?? 0)}
          icon={CircleDollarSign}
          delta={stats.data?.revenueDelta}
          hint="vs yesterday"
          loading={stats.isLoading}
          index={1}
        />
        <StatCard
          label="Pending Orders"
          value={String(stats.data?.pendingOrders ?? 0)}
          icon={Clock3}
          hint="awaiting kitchen"
          tone="warning"
          loading={stats.isLoading}
          index={2}
        />
        <StatCard
          label="Available Foods"
          value={String(stats.data?.availableFoods ?? 0)}
          icon={UtensilsCrossed}
          hint="on the live menu"
          tone="success"
          loading={stats.isLoading}
          index={3}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Sales Overview" subtitle="Revenue across the last 7 days">
          {series.isLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <SalesChart data={series.data ?? []} />
          )}
        </Panel>

        <Panel title="Order Status" subtitle="Distribution across the last 30 days">
          {statuses.isLoading ? (
            <Skeleton className="h-[180px] w-full" />
          ) : (
            <StatusDonut data={statuses.data ?? []} />
          )}
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Recent Orders"
          subtitle="Newest tickets across every channel"
          action={
            <Link
              to="/orders"
              className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          }
          padded={false}
        >
          {recent.isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.data?.data.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="No orders yet"
              description="New tickets will appear here as soon as they arrive."
            />
          ) : (
            <ul className="divide-y divide-border">
              {recent.data?.data.map((order, i) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link
                    to={`/orders/${order.id}`}
                    className="focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-accent/50 sm:grid-cols-[110px_minmax(0,1.2fr)_minmax(0,1.4fr)_90px_auto]"
                  >
                    <span className="numeric truncate text-xs font-semibold text-primary">
                      {order.id}
                    </span>
                    <span className="hidden min-w-0 truncate text-sm sm:block">
                      {order.customerName}
                    </span>
                    <span className="hidden min-w-0 truncate text-xs text-muted-foreground sm:block">
                      {itemsSummary(order.items)}
                    </span>
                    <span className="numeric hidden text-sm font-medium sm:block">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="flex items-center justify-end gap-3">
                      <span className="hidden text-[11px] text-muted-foreground md:block">
                        {timeAgo(order.createdAt)}
                      </span>
                      <StatusBadge status={order.status} />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="Popular Foods" subtitle="Top sellers this month">
            {popular.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-3.5">
                {popular.data?.map((food, i) => {
                  const max = popular.data?.[0]?.unitsSold || 1;
                  return (
                    <li key={food.foodId}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="numeric w-4 shrink-0 text-xs text-muted-foreground">
                            {i + 1}
                          </span>
                          <span className="truncate font-medium">{food.name}</span>
                        </span>
                        <span className="numeric shrink-0 text-xs text-muted-foreground">
                          {food.unitsSold} sold
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(food.unitsSold / max) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.06 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Low Availability" subtitle="Currently off the menu">
            {unavailable.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : unavailable.data?.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Every item is available. Kitchen is fully stocked.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {unavailable.data?.map((food) => (
                  <li
                    key={food.id}
                    className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5"
                  >
                    <PackageX className="size-4 shrink-0 text-destructive" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {food.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {food.category} · {formatCurrency(food.price)}
                      </span>
                    </span>
                    {isAdmin && (
                      <Link
                        to="/foods"
                        className="focus-ring shrink-0 text-[11px] font-semibold text-primary hover:underline"
                      >
                        Manage
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      {!isAdmin && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Flame className="size-3.5 text-primary" />
          Cashier view — menu, customer and analytics management are admin-only.
        </p>
      )}
    </>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
  padded = true,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className={padded ? "px-5 pb-5" : ""}>{children}</div>
    </section>
  );
}
