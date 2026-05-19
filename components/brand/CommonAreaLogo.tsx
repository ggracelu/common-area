import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const COMMON_AREA_LOGO_PATH = "/brand/common-area-logo.png";

/** Width ÷ height of the Canva export (1024×942). */
const LOGO_ASPECT = 942 / 1024;

type CommonAreaLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Use on dark backgrounds (inverts ink mark to paper). */
  tone?: "ink" | "paper";
};

/** Single-color Common Area mark (transparent PNG). */
export function CommonAreaLogo({
  size = 40,
  className = "",
  priority = false,
  tone = "ink",
}: CommonAreaLogoProps) {
  const height = Math.round(size * LOGO_ASPECT);

  return (
    <span
      className={[
        "common-area-logo inline-flex shrink-0 items-center justify-center",
        tone === "paper" ? "brightness-0 invert" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
      data-testid="common-area-logo"
    >
      <Image
        src={COMMON_AREA_LOGO_PATH}
        alt=""
        width={size}
        height={height}
        className="h-full w-full object-contain"
        priority={priority}
        aria-hidden
      />
    </span>
  );
}

type CommonAreaLogoLinkProps = {
  href?: string;
  size?: number;
  className?: string;
  priority?: boolean;
  children?: ReactNode;
};

/** Logo + optional wordmark block (pass children for title / subtitle). */
export function CommonAreaLogoLink({
  href = "/",
  size = 40,
  className = "",
  priority = false,
  children,
}: CommonAreaLogoLinkProps) {
  return (
    <Link
      href={href}
      className={["flex items-center gap-4 text-[var(--color-foreground)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <CommonAreaLogo size={size} priority={priority} />
      {children}
    </Link>
  );
}
