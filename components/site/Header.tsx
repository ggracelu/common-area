import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { navLinks } from "@/lib/site-content";

export async function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/8 bg-[color:rgba(247,240,228,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-[var(--color-foreground)]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl shadow-[0_10px_25px_rgba(191,90,54,0.25)]">
            🐈
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight sm:text-xl">Common Area</span>
            <span className="hidden text-xs text-[color:rgba(37,34,30,0.58)] sm:block">
              Turn your city into a campus.
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-[color:rgba(37,34,30,0.7)]">
            {navLinks.map((link) => {
              const href = link.label === "Season" ? "/bingo" : link.href;

              return (
                <Link
                  key={link.href}
                  href={href}
                  className="transition-colors hover:text-[var(--color-foreground)]"
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/dashboard" prefetch={false} className="transition-colors hover:text-[var(--color-foreground)]">
              Dashboard
            </Link>
            <Link href="/sign-in" className="transition-colors hover:text-[var(--color-foreground)]">
              Sign in
            </Link>
          </nav>
          <Button href="/sign-up" className="hidden sm:inline-flex">
            Join the Chicago season
          </Button>
          <Badge variant="sky" className="hidden lg:inline-flex">Preview</Badge>
          <UserButton />
        </div>
        <div className="md:hidden">
          <Button href="/sign-up" variant="sticker">Save me a spot</Button>
        </div>
      </div>
    </header>
  );
}
