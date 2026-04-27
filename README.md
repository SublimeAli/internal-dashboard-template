# Ad Tech Internal Dashboard Template

A free, open-source Next.js dashboard template for ad operations teams — campaigns, creatives, inventory, audiences, and reports — built with Tailwind CSS, shadcn/ui, and Recharts.

Designed and developed by **[Ali Madjaji](https://www.alimadjaji.com)** — free to download at [alimadjaji.com/templates](https://www.alimadjaji.com/templates).

![Ad Tech Internal Dashboard — overview](https://xgrzvufpvvjctmeffoyw.supabase.co/storage/v1/object/public/images/templates/1777294555816-wkoodlzrwje.png)

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (CSS variables, light & dark themes)
- Recharts for charts, TanStack Table for data tables
- Mock cookie-based auth so you can demo the full app immediately

## What's included

- **Login screen** with mock auth (any email/password works)
- **Overview** — KPI cards with sparklines, spend-over-time chart, channel-mix donut, top-campaigns table, activity feed
- **Campaigns** — sortable/filterable table, plus a per-campaign detail page with Performance / Creatives / Settings tabs
- **Creatives** gallery with format, status, CTR
- **Inventory** placements with fill rate, eCPM, viewability
- **Audiences** segments — first-party, third-party, lookalike, contextual
- **Reports** — saved reports table + a simple report builder
- **Settings** — workspace, team, integrations, notifications
- ⌘K command palette for quick navigation
- Light & dark themes wired up via `next-themes`

## Use this template

The fastest way is the green **Use this template** button at the top of this repo — it creates a fresh repository on your account with a clean commit history.

Prefer the command line? `degit` strips the `.git` folder and gives you a pristine working tree:

```bash
npx degit SublimeAli/internal-dashboard-template my-dashboard
cd my-dashboard
git init
npm install
npm run dev
```

## Requirements

- Node.js **≥ 20**
- npm

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and sign in with any email and password.

## Customizing your dashboard

- **Mock data** — every list and chart reads from a single TypeScript file in `data/`. Edit `data/campaigns.ts`, `data/creatives.ts`, `data/placements.ts`, `data/audiences.ts`, `data/reports.ts`, and `data/metrics.ts` to swap in your own.
- **Types** — entity shapes live in `lib/types.ts`. Wire your real API by writing fetchers that return the same shapes; the UI will keep working.
- **Auth** — the demo uses a signed cookie set in `app/(auth)/login/actions.ts`. Replace it with NextAuth, Auth.js, Clerk, or your own provider — the layout in `app/(dashboard)/layout.tsx` reads `lib/mock-auth.ts`, so swap that one file.
- **Theme** — edit CSS variables in `app/globals.css` (look for `--primary`, `--chart-1`…`--chart-5`, `--radius`). The chart palette and primary color cascade everywhere.
- **Logo & brand** — the "A" logo mark is rendered inline in `components/layout/sidebar.tsx`, `app/(auth)/login/page.tsx`, and the topbar. Replace with your own SVG or `Image` component.
- **Navigation** — `lib/nav.ts` is the single source of truth; the sidebar, mobile nav, and ⌘K palette all read from it.
- **Sidebar credit** — the small "Free template by Ali Madjaji" link in the sidebar footer is part of the template; please keep it visible if you publish your dashboard. Edit it in `components/layout/sidebar.tsx`.

## Adding shadcn components

```bash
npx shadcn@latest add <component>
```

Components are placed in `components/ui/`.

## Deploy

The fastest way is Vercel (zero config):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SublimeAli/internal-dashboard-template)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js. Click Deploy. No environment variables required.

Netlify, Cloudflare Pages, or self-hosting (`npm run build && npm start`) all work too.

## License

Released under the [MIT License](./LICENSE).

---

© [Ali Madjaji](https://www.alimadjaji.com) · [alimadjaji.com](https://www.alimadjaji.com)
