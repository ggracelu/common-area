import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type PolaroidProps = {
  title: string;
  caption?: string;
  children: ReactNode;
  tilt?: "left" | "right" | "none";
  className?: string;
};

export function Polaroid({
  title,
  caption,
  children,
  tilt = "none",
  className = "",
}: PolaroidProps) {
  const tiltClass =
    tilt === "left" ? "scrap-tilt-left" : tilt === "right" ? "scrap-tilt-right" : "";

  return (
    <Card variant="polaroid" className={`polaroid lift-hover ${tiltClass} ${className}`.trim()}>
      <div className="overflow-hidden rounded-[0.95rem] border border-[var(--color-line)] bg-[var(--color-panel)]">
        {children}
      </div>
      <div className="pt-4">
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {title}
        </p>
        {caption ? (
          <p className="mt-2 text-sm leading-6 text-[color:rgba(32,28,26,0.72)]">{caption}</p>
        ) : null}
      </div>
    </Card>
  );
}
