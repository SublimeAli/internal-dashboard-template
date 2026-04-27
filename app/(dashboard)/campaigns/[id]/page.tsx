import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pause, Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SpendOverTime } from "@/components/charts/spend-over-time";
import { Progress } from "@/components/dashboard/progress-bar";
import { campaigns, getCampaign } from "@/data/campaigns";
import { creatives } from "@/data/creatives";
import { dailyMetrics30d } from "@/data/metrics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  const ctr = campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0;
  const cvr = campaign.clicks > 0 ? campaign.conversions / campaign.clicks : 0;
  const cpa = campaign.conversions > 0 ? campaign.spend / campaign.conversions : 0;
  const ecpm = campaign.impressions > 0 ? (campaign.spend / campaign.impressions) * 1000 : 0;
  const campaignCreatives = creatives.filter((c) => c.campaignId === campaign.id);
  const budgetPct = campaign.budget > 0 ? Math.min(1, campaign.spend / campaign.budget) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All campaigns
        </Link>
      </div>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {campaign.advertiser} ·{" "}
            <span className="capitalize">{campaign.objective}</span> ·{" "}
            {campaign.startDate} → {campaign.endDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === "active" ? (
            <Button variant="outline" size="sm">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" /> Resume
            </Button>
          )}
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Stat label="Spend" value={formatCurrency(campaign.spend, { compact: true })} sub={`of ${formatCurrency(campaign.budget, { compact: true })}`} />
        <Stat label="Impressions" value={formatNumber(campaign.impressions, { compact: true })} />
        <Stat label="Clicks" value={formatNumber(campaign.clicks, { compact: true })} />
        <Stat label="CTR" value={formatPercent(ctr)} />
        <Stat label="Conversions" value={formatNumber(campaign.conversions, { compact: true })} />
        <Stat label="CPA" value={cpa ? formatCurrency(cpa, { precise: true }) : "—"} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Budget pacing</CardTitle>
          <CardDescription>
            Spent {formatCurrency(campaign.spend, { compact: true })} of {formatCurrency(campaign.budget, { compact: true })} ·
            Pacing index {(campaign.pacing * 100).toFixed(0)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={budgetPct} />
        </CardContent>
      </Card>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="creatives">Creatives ({campaignCreatives.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spend over time</CardTitle>
              <CardDescription>Daily spend trend</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendOverTime data={dailyMetrics30d} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="eCPM" value={ecpm ? formatCurrency(ecpm, { precise: true }) : "—"} />
              <Stat label="CVR" value={cvr ? formatPercent(cvr) : "—"} />
              <Stat label="Channels" value={campaign.channels.length.toString()} sub={campaign.channels.join(" · ")} />
              <Stat label="Days running" value={daysBetween(campaign.startDate, campaign.endDate).toString()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creatives" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creative</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">CTR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignCreatives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No creatives yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    campaignCreatives.map((cr) => (
                      <TableRow key={cr.id}>
                        <TableCell className="font-medium">{cr.name}</TableCell>
                        <TableCell className="text-muted-foreground">{cr.format}</TableCell>
                        <TableCell>
                          <StatusBadge status={cr.status} />
                        </TableCell>
                        <TableCell className="num text-right">{formatNumber(cr.impressions, { compact: true })}</TableCell>
                        <TableCell className="num text-right">{formatPercent(cr.ctr)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Targeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Geo" value="United States, Canada" />
              <Row label="Devices" value="Desktop, Mobile, CTV" />
              <Row label="Frequency cap" value="3 / user / day" />
              <Row label="Bid strategy" value="Max conversions (auto)" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Start" value={campaign.startDate} />
              <Row label="End" value={campaign.endDate} />
              <Row label="Days" value={daysBetween(campaign.startDate, campaign.endDate).toString()} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="num mt-1 text-xl font-semibold tracking-tight">{value}</p>
      {sub ? <p className="num mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}
