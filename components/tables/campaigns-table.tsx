"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Campaign, CampaignStatus } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/format";

const statusLabels: Record<string, string> = {
  all: "All statuses",
  active: "Active",
  paused: "Paused",
  draft: "Draft",
  ended: "Ended",
};

const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Campaign <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <Link href={`/campaigns/${row.original.id}`} className="font-medium hover:underline">
          {row.original.name}
        </Link>
        <p className="text-xs text-muted-foreground">{row.original.advertiser}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, _id, value: string) => (value === "all" ? true : row.original.status === value),
  },
  {
    accessorKey: "objective",
    header: "Objective",
    cell: ({ row }) => <span className="capitalize">{row.original.objective}</span>,
  },
  {
    accessorKey: "spend",
    header: ({ column }) => (
      <button
        className="ml-auto inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Spend <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="num text-right">{formatCurrency(row.original.spend, { compact: true })}</div>
    ),
  },
  {
    accessorKey: "budget",
    header: () => <div className="text-right text-xs uppercase tracking-wider text-muted-foreground">Budget</div>,
    cell: ({ row }) => (
      <div className="num text-right text-muted-foreground">
        {formatCurrency(row.original.budget, { compact: true })}
      </div>
    ),
  },
  {
    accessorKey: "impressions",
    header: () => <div className="text-right text-xs uppercase tracking-wider text-muted-foreground">Impressions</div>,
    cell: ({ row }) => (
      <div className="num text-right">{formatNumber(row.original.impressions, { compact: true })}</div>
    ),
  },
  {
    accessorKey: "pacing",
    header: () => <div className="text-right text-xs uppercase tracking-wider text-muted-foreground">Pacing</div>,
    cell: ({ row }) => {
      const p = row.original.pacing;
      const tone = p === 0 ? "text-muted-foreground" : p < 0.85 ? "text-amber-500" : p > 1.1 ? "text-rose-500" : "text-emerald-500";
      return <div className={`num text-right ${tone}`}>{(p * 100).toFixed(0)}%</div>;
    },
  },
];

export function CampaignsTable({ data }: { data: Campaign[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "spend", desc: true }]);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState<CampaignStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return data.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.advertiser.toLowerCase().includes(q);
    });
  }, [data, filter, status]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search campaigns or advertisers…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={status} onValueChange={(v) => setStatus((v ?? "all") as CampaignStatus | "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status">
              {(value) => statusLabels[(value as string) ?? "all"] ?? "Status"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No campaigns found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {table.getFilteredRowModel().rows.length} campaign
          {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
