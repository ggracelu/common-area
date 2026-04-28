import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      <Badge variant="neutral">{eyebrow}</Badge>
      <h2 className="display-heading mt-5 text-4xl font-semibold sm:text-5xl lg:text-6xl">{title}</h2>
      {description ? (
        <p className="editorial-subhead mt-5">
          {description}
        </p>
      ) : null}
    </div>
  );
}
