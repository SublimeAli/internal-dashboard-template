import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpendOverTime } from "@/components/charts/spend-over-time";
import { ChannelMixChart } from "@/components/charts/channel-mix";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campaigns } from "@/data/campaigns";
import { channelMix, dailyMetrics30d, overviewKpis } from "@/data/metrics";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function OverviewPage() {
  const topCampaigns = [...campaigns]
    .filter((c) => c.status === "active")
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Last 30 days · across all advertisers and channels"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Link href="/reports" className={buttonVariants({ size: "sm" })}>
              View reports
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spend over time</CardTitle>
            <CardDescription>Daily spend across all active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendOverTime data={dailyMetrics30d} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Channel mix</CardTitle>
            <CardDescription>Spend share by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelMixChart data={channelMix} />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top active campaigns</CardTitle>
              <CardDescription>By spend, last 30 days</CardDescription>
            </div>
            <Link href="/campaigns" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Pacing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCampaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/campaigns/${c.id}`} className="font-medium hover:underline">
                        {c.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.advertiser}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="num text-right">{formatCurrency(c.spend, { compact: true })}</TableCell>
                    <TableCell className="num text-right">{formatNumber(c.impressions, { compact: true })}</TableCell>
                    <TableCell className="num text-right">{(c.pacing * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ActivityFeed />
      </section>
    </div>
  );
}
