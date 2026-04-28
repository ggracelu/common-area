import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "paper" | "scrapbook" | "polaroid";
  className?: string;
};

export function Card({ children, variant = "default", className = "" }: CardProps) {
  const variantClasses = {
    default:
      "rounded-[var(--radius-card)] bg-white/84 p-6 shadow-[var(--shadow-card)]",
    paper:
      "rounded-[var(--radius-card)] bg-[var(--color-paper-strong)] p-6 shadow-[var(--shadow-card)]",
    scrapbook:
      "rounded-[calc(var(--radius-card)+0.2rem)] bg-[linear-gradient(180deg,rgba(255,248,240,0.96),rgba(242,231,216,0.94))] p-6 shadow-[var(--shadow-card)] before:pointer-events-none before:absolute before:inset-x-8 before:-top-2 before:h-6 before:rounded-full before:bg-[color:rgba(191,212,223,0.5)] before:blur-md",
    polaroid:
      "rounded-[1.1rem] bg-[var(--color-paper)] p-4 pb-8 shadow-[var(--shadow-polaroid)]",
  }[variant];

  return (
    <div
      className={`relative border border-[var(--color-line)] backdrop-blur ${variantClasses} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
