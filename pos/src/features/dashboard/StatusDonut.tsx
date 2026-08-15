import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { OrderStatus } from "@/types";
import { STATUS_LABEL } from "@/utils/format";

const COLOR: Record<OrderStatus, string> = {
  pending: "var(--color-warning)",
  preparing: "var(--color-info)",
  ready: "var(--color-primary)",
  delivered: "var(--color-success)",
  cancelled: "var(--color-destructive)",
};

export function StatusDonut({
  data,
}: {
  data: Array<{ status: OrderStatus; count: number }>;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
      <div className="relative h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={COLOR[entry.status]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--color-popover-foreground)",
              }}
              formatter={(value: number, name: string) => [
                String(value),
                STATUS_LABEL[name as OrderStatus],
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="numeric text-2xl font-semibold">{total}</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Orders
            </p>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center gap-3 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLOR[entry.status] }}
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {STATUS_LABEL[entry.status]}
            </span>
            <span className="numeric font-medium">{entry.count}</span>
            <span className="numeric w-12 text-right text-xs text-muted-foreground">
              {total ? Math.round((entry.count / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
