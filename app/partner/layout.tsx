import type { ReactNode } from "react";
import { PartnerAuthFreshSession } from "@/components/business/PartnerAuthFreshSession";

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return <PartnerAuthFreshSession>{children}</PartnerAuthFreshSession>;
}
