import { CommandMenu } from "@/components/layout/command-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import type { User } from "@/lib/types";

export function Topbar({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <MobileNav />
      <div className="flex flex-1 items-center gap-3">
        <CommandMenu />
      </div>
      <UserMenu user={user} />
    </header>
  );
}
