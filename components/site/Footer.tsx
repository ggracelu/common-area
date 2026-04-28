export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[color:rgba(255,248,240,0.55)] px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[color:rgba(37,34,30,0.72)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-[var(--color-foreground)]">Common Area</p>
          <p>Recurring, interest-driven social life for Chicago.</p>
          <p className="mt-1 text-[color:rgba(37,34,30,0.58)]">Crumbs saved you a spot.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#how-it-works" className="hover:text-[var(--color-foreground)]">
            How it works
          </a>
          <a href="#season" className="hover:text-[var(--color-foreground)]">
            Season preview
          </a>
          <a href="#faq" className="hover:text-[var(--color-foreground)]">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
