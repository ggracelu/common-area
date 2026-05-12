"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

/**
 * Renders the Crumbs lab shortcut at the document root so it stays above
 * Clerk overlays and app headers (stacking contexts).
 */
export function CrumbsLabPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-only: enables createPortal target.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount gate for SSR
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <Link
      href="/crumbs-lab"
      className="pointer-events-auto fixed top-3 right-3 z-[2147483647] max-w-[calc(100vw-1.5rem)] truncate rounded-full border border-black/20 bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:bg-[#fffef8]"
      style={{ zIndex: 2147483647 }}
    >
      Crumbs lab
    </Link>,
    document.body,
  );
}
