import type { PartnerBusiness } from "@/lib/business-partners";

type PartnerDirectoryProps = {
  businesses: PartnerBusiness[];
  highlightName?: string;
};

export function PartnerDirectory({ businesses, highlightName }: PartnerDirectoryProps) {
  const normalizedHighlight = highlightName?.trim().toLowerCase();

  return (
    <section aria-labelledby="partner-directory-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="v16-kicker">Partner network</p>
          <h2 id="partner-directory-heading" className="v16-h2 mt-2">
            Explore other businesses in Common Area
          </h2>
        </div>
        <p className="v16-micro max-w-md">Preview directory — sample Chicago hosts aligned with the member season.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {businesses.map((business) => {
          const isSelf = normalizedHighlight && business.name.trim().toLowerCase() === normalizedHighlight;

          return (
            <article
              key={business.id}
              className={`v16-mini ${isSelf ? "ring-2 ring-black/15" : ""}`}
              style={{ ["--v16-accent" as never]: business.accent }}
            >
              <div className="v16-mini-top">
                <p className="v16-mini-k">
                  {business.neighborhood} · {business.category}
                </p>
                <p className="v16-mini-t">{business.name}</p>
                {isSelf ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Your listing</p>
                ) : null}
              </div>
              <div className="space-y-3 px-5 pb-5">
                <p className="v16-small">{business.hostSummary}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="v16-pill">{business.cadence}</span>
                  <span className="v16-pill">{business.groupSize}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
