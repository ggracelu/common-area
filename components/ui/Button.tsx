import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "sticker";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "lift-hover inline-flex items-center justify-center rounded-[var(--radius-button)] border text-sm font-semibold uppercase tracking-[0.18em] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]";

  const sizeClasses = {
    sm: "px-4 py-2.5 text-[0.68rem]",
    md: "px-5 py-3 text-[0.72rem]",
    lg: "px-6 py-4 text-[0.8rem]",
  }[size];

  const variantClasses = {
    primary:
      "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-paper)] shadow-[var(--shadow-button)] hover:border-[var(--color-accent-dark)] hover:bg-[var(--color-accent-dark)]",
    secondary:
      "border-[var(--color-line)] bg-[color:rgba(255,248,240,0.82)] text-[var(--color-foreground)] shadow-[0_10px_22px_rgba(52,36,24,0.08)] hover:bg-[color:rgba(232,194,184,0.26)]",
    ghost:
      "border-transparent bg-transparent text-[var(--color-foreground)] hover:border-[var(--color-line)] hover:bg-white/55",
    sticker:
      "border-[color:rgba(32,28,26,0.08)] bg-[var(--color-butter)] text-[var(--color-foreground)] shadow-[0_10px_24px_rgba(52,36,24,0.12)] hover:bg-[color:rgba(242,203,113,0.9)]",
  }[variant];

  return (
    <Link href={href} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`.trim()}>
      {children}
    </Link>
  );
}
