"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { DailyMetric } from "@/lib/types";

const config = {
  spend: { label: "Spend", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function SpendOverTime({ data }: { data: DailyMetric[] }) {
  return (
    <ChartContainer config={config} className="h-72 w-full">
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="fill-spend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={60}
          tickFormatter={(v: number) => formatCurrency(v, { compact: true })}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={
            <ChartTooltipContent
              labelFormatter={(v) => new Date(v as string).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              formatter={(value, name) => {
                if (name === "spend") return [formatCurrency(Number(value), { compact: true }), "Spend"];
                return [String(value), name as string];
              }}
            />
          }
        />
        <Area
          dataKey="spend"
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fill-spend)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
