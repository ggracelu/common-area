import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type StickerProps = {
  children: ReactNode;
  className?: string;
};

export function Sticker({ children, className = "" }: StickerProps) {
  return (
    <Badge variant="sticker" className={`rotate-[-2deg] ${className}`.trim()}>
      {children}
    </Badge>
  );
}
