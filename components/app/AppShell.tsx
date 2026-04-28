import type { ReactNode } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Sticker } from "@/components/ui/Sticker";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 px-6 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge variant="neutral">Protected preview</Badge>
            <h1 className="display-heading mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
            <p className="editorial-subhead mt-4">
              {description}
            </p>
            <Sticker className="mt-6">Showing up counts.</Sticker>
          </div>
          <div className="mt-10">{children}</div>
        </div>
      </main>
    </>
  );
}
