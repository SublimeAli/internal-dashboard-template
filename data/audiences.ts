import type { Audience } from "@/lib/types";

export const audiences: Audience[] = [
  { id: "a_01", name: "Past Purchasers — 90d", source: "1st-party", size: 1_240_000, reach30d: 412_000, ctr: 0.0094, cpa: 18.4, updatedAt: "2026-04-26" },
  { id: "a_02", name: "Cart Abandoners — 14d", source: "1st-party", size: 88_000, reach30d: 64_200, ctr: 0.0142, cpa: 12.6, updatedAt: "2026-04-26" },
  { id: "a_03", name: "Newsletter Subscribers", source: "1st-party", size: 320_000, reach30d: 124_000, ctr: 0.0061, cpa: 22.1, updatedAt: "2026-04-25" },
  { id: "a_04", name: "Lookalike — Top Spenders", source: "lookalike", size: 4_800_000, reach30d: 1_120_000, ctr: 0.0048, cpa: 28.7, updatedAt: "2026-04-22" },
  { id: "a_05", name: "Lookalike — App Installers", source: "lookalike", size: 6_200_000, reach30d: 1_840_000, ctr: 0.0052, cpa: 24.2, updatedAt: "2026-04-22" },
  { id: "a_06", name: "In-Market — Travel", source: "3rd-party", size: 12_400_000, reach30d: 2_100_000, ctr: 0.0036, cpa: 34.8, updatedAt: "2026-04-18" },
  { id: "a_07", name: "In-Market — Home Goods", source: "3rd-party", size: 8_900_000, reach30d: 1_640_000, ctr: 0.0041, cpa: 31.4, updatedAt: "2026-04-18" },
  { id: "a_08", name: "Contextual — Coffee Lovers", source: "contextual", size: 0, reach30d: 0, ctr: 0.0029, cpa: 38.2, updatedAt: "2026-04-12" },
  { id: "a_09", name: "Contextual — Finance News", source: "contextual", size: 0, reach30d: 0, ctr: 0.0034, cpa: 42.6, updatedAt: "2026-04-12" },
  { id: "a_10", name: "High LTV — Predicted", source: "1st-party", size: 96_000, reach30d: 41_800, ctr: 0.0118, cpa: 14.8, updatedAt: "2026-04-24" },
];
