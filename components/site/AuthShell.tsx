import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { Sticker } from "@/components/ui/Sticker";
import { V16Theme } from "@/components/site/V16Theme";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <V16Theme className="min-h-screen">
      <main className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-8">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <section className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="v16-mark" aria-hidden="true">
                CA
              </span>
              <span className="v16-topline">Common Area</span>
            </Link>
            <Badge variant="sky" className="mt-8 rounded-full px-4 py-2 font-[var(--v16-mono)]">
              Chicago season access
            </Badge>
            <h1 className="v16-h2 mt-5">{title}</h1>
            <p className="v16-small mt-5">{description}</p>
            <Sticker className="mt-8">Your spot is still here.</Sticker>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Polaroid title="Common room note" caption="Someone else is also nervous." tilt="left">
                <div
                  aria-hidden="true"
                  className="flex min-h-[8rem] items-end justify-between rounded-2xl border border-black/10 bg-[linear-gradient(135deg,rgba(233,255,107,0.22),rgba(26,92,255,0.12),rgba(255,47,184,0.08),rgba(255,255,255,0.92))] p-4 text-4xl"
                >
                  <span>🛋️</span>
                  <span>🐈</span>
                </div>
              </Polaroid>
              <Card variant="paper" className="paper-surface">
                <p className="section-eyebrow">Crumbs says</p>
                <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.76)]">
                  Community is mostly showing up and knowing where the snacks are.
                </p>
              </Card>
            </div>
          </section>

          <section className="paper-surface rounded-[2rem] p-4 sm:p-6">{children}</section>
        </div>
      </main>
    </V16Theme>
  );
}
