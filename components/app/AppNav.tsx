"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const appLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Season", href: "/bingo" },
  { label: "Cohort", href: "/cohort" },
  { label: "Bingo", href: "/bingo" },
  { label: "Profile", href: "/profile" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {appLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className={`rounded-full px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em] transition-colors ${
              isActive
                ? "bg-black text-white shadow-[0_18px_55px_rgba(52,36,24,0.14)]"
                : "border border-black/15 bg-white/70 text-black/65 hover:bg-white hover:text-black"
            }`}
            style={{ fontFamily: "var(--v16-mono)" }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
