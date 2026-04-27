"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Report } from "@/lib/types";

const scheduleLabels: Record<string, string> = {
  manual: "Manual — run on demand",
  daily: "Daily — every morning",
  weekly: "Weekly — every Monday",
  monthly: "Monthly — first of the month",
};

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
  audience: "Audience",
};

const metricLabels: Record<string, string> = {
  spend: "Spend",
  impressions: "Impressions",
  clicks: "Clicks",
  conversions: "Conversions",
  ctr: "CTR",
  cpa: "CPA",
};

interface NewReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (report: Report) => void;
}

export function NewReportSheet({ open, onOpenChange, onCreate }: NewReportSheetProps) {
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState<Report["schedule"]>("manual");
  const [dateRange, setDateRange] = useState("last-30");
  const [groupBy, setGroupBy] = useState("campaign");
  const [metric, setMetric] = useState("spend");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setSchedule("manual");
    setDateRange("last-30");
    setGroupBy("campaign");
    setMetric("spend");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give your report a name.");
      return;
    }
    setSubmitting(true);

    const report: Report = {
      id: `r_${Date.now().toString(36)}`,
      name: name.trim(),
      owner: "demo@adstack.io",
      schedule,
      lastRun: new Date().toISOString().slice(0, 10),
      metrics: [metric],
      dimensions: [groupBy],
    };

    setTimeout(() => {
      onCreate(report);
      toast.success("Report created", {
        description: `"${report.name}" is now in your saved reports.`,
      });
      setSubmitting(false);
      reset();
      onOpenChange(false);
    }, 250);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader className="border-b">
            <SheetTitle>New report</SheetTitle>
            <SheetDescription>
              Save a reusable view of your performance data. You can edit dimensions and metrics later.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report name</Label>
              <Input
                id="report-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekly performance — Q2"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Schedule</Label>
              <Select
                value={schedule}
                onValueChange={(v) => setSchedule((v ?? "manual") as Report["schedule"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{(v) => scheduleLabels[v as string] ?? "Schedule"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(scheduleLabels).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date range</Label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v ?? "last-30")}>
                <SelectTrigger className="w-full">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue>{(v) => dateRangeLabels[v as string] ?? "Date range"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dateRangeLabels).map(([k, l]) => (
                    <SelectItem key={k} value={k}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Group by</Label>
                <Select value={groupBy} onValueChange={(v) => setGroupBy(v ?? "campaign")}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{(v) => groupByLabels[v as string] ?? "Group by"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupByLabels).map(([k, l]) => (
                      <SelectItem key={k} value={k}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary metric</Label>
                <Select value={metric} onValueChange={(v) => setMetric(v ?? "spend")}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{(v) => metricLabels[v as string] ?? "Metric"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(metricLabels).map(([k, l]) => (
                      <SelectItem key={k} value={k}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Preview</p>
              <p className="mt-1">
                {metricLabels[metric]} grouped by {groupByLabels[groupBy].toLowerCase()}, {dateRangeLabels[dateRange].toLowerCase()}.
              </p>
            </div>
          </div>

          <SheetFooter className="border-t flex-row justify-end gap-2 mt-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Saving…" : "Save report"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
