import { PageHeader } from "@/components/layout/page-header";
import { PlacementsTable } from "@/components/tables/placements-table";
import { placements } from "@/data/placements";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function InventoryPage() {
  const sorted = [...placements].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = sorted.reduce((s, p) => s + p.revenue, 0);
  const totalImpressions = sorted.reduce((s, p) => s + p.impressions, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description={`${sorted.length} placements · ${formatNumber(totalImpressions, { compact: true })} impressions · ${formatCurrency(totalRevenue, { compact: true })} revenue`}
      />
      <PlacementsTable data={sorted} />
    </div>
  );
}
