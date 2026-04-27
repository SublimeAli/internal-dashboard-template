import { Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { audiences } from "@/data/audiences";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

const sourceTone: Record<string, string> = {
  "1st-party": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  "3rd-party": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  lookalike: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  contextual: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
};

export default function AudiencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audiences"
        description={`${audiences.length} segments — first-party, third-party, lookalike, and contextual`}
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> New segment
          </Button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {audiences.map((a) => (
          <Card key={a.id} className="transition-shadow hover:shadow-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" strokeWidth={1.75} />
                    <span className="text-xs">Segment</span>
                  </div>
                  <p className="mt-1 truncate font-medium">{a.name}</p>
                </div>
                <Badge variant="outline" className={`font-normal ${sourceTone[a.source]}`}>
                  {a.source}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Reachable users</p>
                <p className="num text-2xl font-semibold tracking-tight">
                  {a.size > 0 ? formatNumber(a.size, { compact: true }) : "Contextual"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">30d reach</p>
                  <p className="num font-medium">{a.reach30d ? formatNumber(a.reach30d, { compact: true }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="num font-medium">{formatPercent(a.ctr)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CPA</p>
                  <p className="num font-medium">{formatCurrency(a.cpa, { precise: true })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
