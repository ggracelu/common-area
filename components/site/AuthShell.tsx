import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { Sticker } from "@/components/ui/Sticker";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3 text-[var(--color-foreground)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl shadow-[0_10px_25px_rgba(191,90,54,0.25)]">
              🐈
            </span>
            <span className="text-xl font-semibold tracking-tight">Common Area</span>
          </Link>
          <Badge variant="sky" className="mt-8">Chicago season access</Badge>
          <h1 className="display-heading mt-5 text-5xl font-semibold sm:text-6xl">
            {title}
          </h1>
          <p className="editorial-subhead mt-5">
            {description}
          </p>
          <Sticker className="mt-8">Your spot is still here.</Sticker>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Polaroid title="Common room note" caption="Someone else is also nervous." tilt="left">
              <div aria-hidden="true" className="flex min-h-[8rem] items-end justify-between bg-[linear-gradient(180deg,rgba(191,212,223,0.84),rgba(246,239,230,0.92))] p-4 text-4xl">
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

        <section className="paper-surface rounded-[2rem] p-4 sm:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
