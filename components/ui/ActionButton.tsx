"use client";

import type { ButtonHTMLAttributes } from "react";

export function ActionButton({
  className = "",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-3 text-sm font-semibold shadow-[var(--shadow-button)]",
        "bg-[var(--color-foreground)] text-[var(--color-paper)] hover:bg-[var(--color-accent-dark)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

