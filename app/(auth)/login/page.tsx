import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs">A</span>
              <span>Adstack</span>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
            <p className="text-sm text-muted-foreground">
              Demo template — any email + password will work.
            </p>
          </div>
          <LoginForm />
          <p className="text-xs text-muted-foreground">
            By continuing you agree to the demo terms. No real authentication is performed.
          </p>
        </div>
      </section>
      <aside className="hidden lg:flex relative items-center justify-center overflow-hidden bg-muted/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.62_0.19_259/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.7_0.16_162/0.16),transparent_55%)]" />
        <div className="relative max-w-md p-10 space-y-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Free template</p>
          <h2 className="text-3xl font-semibold tracking-tight">An internal dashboard for ad operations.</h2>
          <p className="text-muted-foreground">
            Campaigns, creatives, inventory, audiences, and reports — wired with realistic mock data so
            you can fork it into your own product on day one.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 pt-2">
            <li>• Next.js 16 · App Router · TypeScript</li>
            <li>• Tailwind CSS 4 · shadcn/ui · Recharts</li>
            <li>• Mock auth, ⌘K palette, deterministic mock data</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
