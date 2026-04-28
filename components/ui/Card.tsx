import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-black/8 bg-white/85 p-6 shadow-[0_18px_60px_rgba(37,34,30,0.08)] backdrop-blur ${className}`.trim()}
    >
      {children}
    </div>
  );
}
