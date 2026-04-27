import type { Placement } from "@/lib/types";

export const placements: Placement[] = [
  { id: "p_01", site: "nytimes.com", channel: "display", country: "US", impressions: 8_400_000, fillRate: 0.94, ecpm: 9.8, viewability: 0.74, revenue: 82320 },
  { id: "p_02", site: "weather.com", channel: "display", country: "US", impressions: 6_200_000, fillRate: 0.97, ecpm: 7.2, viewability: 0.69, revenue: 44640 },
  { id: "p_03", site: "youtube.com", channel: "video", country: "US", impressions: 9_800_000, fillRate: 0.99, ecpm: 14.6, viewability: 0.88, revenue: 143080 },
  { id: "p_04", site: "spotify.com", channel: "audio", country: "US", impressions: 2_900_000, fillRate: 0.92, ecpm: 11.4, viewability: 0.0, revenue: 33060 },
  { id: "p_05", site: "hulu.com", channel: "ctv", country: "US", impressions: 3_100_000, fillRate: 0.96, ecpm: 28.4, viewability: 0.95, revenue: 88040 },
  { id: "p_06", site: "buzzfeed.com", channel: "native", country: "US", impressions: 4_400_000, fillRate: 0.91, ecpm: 5.8, viewability: 0.66, revenue: 25520 },
  { id: "p_07", site: "espn.com", channel: "display", country: "US", impressions: 5_700_000, fillRate: 0.95, ecpm: 8.4, viewability: 0.71, revenue: 47880 },
  { id: "p_08", site: "guardian.co.uk", channel: "display", country: "GB", impressions: 3_400_000, fillRate: 0.93, ecpm: 6.9, viewability: 0.7, revenue: 23460 },
  { id: "p_09", site: "tubi.tv", channel: "ctv", country: "US", impressions: 2_200_000, fillRate: 0.94, ecpm: 22.1, viewability: 0.93, revenue: 48620 },
  { id: "p_10", site: "lemonde.fr", channel: "display", country: "FR", impressions: 1_900_000, fillRate: 0.9, ecpm: 5.2, viewability: 0.68, revenue: 9880 },
  { id: "p_11", site: "tiktok.com", channel: "video", country: "US", impressions: 7_600_000, fillRate: 0.98, ecpm: 12.1, viewability: 0.86, revenue: 91960 },
  { id: "p_12", site: "reddit.com", channel: "native", country: "US", impressions: 3_000_000, fillRate: 0.89, ecpm: 4.6, viewability: 0.62, revenue: 13800 },
  { id: "p_13", site: "billboard-times-square", channel: "dooh", country: "US", impressions: 5_200_000, fillRate: 1.0, ecpm: 18.4, viewability: 0.0, revenue: 95680 },
  { id: "p_14", site: "billboard-sunset-blvd", channel: "dooh", country: "US", impressions: 3_200_000, fillRate: 1.0, ecpm: 16.2, viewability: 0.0, revenue: 51840 },
  { id: "p_15", site: "twitch.tv", channel: "video", country: "US", impressions: 4_100_000, fillRate: 0.96, ecpm: 13.0, viewability: 0.85, revenue: 53300 },
];
