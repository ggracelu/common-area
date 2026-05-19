import type { Metadata } from "next";
import { Crumbs } from "@/components/brand/Crumbs";
import { CrumbsWorking } from "@/components/brand/CrumbsWorking";
import { V16Theme } from "@/components/site/V16Theme";

export const metadata: Metadata = {
  title: "Crumbs lab · Common Area",
  description: "Internal sprite preview for mascot feedback.",
  robots: { index: false, follow: false },
};

export default function CrumbsLabPage() {
  return (
    <V16Theme className="min-h-screen">
      <main className="mx-auto max-w-2xl px-6 py-14 pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Unlisted · not in navigation
        </p>
        <h1 className="v16-h2 mt-3">Crumbs design lab</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
          Three reference poses for feedback: full-body sit, sleeping curl, and working
          at a laptop. Use this page to note what to change next (proportions, glasses,
          paws, tail, etc.).
        </p>

        <ol className="mt-12 space-y-16">
          <li className="paper-surface rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
              1 · Default · sitting
            </p>
            <p className="mt-2 text-sm text-black/65">
              Full-body gray tabby: ears, face, chest, belly, haunches, paws, tail.
            </p>
            <div
              className="mt-8 flex justify-center"
              style={{ minHeight: "11rem" }}
            >
              <div className="origin-top scale-[2.75]">
                <Crumbs size="lg" pose="sit" animated />
              </div>
            </div>
          </li>

          <li className="paper-surface rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
              2 · Napping · curled ball
            </p>
            <p className="mt-2 text-sm text-black/65">
              Sleeping loaf: oversized Crumbs head (scaled ~1.3× wider and taller than the sitting pose) with triangular ears, DDDD forehead crease, D-shaded cheeks, closed eyes, and the three-row white muzzle ending in a K nose dot. The body is now shorter with three diagonal back stripes; underneath, a thick K-outlined tail tucks under the body and curls to a tip below the front paws.
            </p>
            <div
              className="mt-8 flex justify-center"
              style={{ minHeight: "10rem" }}
            >
              <div className="origin-top scale-[2.75]">
                <Crumbs size="lg" pose="curl" animated />
              </div>
            </div>
          </li>

          <li className="paper-surface rounded-[1.75rem] p-8 shadow-[var(--shadow-card)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
              3 · Working · glasses + laptop
            </p>
            <p className="mt-2 text-sm text-black/65">
              Round lenses, blue screen (S), keyboard with typing highlight.
            </p>
            <div className="mt-8 flex justify-center">
              <CrumbsWorking size={280} />
            </div>
          </li>
        </ol>
      </main>
    </V16Theme>
  );
}
