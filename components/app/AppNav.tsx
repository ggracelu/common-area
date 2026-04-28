"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const appLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Season", href: "/season" },
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
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                : "bg-white/65 text-[color:rgba(37,34,30,0.72)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
