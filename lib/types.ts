export type CampaignStatus = "active" | "paused" | "draft" | "ended";
export type CampaignObjective =
  | "awareness"
  | "consideration"
  | "conversions"
  | "retargeting";
export type Channel = "display" | "video" | "ctv" | "native" | "audio" | "dooh";

export interface Campaign {
  id: string;
  name: string;
  advertiser: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  channels: Channel[];
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  pacing: number;
}

export type CreativeStatus = "approved" | "pending" | "rejected" | "draft";
export type CreativeFormat = "300x250" | "728x90" | "320x50" | "video-15s" | "video-30s" | "native";

export interface Creative {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  format: CreativeFormat;
  status: CreativeStatus;
  impressions: number;
  clicks: number;
  ctr: number;
  thumbnail: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  site: string;
  channel: Channel;
  country: string;
  impressions: number;
  fillRate: number;
  ecpm: number;
  viewability: number;
  revenue: number;
}

export type AudienceSource = "1st-party" | "3rd-party" | "lookalike" | "contextual";

export interface Audience {
  id: string;
  name: string;
  source: AudienceSource;
  size: number;
  reach30d: number;
  ctr: number;
  cpa: number;
  updatedAt: string;
}

export interface Report {
  id: string;
  name: string;
  owner: string;
  schedule: "manual" | "daily" | "weekly" | "monthly";
  lastRun: string;
  metrics: string[];
  dimensions: string[];
}

export interface DailyMetric {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface ChannelMix {
  channel: Channel;
  spend: number;
  impressions: number;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trader" | "ops" | "viewer";
  avatar?: string;
}
