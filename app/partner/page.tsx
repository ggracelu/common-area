import { PartnerLandingPage } from "@/components/business/PartnerLandingPage";
import { getPartnerBusinesses } from "@/lib/partner-businesses";

export const dynamic = "force-dynamic";

export default async function PartnerPage() {
  const businesses = await getPartnerBusinesses();
  return <PartnerLandingPage businesses={businesses} />;
}
