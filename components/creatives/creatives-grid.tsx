"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageIcon, Search, Video } from "lucide-react";
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
import { StatusBadge } from "@/components/dashboard/status-badge";
import { cn } from "@/lib/utils";
import { formatNumber, formatPercent } from "@/lib/format";
import type { Creative, CreativeStatus } from "@/lib/types";

const palette = [
  "from-sky-500/30 to-indigo-500/30",
  "from-emerald-500/30 to-teal-500/30",
  "from-amber-500/30 to-orange-500/30",
  "from-rose-500/30 to-pink-500/30",
  "from-violet-500/30 to-fuchsia-500/30",
  "from-cyan-500/30 to-blue-500/30",
];

const STATUSES: CreativeStatus[] = ["approved", "pending", "rejected", "draft"];

export function CreativesGrid({ data }: { data: Creative[] }) {
  const [query, setQuery] = useState("");
  const [campaignId, setCampaignId] = useState("all");
  const [statuses, setStatuses] = useState<Set<CreativeStatus>>(new Set(STATUSES));

  const campaigns = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of data) map.set(c.campaignId, c.campaignName);
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((c) => {
      if (!statuses.has(c.status)) return false;
      if (campaignId !== "all" && c.campaignId !== campaignId) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.campaignName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, query, campaignId, statuses]);

  const toggleStatus = (s: CreativeStatus) => {
    setStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      if (next.size === 0) return new Set(STATUSES);
      return next;
    });
  };

  const allStatuses = statuses.size === STATUSES.length;
  const resetAll = () => {
    setQuery("");
    setCampaignId("all");
    setStatuses(new Set(STATUSES));
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
                placeholder="Search by creative name or campaign…"
                className="pl-9"
              />
            </div>
            <Select value={campaignId} onValueChange={(v) => setCampaignId(v ?? "all")}>
              <SelectTrigger className="w-full sm:w-[260px]">
                <SelectValue placeholder="Campaign">
                  {(value) => {
                    if (value === "all" || !value) return "All campaigns";
                    return campaigns.find((c) => c.id === value)?.name ?? "Campaign";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campaigns</SelectItem>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Status</span>
            {STATUSES.map((s) => {
              const on = statuses.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-pressed={on}
                >
                  {s}
                </button>
              );
            })}
            {(query || campaignId !== "all" || !allStatuses) && (
              <Button variant="ghost" size="sm" onClick={resetAll} className="ml-auto">
                Reset filters
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {data.length} creatives
          </p>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No creatives match these filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cr, i) => {
            const isVideo = cr.format.startsWith("video");
            return (
              <Card key={cr.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div
                  className={`relative aspect-video bg-gradient-to-br ${palette[i % palette.length]} flex items-center justify-center`}
                >
                  {isVideo ? (
                    <Video className="h-10 w-10 text-foreground/40" strokeWidth={1.5} />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-foreground/40" strokeWidth={1.5} />
                  )}
                  <span className="absolute bottom-2 left-2 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-xs font-medium">
                    {cr.format}
                  </span>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{cr.name}</p>
                      <Link
                        href={`/campaigns/${cr.campaignId}`}
                        className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {cr.campaignName}
                      </Link>
                    </div>
                    <StatusBadge status={cr.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="num font-medium">{formatNumber(cr.impressions, { compact: true })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="num font-medium">{cr.ctr ? formatPercent(cr.ctr) : "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
