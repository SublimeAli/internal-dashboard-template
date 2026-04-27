import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-16">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs">A</span>
          <span>Adstack</span>
        </div>
        <div className="space-y-2">
          <p className="num text-6xl font-semibold tracking-tight">404</p>
          <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground">
            The campaign, creative, or report you&apos;re looking for doesn&apos;t exist — or you may not have access.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to overview
          </Link>
          <Link href="/campaigns" className={buttonVariants({ size: "sm" })}>
            Browse campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}
