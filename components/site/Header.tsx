import { navLinks } from "@/lib/site-content";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/8 bg-[color:rgba(247,240,228,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-[var(--color-foreground)]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-xl shadow-[0_10px_25px_rgba(191,90,54,0.25)]">
            🐦
          </span>
          <span className="text-lg font-semibold tracking-tight sm:text-xl">WhyNot</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[color:rgba(37,34,30,0.7)] md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-[var(--color-foreground)]">
              {link.label}
            </a>
          ))}
        </nav>

        <Button href="#season" className="hidden sm:inline-flex">
          See the season
        </Button>
      </div>
    </header>
  );
}
