"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignsTable } from "@/components/tables/campaigns-table";
import { NewCampaignDialog } from "@/components/campaigns/new-campaign-dialog";
import { campaigns as initialCampaigns } from "@/data/campaigns";
import type { Campaign } from "@/lib/types";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [dialogOpen, setDialogOpen] = useState(false);

  const advertisers = useMemo(
    () => Array.from(new Set(campaigns.map((c) => c.advertiser))).sort(),
    [campaigns]
  );

  const addCampaign = (c: Campaign) => setCampaigns((prev) => [c, ...prev]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description={`${campaigns.length} campaigns across all advertisers`}
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New campaign
          </Button>
        }
      />
      <NewCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={addCampaign}
        advertiserSuggestions={advertisers}
      />
      <CampaignsTable data={campaigns} />
    </div>
  );
}
