"use client";

import { useRef, useState } from "react";
import { ImageIcon, UploadCloud, Video, X } from "lucide-react";
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
import { Progress } from "@/components/dashboard/progress-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Creative, CreativeFormat } from "@/lib/types";

const formatLabels: Record<CreativeFormat, string> = {
  "300x250": "Display — 300×250",
  "728x90": "Display — 728×90",
  "320x50": "Mobile — 320×50",
  "video-15s": "Video — 15s",
  "video-30s": "Video — 30s",
  native: "Native",
};

const VIDEO_FORMATS: CreativeFormat[] = ["video-15s", "video-30s"];
const IMAGE_FORMATS: CreativeFormat[] = ["300x250", "728x90", "320x50", "native"];

function detectKind(file: File): "video" | "image" {
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

function defaultFormat(file: File): CreativeFormat {
  return detectKind(file) === "video" ? "video-15s" : "300x250";
}

function defaultName(file: File): string {
  return file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Untitled creative";
}

function readableSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface NewCreativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (creative: Creative) => void;
  campaigns: { id: string; name: string }[];
}

export function NewCreativeDialog({ open, onOpenChange, onCreate, campaigns }: NewCreativeDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [campaignId, setCampaignId] = useState<string>(campaigns[0]?.id ?? "");
  const [format, setFormat] = useState<CreativeFormat>("300x250");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setFile(null);
    setName("");
    setProgress(0);
    setUploading(false);
    setDragOver(false);
    setCampaignId(campaigns[0]?.id ?? "");
    setFormat("300x250");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onOpenChange(false);
      setTimeout(reset, 200);
    } else {
      onOpenChange(true);
    }
  };

  const handleFile = (f: File) => {
    setFile(f);
    setName(defaultName(f));
    setFormat(defaultFormat(f));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const submit = () => {
    if (!file) {
      toast.error("Add a file to upload.");
      return;
    }
    if (!campaignId) {
      toast.error("Pick a campaign.");
      return;
    }
    if (!name.trim()) {
      toast.error("Give the creative a name.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const start = Date.now();
    const duration = 900 + Math.random() * 600;
    const tick = setInterval(() => {
      const pct = Math.min(1, (Date.now() - start) / duration);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(tick);
        const campaign = campaigns.find((c) => c.id === campaignId);
        const creative: Creative = {
          id: `cr_${Date.now().toString(36)}`,
          name: name.trim(),
          campaignId,
          campaignName: campaign?.name ?? "",
          format,
          status: "pending",
          impressions: 0,
          clicks: 0,
          ctr: 0,
          thumbnail: String(Math.floor(Math.random() * 100)),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
        onCreate(creative);
        toast.success("Creative uploaded", {
          description: `"${creative.name}" is pending approval.`,
        });
        setUploading(false);
        handleOpenChange(false);
      }
    }, 60);
  };

  const formatOptions = file && detectKind(file) === "video" ? VIDEO_FORMATS : IMAGE_FORMATS;
  const showAllFormats = !file;

  return (
    <Dialog open={open} onOpenChange={(o) => !uploading && handleOpenChange(o)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload creative</DialogTitle>
          <DialogDescription>
            Drag a banner or video, or click to browse. New creatives start as <em>pending</em> until reviewed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 px-6 py-10 text-center transition-colors",
                dragOver
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted/50"
              )}
            >
              <UploadCloud className="h-8 w-8" strokeWidth={1.5} />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Drop a file here, or click to browse</p>
                <p className="text-xs">JPG, PNG, GIF, MP4, MOV — up to 50 MB</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={onPick}
              />
            </button>
          ) : (
            <FilePreview
              file={file}
              progress={progress}
              uploading={uploading}
              onRemove={() => {
                setFile(null);
                setProgress(0);
              }}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="creative-name">Creative name</Label>
            <Input
              id="creative-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spring Hero — 300x250"
              disabled={uploading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Campaign</Label>
              <Select
                value={campaignId}
                onValueChange={(v) => setCampaignId(v ?? "")}
                disabled={uploading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(v) => campaigns.find((c) => c.id === v)?.name ?? "Pick a campaign"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={format}
                onValueChange={(v) => setFormat((v ?? "300x250") as CreativeFormat)}
                disabled={uploading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{(v) => formatLabels[v as CreativeFormat] ?? "Format"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(showAllFormats ? [...IMAGE_FORMATS, ...VIDEO_FORMATS] : formatOptions).map((f) => (
                    <SelectItem key={f} value={f}>
                      {formatLabels[f]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="-mx-4 -mb-4 flex items-center justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={submit} disabled={uploading || !file}>
            {uploading ? `Uploading… ${Math.round(progress * 100)}%` : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilePreview({
  file,
  progress,
  uploading,
  onRemove,
}: {
  file: File;
  progress: number;
  uploading: boolean;
  onRemove: () => void;
}) {
  const isVideo = detectKind(file) === "video";
  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-gradient-to-br from-sky-500/30 to-indigo-500/30">
          {isVideo ? (
            <Video className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
          ) : (
            <ImageIcon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="num text-xs text-muted-foreground">
            {readableSize(file.size)} · {file.type || (isVideo ? "video" : "image")}
          </p>
        </div>
        {!uploading ? (
          <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      {uploading ? <Progress value={progress} /> : null}
    </div>
  );
}
