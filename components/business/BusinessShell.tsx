import type { ReactNode } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CommonAreaLogoLink } from "@/components/brand/CommonAreaLogo";
import { Badge } from "@/components/ui/Badge";
import { V16Theme } from "@/components/site/V16Theme";

type BusinessShellProps = {
  children: ReactNode;
};

export function BusinessShell({ children }: BusinessShellProps) {
  return (
    <V16Theme className="min-h-screen bg-[var(--v16-off)]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <CommonAreaLogoLink href="/partner">
            <div className="min-w-0">
              <p className="v16-topline">Common Area</p>
              <p className="mt-0.5 text-xs text-black/55" style={{ fontFamily: "var(--v16-mono)" }}>
                Partner preview
              </p>
            </div>
          </CommonAreaLogoLink>

          <div className="flex items-center gap-3">
            <Badge variant="neutral" className="hidden rounded-full px-3 py-1.5 sm:inline-flex">
              Partner preview
            </Badge>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1200px]">{children}</div>
      </main>
    </V16Theme>
  );
}
