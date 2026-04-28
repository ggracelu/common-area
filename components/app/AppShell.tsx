import type { ReactNode } from "react";
import { AppHeader } from "@/components/app/AppHeader";

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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Protected preview
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 text-lg leading-8 text-[color:rgba(37,34,30,0.72)]">
              {description}
            </p>
          </div>
          <div className="mt-10">{children}</div>
        </div>
      </main>
    </>
  );
}
