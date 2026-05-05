import type { ReactNode } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";
import { V16Theme } from "@/components/site/V16Theme";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  hideIntro?: boolean;
};

export function AppShell({ title, description, children, hideIntro }: AppShellProps) {
  return (
    <V16Theme className="min-h-screen">
      <AppHeader />
      <main className="flex-1 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1520px]">
          {!hideIntro ? (
            <>
              <div className="max-w-3xl">
                <Badge variant="neutral" className="rounded-full px-4 py-2 font-[var(--v16-mono)]">
                  Protected preview
                </Badge>
                <h1 className="v16-h2 mt-5">{title}</h1>
                <p className="v16-small mt-4">{description}</p>
                <Sticker className="mt-6">Showing up counts.</Sticker>
              </div>
              <div className="mt-10">{children}</div>
            </>
          ) : (
            children
          )}
        </div>
      </main>
    </V16Theme>
  );
}
