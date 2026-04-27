const compactNum = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fullNum = new Intl.NumberFormat("en-US");
const compactCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const fullCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const preciseCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatNumber(n: number, opts: { compact?: boolean } = {}) {
  return opts.compact ? compactNum.format(n) : fullNum.format(n);
}

export function formatCurrency(n: number, opts: { compact?: boolean; precise?: boolean } = {}) {
  if (opts.precise) return preciseCurrency.format(n);
  return opts.compact ? compactCurrency.format(n) : fullCurrency.format(n);
}

export function formatPercent(n: number, fractionDigits = 2) {
  return `${(n * 100).toFixed(fractionDigits)}%`;
}

export function formatDelta(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(1)}%`;
}

export function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.round((now - then) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}
