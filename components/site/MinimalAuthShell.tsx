import type { ReactNode } from "react";
import { CommonAreaLogoLink } from "@/components/brand/CommonAreaLogo";
import { V16Theme } from "@/components/site/V16Theme";

export function MinimalAuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <V16Theme className="min-h-screen">
      <main className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-[520px]">
          <CommonAreaLogoLink href="/" className="inline-flex">
            <span className="v16-topline">Common Area</span>
          </CommonAreaLogoLink>
          <h1 className="v16-h2 mt-6">{title}</h1>
          <section className="paper-surface mt-6 rounded-[2rem] p-4 sm:p-6">
            {children}
          </section>
        </div>
      </main>
    </V16Theme>
  );
}

