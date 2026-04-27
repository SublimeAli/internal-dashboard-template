"use client";

import { useState } from "react";
import { Calendar, Download, FilePlus2, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { NewReportSheet } from "@/components/reports/new-report-sheet";
import { reports as initialReports } from "@/data/reports";
import type { Report } from "@/lib/types";

const dateRangeLabels: Record<string, string> = {
  "last-7": "Last 7 days",
  "last-30": "Last 30 days",
  "last-90": "Last 90 days",
  ytd: "Year to date",
};

const groupByLabels: Record<string, string> = {
  campaign: "Campaign",
  advertiser: "Advertiser",
  channel: "Channel",
  creative: "Creative",
};

const metricLabels: Record<string, string> = {
  spend: "Spend",
  impressions: "Impressions",
  clicks: "Clicks",
  conversions: "Conversions",
  ctr: "CTR",
};

const scheduleTone: Record<string, string> = {
  daily: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  weekly: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  monthly: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  manual: "bg-muted text-muted-foreground",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [sheetOpen, setSheetOpen] = useState(false);

  const addReport = (r: Report) => setReports((prev) => [r, ...prev]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Build, schedule, and export performance reports"
        actions={
          <Button size="sm" onClick={() => setSheetOpen(true)}>
            <FilePlus2 className="mr-2 h-4 w-4" /> New report
          </Button>
        }
      />

      <NewReportSheet open={sheetOpen} onOpenChange={setSheetOpen} onCreate={addReport} />

      <Card>
        <CardHeader>
          <CardTitle>Saved reports</CardTitle>
          <CardDescription>{reports.length} reports owned by your team</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last run</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.owner}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize font-normal ${scheduleTone[r.schedule]}`}>
                      {r.schedule}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.lastRun}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dimensions.join(", ")}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" aria-label="Run">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Build a new report</CardTitle>
          <CardDescription>Pick a date range, dimensions, and metrics. Export when ready.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date range</Label>
            <Select defaultValue="last-30">
              <SelectTrigger>
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue>{(v) => dateRangeLabels[v as string] ?? "Date range"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateRangeLabels).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Group by</Label>
            <Select defaultValue="campaign">
              <SelectTrigger>
                <SelectValue>{(v) => groupByLabels[v as string] ?? "Group by"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupByLabels).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Primary metric</Label>
            <Select defaultValue="spend">
              <SelectTrigger>
                <SelectValue>{(v) => metricLabels[v as string] ?? "Metric"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metricLabels).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">Save as draft</Button>
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" /> Run report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
