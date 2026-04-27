"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/format";
import type { ChannelMix } from "@/lib/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
];

const config = {
  spend: { label: "Spend" },
} satisfies ChartConfig;

export function ChannelMixChart({ data }: { data: ChannelMix[] }) {
  const total = data.reduce((s, d) => s + d.spend, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
      <ChartContainer config={config} className="h-56 w-full">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => [formatCurrency(Number(value), { compact: true }), name as string]}
              />
            }
          />
          <Pie
            data={data}
            dataKey="spend"
            nameKey="channel"
            innerRadius={48}
            outerRadius={80}
            paddingAngle={2}
            stroke="var(--background)"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="space-y-2 text-sm">
        {data.map((d, i) => {
          const pct = total ? (d.spend / total) * 100 : 0;
          return (
            <li key={d.channel} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="capitalize">{d.channel}</span>
              <span className="num ml-auto text-muted-foreground">{formatCurrency(d.spend, { compact: true })}</span>
              <span className="num w-12 text-right text-muted-foreground">{pct.toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
