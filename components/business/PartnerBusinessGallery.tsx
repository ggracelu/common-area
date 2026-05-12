"use client";

import { useEffect, useState } from "react";
import type { PartnerBusiness } from "@/lib/business-partners";

type PartnerBusinessGalleryProps = {
  businesses: PartnerBusiness[];
};

function GalleryTrack({
  businesses,
  direction,
  reducedMotion,
}: {
  businesses: PartnerBusiness[];
  direction: "left" | "right";
  reducedMotion: boolean;
}) {
  const loop = [...businesses, ...businesses];

  return (
    <div className="partner-gallery-track-wrap overflow-hidden">
      <div
        className={`partner-gallery-track partner-gallery-track-${direction}${reducedMotion ? " partner-gallery-track-static" : ""}`}
        aria-hidden={reducedMotion}
      >
        {loop.map((business, index) => (
          <figure
            key={`${business.id}-${index}`}
            className="partner-gallery-card"
            style={{ ["--v16-accent" as never]: business.accent }}
          >
            {business.imageUrl ? (
              <img
                className="partner-gallery-image"
                src={business.imageUrl}
                alt={`${business.name} in ${business.neighborhood}.`}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="partner-gallery-image partner-gallery-image-fallback" />
            )}
            <figcaption className="partner-gallery-caption">
              <p className="partner-gallery-kicker">
                {business.neighborhood} · {business.category}
              </p>
              <p className="partner-gallery-title">{business.name}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function PartnerBusinessGallery({ businesses }: PartnerBusinessGalleryProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  if (!businesses.length) {
    return null;
  }

  const topRow = businesses.filter((_, index) => index % 2 === 0);
  const bottomRow = businesses.filter((_, index) => index % 2 === 1);

  return (
    <section className="partner-gallery-section" aria-labelledby="partner-gallery-heading">
      <div className="partner-gallery-intro">
        <p className="v16-kicker">Chicago host network</p>
        <h2 id="partner-gallery-heading" className="v16-h2 mt-3">
          Building community, 1 brick at a time
        </h2>
        <p className="v16-small mt-3 max-w-2xl">
          Simulated neighborhood hosts across restaurants, bars, cafes, studios, and gyms. Photos via Unsplash.
        </p>
      </div>

      <div className="partner-gallery-rows mt-10 space-y-5">
        <GalleryTrack businesses={topRow.length ? topRow : businesses} direction="left" reducedMotion={reducedMotion} />
        <GalleryTrack
          businesses={bottomRow.length ? bottomRow : businesses}
          direction="right"
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}