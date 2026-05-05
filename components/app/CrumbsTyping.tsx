"use client";

import { CrumbsWorking } from "@/components/brand/CrumbsWorking";

/** Dashboard / mailroom: detailed working Crumbs (glasses, laptop, typing). */
export function CrumbsTyping({ size = 80 }: { size?: number }) {
  return <CrumbsWorking size={size} />;
}
