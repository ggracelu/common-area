"use client";

import { PartnerBusinessGallery as PartnerMarqueeGallery } from "@/components/business/PartnerBusinessGallery";
import { demoData } from "@/lib/demo-data";
import type { PartnerBusiness } from "@/lib/business-partners";

const accentTokens = ["var(--v16-gold)", "var(--v16-magenta)", "var(--v16-blue)", "var(--v16-lime)"] as const;

function demoBusinessesAsPartners(): PartnerBusiness[] {
  return demoData.businesses.map((business, index) => ({
    id: business.id,
    name: business.name,
    neighborhood: business.neighborhood,
    category: business.vibeTags[0] ?? "Host",
    hostSummary: business.description,
    cadence: "Season host",
    groupSize: "Cohort tables",
    accent: accentTokens[index % accentTokens.length]!,
    imageUrl: business.imageUrl,
  }));
}

export function PartnerBusinessGallery() {
  return (
    <div className="mt-6" data-testid="bingo-partner-gallery">
      <PartnerMarqueeGallery businesses={demoBusinessesAsPartners()} embedded />
    </div>
  );
}
