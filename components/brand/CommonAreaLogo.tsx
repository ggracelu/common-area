import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Bumped when the Canva export changes (cache bust). */
const LOGO_VERSION = "4";

export const COMMON_AREA_LOGO_PATH = `/brand/common-area-logo.png?v=${LOGO_VERSION}`;

/** Off-white keyed out in post — matches V16 paper (~#F6F2E5). */
export const LOGO_PAPER_RGB = "246 242 229";

/** Source artboard (Canva export). */
export const LOGO_INTRINSIC_WIDTH = 754;
export const LOGO_INTRINSIC_HEIGHT = 706;

type CommonAreaLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Use on dark backgrounds (inverts ink mark to paper). */
  tone?: "ink" | "paper";
};

/** Single-color Common Area mark (transparent PNG from Canva). */
export function CommonAreaLogo({
  size = 40,
  className = "",
  priority = false,
  tone = "ink",
}: CommonAreaLogoProps) {
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
        alt="Common Area"
        width={LOGO_INTRINSIC_WIDTH}
        height={LOGO_INTRINSIC_HEIGHT}
        className="h-full w-full object-contain"
        priority={priority}
        unoptimized
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
