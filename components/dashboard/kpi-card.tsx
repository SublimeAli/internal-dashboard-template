"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDelta, formatNumber, formatPercent } from "@/lib/format";
import type { KpiSnapshot } from "@/data/metrics";

export function KpiCard({ kpi }: { kpi: KpiSnapshot }) {
  const positive = kpi.delta >= 0;
  const value =
    kpi.format === "currency"
      ? formatCurrency(kpi.value, { compact: kpi.value >= 10000 })
      : kpi.format === "percent"
      ? formatPercent(kpi.value)
      : formatNumber(kpi.value, { compact: kpi.value >= 10000 });

  const data = kpi.spark.map((y, i) => ({ i, y }));

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
              positive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {formatDelta(kpi.delta)}
          </span>
        </div>
        <p className="num text-2xl font-semibold tracking-tight">{value}</p>
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id={`g-${kpi.label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                fill={`url(#g-${kpi.label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
