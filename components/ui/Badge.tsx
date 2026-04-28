import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "neutral" | "butter" | "moss" | "rust" | "sky" | "sticker";
  className?: string;
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    neutral:
      "border-[color:rgba(189,98,63,0.18)] bg-[color:rgba(255,248,240,0.78)] text-[var(--color-accent)]",
    butter:
      "border-transparent bg-[var(--color-butter)] text-[var(--color-foreground)]",
    moss:
      "border-transparent bg-[var(--color-moss)] text-[var(--color-paper)]",
    rust:
      "border-transparent bg-[var(--color-accent)] text-[var(--color-paper)]",
    sky:
      "border-transparent bg-[var(--color-sky)] text-[var(--color-foreground)]",
    sticker:
      "border-[color:rgba(32,28,26,0.08)] bg-[var(--color-butter)] text-[var(--color-foreground)] shadow-[0_10px_20px_rgba(52,36,24,0.12)]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-sticker)] border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${variantClasses} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
