import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]";

  const variantClasses =
    variant === "primary"
      ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-[0_18px_35px_rgba(37,34,30,0.18)]"
      : "border border-[color:rgba(37,34,30,0.16)] bg-white/70 text-[var(--color-foreground)]";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${className}`.trim()}>
      {children}
    </Link>
  );
}
