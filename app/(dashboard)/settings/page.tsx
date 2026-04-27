import { Check, Plug } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { teamMembers } from "@/data/users";

const integrations = [
  { name: "Google Ad Manager", description: "Pull placements and revenue", connected: true },
  { name: "The Trade Desk", description: "DSP campaign sync", connected: true },
  { name: "Meta Ads", description: "Audience and creative sync", connected: false },
  { name: "Salesforce", description: "Advertiser CRM sync", connected: false },
  { name: "Slack", description: "Pacing alerts", connected: true },
  { name: "Snowflake", description: "Data warehouse export", connected: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your workspace, team, and integrations" />

      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace details</CardTitle>
              <CardDescription>How your workspace appears across the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ws-name">Workspace name</Label>
                <Input id="ws-name" defaultValue="Adstack Demo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws-slug">URL slug</Label>
                <Input id="ws-slug" defaultValue="adstack-demo" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ws-tz">Reporting timezone</Label>
                <Input id="ws-tz" defaultValue="America/New_York" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team members</CardTitle>
                <CardDescription>{teamMembers.length} people have access to this workspace</CardDescription>
              </div>
              <Button size="sm">Invite member</Button>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {teamMembers.map((m) => {
                  const initials = m.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <li key={m.id} className="flex items-center gap-3 py-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                      <Badge variant="outline" className="capitalize font-normal">
                        {m.role}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((it) => (
              <Card key={it.name}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                    <Plug className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.description}</p>
                  </div>
                  {it.connected ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-normal">
                      <Check className="mr-1 h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">Connect</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email alerts</CardTitle>
              <CardDescription>When should we email you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationRow title="Pacing alerts" sub="Get notified when a campaign over- or under-paces by 15%" defaultOn />
              <NotificationRow title="Creative approvals" sub="When a creative is rejected or pending review > 24h" defaultOn />
              <NotificationRow title="Weekly digest" sub="Summary of every Monday morning" defaultOn />
              <NotificationRow title="Product updates" sub="Occasional updates about new features" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationRow({ title, sub, defaultOn }: { title: string; sub: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
