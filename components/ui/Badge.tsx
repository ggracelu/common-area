import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[color:rgba(191,90,54,0.18)] bg-[color:rgba(255,255,255,0.72)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)] ${className}`.trim()}
    >
      {children}
    </span>
  );
}
