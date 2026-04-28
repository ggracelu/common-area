import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

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
              🐦
            </span>
            <span className="text-xl font-semibold tracking-tight">WhyNot</span>
          </Link>
          <Badge className="mt-8">Chicago season access</Badge>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.72)]">
            {description}
          </p>
          <p className="mt-8 text-sm font-medium text-[color:rgba(37,34,30,0.66)]">
            No swiping. Just sign up and show up.
          </p>
        </section>

        <section className="rounded-[2rem] border border-black/8 bg-white/86 p-4 shadow-[0_24px_80px_rgba(66,57,45,0.12)] backdrop-blur sm:p-6">
          {children}
        </section>
      </div>
    </main>
  );
}
