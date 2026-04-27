import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activity } from "@/data/activity";
import { formatRelative } from "@/lib/format";

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <p className="leading-snug">
                  <span className="font-medium">{item.actor}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span>{item.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{formatRelative(item.at)}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
