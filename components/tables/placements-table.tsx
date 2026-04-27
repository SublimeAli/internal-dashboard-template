"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/dashboard/progress-bar";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { Channel, Placement } from "@/lib/types";

const CHANNELS: Channel[] = ["display", "video", "ctv", "native", "audio", "dooh"];

export function PlacementsTable({ data }: { data: Placement[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [channels, setChannels] = useState<Set<Channel>>(new Set(CHANNELS));

  const countries = useMemo(() => {
    return Array.from(new Set(data.map((p) => p.country))).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p) => {
      if (!channels.has(p.channel)) return false;
      if (country !== "all" && p.country !== country) return false;
      if (q && !p.site.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, query, country, channels]);

  const toggleChannel = (c: Channel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      if (next.size === 0) return new Set(CHANNELS);
      return next;
    });
  };

  const allChannels = channels.size === CHANNELS.length;
  const resetAll = () => {
    setQuery("");
    setCountry("all");
    setChannels(new Set(CHANNELS));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by site or placement…"
                className="pl-9"
              />
            </div>
            <Select value={country} onValueChange={(v) => setCountry(v ?? "all")}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Country">
                  {(value) => (value === "all" || !value ? "All countries" : (value as string))}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Channels</span>
            {CHANNELS.map((c) => {
              const on = channels.has(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleChannel(c)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-pressed={on}
                >
                  {c}
                </button>
              );
            })}
            {(query || country !== "all" || !allChannels) && (
              <Button variant="ghost" size="sm" onClick={resetAll} className="ml-auto">
                Reset filters
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {data.length} placements
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placement</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="w-[180px]">Fill rate</TableHead>
                <TableHead className="text-right">eCPM</TableHead>
                <TableHead className="text-right">Viewability</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No placements match these filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.site}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize font-normal">
                        {p.channel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.country}</TableCell>
                    <TableCell className="num text-right">{formatNumber(p.impressions, { compact: true })}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={p.fillRate} className="w-20" />
                        <span className="num text-xs text-muted-foreground w-10">
                          {(p.fillRate * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="num text-right">{formatCurrency(p.ecpm, { precise: true })}</TableCell>
                    <TableCell className="num text-right text-muted-foreground">
                      {p.viewability ? formatPercent(p.viewability, 0) : "—"}
                    </TableCell>
                    <TableCell className="num text-right font-medium">
                      {formatCurrency(p.revenue, { compact: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
