/** Shown on partner dashboard tabs that use illustrative preview data only. */
export function PartnerSampleDataNotice() {
  return (
    <p
      className="rounded-[1rem] border border-black/10 bg-white/80 px-4 py-3 text-sm text-black/70"
      data-testid="partner-sample-data-notice"
    >
      <span className="font-semibold text-black">Sample preview data.</span> Calendar, analytics, and community views
      are illustrative until live cohort assignment and payouts ship with the member season loop.
    </p>
  );
}
