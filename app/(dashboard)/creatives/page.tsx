"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { CreativesGrid } from "@/components/creatives/creatives-grid";
import { NewCreativeDialog } from "@/components/creatives/new-creative-dialog";
import { creatives as initialCreatives } from "@/data/creatives";
import { campaigns as allCampaigns } from "@/data/campaigns";
import type { Creative } from "@/lib/types";

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>(initialCreatives);
  const [dialogOpen, setDialogOpen] = useState(false);

  const campaignOptions = useMemo(
    () =>
      allCampaigns
        .filter((c) => c.status !== "ended")
        .map((c) => ({ id: c.id, name: c.name })),
    []
  );

  const addCreative = (cr: Creative) => setCreatives((prev) => [cr, ...prev]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Creatives"
        description={`${creatives.length} ad creatives across active campaigns`}
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Upload creative
          </Button>
        }
      />
      <NewCreativeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={addCreative}
        campaigns={campaignOptions}
      />
      <CreativesGrid data={creatives} />
    </div>
  );
}
