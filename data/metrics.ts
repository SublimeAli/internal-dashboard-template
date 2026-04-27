import type { ChannelMix, DailyMetric } from "@/lib/types";

const SEED_BASE = "2026-04-27";

function pseudo(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildSeries(days: number): DailyMetric[] {
  const end = new Date(SEED_BASE);
  const out: DailyMetric[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6 ? 0.78 : 1;
    const wave = 1 + 0.18 * Math.sin((days - i) / 4.2);
    const noise = 0.9 + pseudo(i, 1) * 0.25;
    const base = 12500 * weekend * wave * noise;
    const impressions = Math.round(base * 175);
    const clicks = Math.round(impressions * (0.0026 + pseudo(i, 2) * 0.0008));
    const conversions = Math.round(clicks * (0.038 + pseudo(i, 3) * 0.012));
    out.push({
      date: d.toISOString().slice(0, 10),
      spend: Math.round(base),
      impressions,
      clicks,
      conversions,
    });
  }
  return out;
}

export const dailyMetrics30d: DailyMetric[] = buildSeries(30);
export const dailyMetrics7d: DailyMetric[] = buildSeries(7);
export const dailyMetrics90d: DailyMetric[] = buildSeries(90);

export const channelMix: ChannelMix[] = [
  { channel: "display", spend: 184300, impressions: 38_100_000 },
  { channel: "video", spend: 142800, impressions: 19_600_000 },
  { channel: "ctv", spend: 92500, impressions: 4_700_000 },
  { channel: "native", spend: 53800, impressions: 7_400_000 },
  { channel: "audio", spend: 34100, impressions: 2_900_000 },
  { channel: "dooh", spend: 77900, impressions: 12_600_000 },
];

export interface KpiSnapshot {
  label: string;
  value: number;
  delta: number;
  format: "currency" | "number" | "percent";
  spark: number[];
}

function spark(seed: number, len = 14) {
  return Array.from({ length: len }, (_, i) => 50 + Math.sin(i / 1.7 + seed) * 18 + pseudo(i, seed) * 12);
}

export const overviewKpis: KpiSnapshot[] = [
  { label: "Spend", value: 585400, delta: 0.082, format: "currency", spark: spark(1) },
  { label: "Impressions", value: 85_300_000, delta: 0.061, format: "number", spark: spark(2) },
  { label: "Clicks", value: 412_900, delta: 0.118, format: "number", spark: spark(3) },
  { label: "CTR", value: 0.00484, delta: 0.054, format: "percent", spark: spark(4) },
  { label: "Conversions", value: 21_840, delta: 0.143, format: "number", spark: spark(5) },
  { label: "eCPM", value: 6.86, delta: -0.021, format: "currency", spark: spark(6) },
];
