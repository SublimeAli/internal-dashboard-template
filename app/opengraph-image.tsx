import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Adstack — Ad Tech Internal Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: "#f5f5f5",
          background:
            "radial-gradient(ellipse at top left, rgba(99,102,241,0.35), transparent 55%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.30), transparent 55%), #0a0a0a",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#f5f5f5",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>Adstack</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 24, color: "#a3a3a3", letterSpacing: 2, textTransform: "uppercase" }}>
            Free Next.js template
          </div>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.5 }}>
            An internal dashboard for ad operations.
          </div>
          <div style={{ fontSize: 28, color: "#a3a3a3" }}>
            Campaigns · Creatives · Inventory · Audiences · Reports
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a3a3a3" }}>
          <div>Next.js 16 · Tailwind · shadcn/ui · Recharts</div>
          <div>alimadjaji.com/templates</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
