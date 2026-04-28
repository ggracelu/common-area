import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { AppNav } from "@/components/app/AppNav";

export function AppHeader() {
  return (
    <header className="border-b border-black/8 bg-[color:rgba(247,240,228,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-[var(--color-foreground)]">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl shadow-[0_10px_25px_rgba(191,90,54,0.25)]">
              🐈
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">Common Area</p>
              <p className="text-sm text-[color:rgba(37,34,30,0.68)]">Authenticated shell</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/season"
              className="hidden rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] sm:inline-flex"
            >
              Browse the season
            </Link>
            <UserButton />
          </div>
        </div>
        <AppNav />
      </div>
    </header>
  );
}
