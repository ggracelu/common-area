import type { ReactNode } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { V16Theme } from "@/components/site/V16Theme";
import { LiquidGlassPanel } from "@/components/visual/LiquidGlassPanel";
import { ShaderBackdrop } from "@/components/visual/ShaderBackdrop";
import { V16CursorGlow } from "@/components/visual/V16CursorGlow";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  hideIntro?: boolean;
  titleAside?: ReactNode;
  /** Renders to the right of the page title (e.g. primary CTA). */
  titleAction?: ReactNode;
  /** Full-width row below the title (e.g. “up next” callout). */
  titleCallout?: ReactNode;
};

export function AppShell({
  title,
  description,
  children,
  hideIntro,
  titleAside,
  titleAction,
  titleCallout,
}: AppShellProps) {
  return (
    <V16Theme className="min-h-screen">
      <ShaderBackdrop className="min-h-screen">
        <V16CursorGlow />
        <AppHeader />
        <main className="flex-1 px-5 py-10 md:px-10">
          <div className="mx-auto max-w-[1520px]">
            {!hideIntro ? (
              <LiquidGlassPanel className="p-6 md:p-8">
                <div className={titleAction || titleCallout ? "w-full" : "max-w-3xl"}>
                  <Badge variant="neutral" className="rounded-full px-4 py-2 font-[var(--v16-mono)]">
                    Protected preview
                  </Badge>
                  <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                    <div className="flex min-w-0 flex-wrap items-center gap-4">
                      <h1 className="v16-h2">{title}</h1>
                      {titleAside}
                    </div>
                    {titleAction ? <div className="flex shrink-0 items-center">{titleAction}</div> : null}
                  </div>
                  {titleCallout ? <div className="mt-5">{titleCallout}</div> : null}
                  <p className="v16-small mt-4 max-w-3xl">{description}</p>
                </div>
                <div className="mt-10">{children}</div>
              </LiquidGlassPanel>
            ) : (
              children
            )}
          </div>
        </main>
      </ShaderBackdrop>
    </V16Theme>
  );
}
