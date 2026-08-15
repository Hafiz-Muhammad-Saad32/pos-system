import { useState } from "react";
import { useQuery } from "@/lib/query";
import { BarChart3, CircleDollarSign, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SalesChart } from "@/features/dashboard/SalesChart";
import { StatusDonut } from "@/features/dashboard/StatusDonut";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService } from "@/services/analyticsService";
import type { AnalyticsRange } from "@/types";
import { usePageMeta } from "@/hooks/use-page-meta";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

const RANGES: Array<{ value: AnalyticsRange; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function AnalyticsPage() {
  usePageMeta({
    title: "Analytics — Meridian POS",
    description: "Revenue trends, average order value and best-selling dishes over time.",
  });

  const [range, setRange] = useState<AnalyticsRange>("daily");

  const summary = useQuery({
    queryKey: ["analytics-summary", range],
    queryFn: () => analyticsService.summary(range),
  });
  const statuses = useQuery({
    queryKey: ["status-breakdown"],
    queryFn: () => analyticsService.statusBreakdown(),
  });
  const popular = useQuery({
    queryKey: ["popular", 8],
    queryFn: () => analyticsService.popularFoods(8),
  });

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Performance across revenue, volume and menu mix."
        actions={
          <div className="flex rounded-xl border border-border bg-surface-2 p-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "focus-ring rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  range === r.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue"
          value={formatCurrency(summary.data?.revenue ?? 0)}
          icon={CircleDollarSign}
          hint={`${range} window`}
          loading={summary.isLoading}
          index={0}
        />
        <StatCard
          label="Orders"
          value={String(summary.data?.orders ?? 0)}
          icon={ReceiptText}
          hint={`${range} window`}
          loading={summary.isLoading}
          index={1}
        />
        <StatCard
          label="Avg. Order Value"
          value={formatCurrency(summary.data?.avgOrderValue ?? 0)}
          icon={BarChart3}
          hint="per ticket"
          tone="success"
          loading={summary.isLoading}
          index={2}
        />
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold">Revenue trend</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Net of cancelled tickets, {range} buckets
        </p>
        <div className="mt-4">
          {summary.isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <SalesChart data={summary.data?.series ?? []} height={300} />
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Order status</h2>
          <div className="mt-4">
            {statuses.isLoading ? (
              <Skeleton className="h-[180px] w-full" />
            ) : (
              <StatusDonut data={statuses.data ?? []} />
            )}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Popular foods</h2>
          <ul className="mt-4 space-y-3">
            {summary.isLoading || popular.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))
              : popular.data?.map((food, i) => (
                  <li
                    key={food.foodId}
                    className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-0"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="numeric w-4 shrink-0 text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {food.name}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {food.category}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="numeric block text-sm font-semibold">
                        {formatCurrency(food.revenue)}
                      </span>
                      <span className="numeric block text-[11px] text-muted-foreground">
                        {food.unitsSold} sold
                      </span>
                    </span>
                  </li>
                ))}
          </ul>
        </div>
      </section>
    </>
  );
}
