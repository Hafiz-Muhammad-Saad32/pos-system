import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SalesPoint } from "@/types";
import { formatCompactCurrency, formatCurrency } from "@/utils/format";

export function SalesChart({ data, height = 280 }: { data: SalesPoint[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-border)"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-border-strong)" }}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            fontSize: 12,
            color: "var(--color-popover-foreground)",
          }}
          labelStyle={{ color: "var(--color-muted-foreground)" }}
          formatter={(value: number, name: string) =>
            name === "revenue"
              ? [formatCurrency(value), "Revenue"]
              : [String(value), "Orders"]
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
