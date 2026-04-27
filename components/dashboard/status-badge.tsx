import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignStatus, CreativeStatus } from "@/lib/types";

const styles: Record<CampaignStatus | CreativeStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  draft: "bg-muted text-muted-foreground border-border",
  ended: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

export function StatusBadge({ status }: { status: CampaignStatus | CreativeStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize font-normal", styles[status])}>
      {status}
    </Badge>
  );
}
