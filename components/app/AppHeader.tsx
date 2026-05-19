import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { AppNav } from "@/components/app/AppNav";
import { CommonAreaLogoLink } from "@/components/brand/CommonAreaLogo";
import { Badge } from "@/components/ui/Badge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1520px] flex-col gap-5 px-5 py-5 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <CommonAreaLogoLink href="/">
            <div>
              <p className="v16-topline">Common Area</p>
              <p className="mt-1 text-sm text-black/55" style={{ fontFamily: "var(--v16-mono)" }}>
                Authenticated common room
              </p>
            </div>
          </CommonAreaLogoLink>

          <div className="flex items-center gap-3">
            <Badge variant="butter" className="hidden sm:inline-flex rounded-full px-4 py-2 font-[var(--v16-mono)]">
              Crumbs saved you a spot.
            </Badge>
            {/* TODO: remove — temp mascot lab */}
            <Link
              href="/crumbs-lab"
              className="shrink-0 rounded-full border border-black/12 bg-white/90 px-3 py-1.5 text-[0.7rem] font-semibold tracking-tight text-black/75 hover:bg-white"
            >
              Crumbs lab
            </Link>
            <UserButton />
          </div>
        </div>
        <AppNav />
      </div>
    </header>
  );
}
