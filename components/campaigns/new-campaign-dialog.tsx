"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Campaign, CampaignObjective, Channel } from "@/lib/types";

const objectiveLabels: Record<CampaignObjective, string> = {
  awareness: "Awareness",
  consideration: "Consideration",
  conversions: "Conversions",
  retargeting: "Retargeting",
};

const ALL_CHANNELS: Channel[] = ["display", "video", "ctv", "native", "audio", "dooh"];
const STEP_LABELS = ["Basics", "Schedule & budget", "Review"];

const todayISO = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (campaign: Campaign) => void;
  advertiserSuggestions?: string[];
}

export function NewCampaignDialog({
  open,
  onOpenChange,
  onCreate,
  advertiserSuggestions = [],
}: NewCampaignDialogProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [objective, setObjective] = useState<CampaignObjective>("awareness");
  const [channels, setChannels] = useState<Set<Channel>>(new Set(["display"]));
  const [budget, setBudget] = useState("50000");
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(inDays(30));
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep(0);
    setName("");
    setAdvertiser("");
    setObjective("awareness");
    setChannels(new Set(["display"]));
    setBudget("50000");
    setStartDate(todayISO());
    setEndDate(inDays(30));
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const toggleChannel = (c: Channel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (step >= 0) {
      if (!name.trim()) e.name = "Required";
      if (!advertiser.trim()) e.advertiser = "Required";
    }
    if (step >= 1) {
      if (channels.size === 0) e.channels = "Pick at least one channel";
      const b = Number(budget);
      if (!Number.isFinite(b) || b <= 0) e.budget = "Must be greater than 0";
      if (new Date(endDate) < new Date(startDate)) e.endDate = "Must be after start";
    }
    return e;
  }, [step, name, advertiser, channels, budget, startDate, endDate]);

  const stepHasErrors = (s: number) => {
    if (s === 0) return !!(errors.name || errors.advertiser);
    if (s === 1) return !!(errors.channels || errors.budget || errors.endDate);
    return false;
  };

  const next = () => {
    if (stepHasErrors(step)) return;
    setStep((s) => Math.min(2, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    const campaign: Campaign = {
      id: `cmp_${Date.now().toString(36)}`,
      name: name.trim(),
      advertiser: advertiser.trim(),
      status: "draft",
      objective,
      channels: Array.from(channels),
      budget: Number(budget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      startDate,
      endDate,
      pacing: 0,
    };
    setTimeout(() => {
      onCreate(campaign);
      toast.success("Campaign created", {
        description: `"${campaign.name}" was saved as a draft.`,
      });
      setSubmitting(false);
      close();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>
            Set up the basics, then schedule and budget. Campaigns start as drafts — you can launch them after review.
          </DialogDescription>
        </DialogHeader>

        <Stepper current={step} />

        <div className="min-h-[280px] space-y-4">
          {step === 0 && (
            <BasicsStep
              name={name}
              setName={setName}
              advertiser={advertiser}
              setAdvertiser={setAdvertiser}
              objective={objective}
              setObjective={setObjective}
              advertiserSuggestions={advertiserSuggestions}
              errors={errors}
            />
          )}
          {step === 1 && (
            <ScheduleStep
              channels={channels}
              toggleChannel={toggleChannel}
              budget={budget}
              setBudget={setBudget}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              errors={errors}
            />
          )}
          {step === 2 && (
            <ReviewStep
              name={name}
              advertiser={advertiser}
              objective={objective}
              channels={channels}
              budget={Number(budget)}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </div>

        <div className="-mx-4 -mb-4 flex items-center justify-between gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          {step > 0 ? (
            <Button variant="outline" size="sm" onClick={back} disabled={submitting}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={close} disabled={submitting}>
              Cancel
            </Button>
          )}
          {step < 2 ? (
            <Button size="sm" onClick={next} disabled={stepHasErrors(step)}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={submit} disabled={submitting}>
              <Sparkles className="mr-1.5 h-4 w-4" />
              {submitting ? "Creating…" : "Create campaign"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 pb-1 text-xs">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden sm:inline-block whitespace-nowrap font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEP_LABELS.length - 1 ? (
              <span className="ml-1 hidden h-px flex-1 bg-border sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}

function BasicsStep({
  name,
  setName,
  advertiser,
  setAdvertiser,
  objective,
  setObjective,
  advertiserSuggestions,
  errors,
}: {
  name: string;
  setName: (v: string) => void;
  advertiser: string;
  setAdvertiser: (v: string) => void;
  objective: CampaignObjective;
  setObjective: (v: CampaignObjective) => void;
  advertiserSuggestions: string[];
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign name</Label>
        <Input
          id="campaign-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Holiday Tease — Q4 Prep"
          autoFocus
          aria-invalid={!!errors.name}
        />
        <FieldError msg={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-advertiser">Advertiser</Label>
        <Input
          id="campaign-advertiser"
          value={advertiser}
          onChange={(e) => setAdvertiser(e.target.value)}
          placeholder="Type or pick an existing advertiser"
          list="advertiser-list"
          aria-invalid={!!errors.advertiser}
        />
        <datalist id="advertiser-list">
          {advertiserSuggestions.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
        <FieldError msg={errors.advertiser} />
      </div>

      <div className="space-y-2">
        <Label>Objective</Label>
        <Select
          value={objective}
          onValueChange={(v) => setObjective((v ?? "awareness") as CampaignObjective)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{(v) => objectiveLabels[v as CampaignObjective] ?? "Objective"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(objectiveLabels) as CampaignObjective[]).map((k) => (
              <SelectItem key={k} value={k}>
                {objectiveLabels[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ScheduleStep({
  channels,
  toggleChannel,
  budget,
  setBudget,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  errors,
}: {
  channels: Set<Channel>;
  toggleChannel: (c: Channel) => void;
  budget: string;
  setBudget: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Channels</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_CHANNELS.map((c) => {
            const on = channels.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleChannel(c)}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.channels} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-budget">Budget (USD)</Label>
        <Input
          id="campaign-budget"
          type="number"
          min="0"
          step="1000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          aria-invalid={!!errors.budget}
        />
        <FieldError msg={errors.budget} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="campaign-start">Start date</Label>
          <Input
            id="campaign-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaign-end">End date</Label>
          <Input
            id="campaign-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-invalid={!!errors.endDate}
          />
          <FieldError msg={errors.endDate} />
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  name,
  advertiser,
  objective,
  channels,
  budget,
  startDate,
  endDate,
}: {
  name: string;
  advertiser: string;
  objective: CampaignObjective;
  channels: Set<Channel>;
  budget: number;
  startDate: string;
  endDate: string;
}) {
  const days = Math.max(
    1,
    Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000)
  );
  const dailyBudget = budget / days;

  return (
    <div className="space-y-3 text-sm">
      <Row label="Campaign" value={name} />
      <Row label="Advertiser" value={advertiser} />
      <Row label="Objective" value={objectiveLabels[objective]} />
      <Row
        label="Channels"
        value={Array.from(channels).map((c) => c.toUpperCase()).join(", ") || "—"}
      />
      <Row label="Budget" value={formatCurrency(budget, { compact: true })} />
      <Row label="Schedule" value={`${startDate} → ${endDate} · ${days} days`} />
      <Row label="Daily pacing" value={formatCurrency(dailyBudget, { compact: true })} />
      <p className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
        This campaign will be saved as a <span className="font-medium text-foreground">draft</span>.
        You can launch it from the campaign detail page when you&apos;re ready.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}
