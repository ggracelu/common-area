import type { Metadata } from "next";
import { CommonAreaLogoLabGrid } from "@/components/brand/CommonAreaLogoMarks";
import { Crumbs } from "@/components/brand/Crumbs";
import { CrumbsWorking } from "@/components/brand/CrumbsWorking";
import { V16Theme } from "@/components/site/V16Theme";

export const metadata: Metadata = {
  title: "Crumbs lab · Common Area",
  description: "Internal design lab for mascot poses and CA logo ideation.",
  robots: { index: false, follow: false },
};

export default function CrumbsLabPage() {
  return (
    <V16Theme className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-14 pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
          Unlisted · not in navigation
        </p>
        <h1 className="v16-h2 mt-3">Crumbs design lab</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-black/70">
          Workplace for ideation: mascot pose references below, plus five minimal{" "}
          <strong className="font-semibold text-black/85">CA</strong> logo directions that
          lean into familiarity, shared space, and community—not nightlife neon.
        </p>

        <section className="mt-14" aria-labelledby="ca-logo-lab-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Logo ideation
          </p>
          <h2 id="ca-logo-lab-heading" className="v16-h2 mt-3">
            CA marks
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/70">
            Round 2 refines <strong className="font-semibold">C embraces A</strong> and{" "}
            <strong className="font-semibold">C meets A</strong> with real letterforms and single-ink
            marks, plus a <strong className="font-semibold">C + curled a</strong> experiment. Compare
            at three sizes; round 1 is archived below.
          </p>
          <CommonAreaLogoLabGrid />
        </section>

        <section className="mt-20" aria-labelledby="crumbs-poses-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
            Mascot poses
          </p>
          <h2 id="crumbs-poses-heading" className="v16-h2 mt-3">
            Crumbs reference
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/70">
            Three poses for feedback: full-body sit, sleeping curl, and working at a laptop.
            Note proportions, glasses, paws, tail, etc.
          </p>
        </section>

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
              Sleeping loaf: head scaled up to ~1.3× wider and ~1.6× taller than the sit pose, with a full K outline and neck column separating head from body. Crown row, six-wide DDDDDD forehead crease, side D cheek shadows, closed two-pixel eyes, and a four-row white muzzle ending in a K nose dot. Three pixelated blue z letters (small → medium → large on a diagonal) appear one at a time in a looping loading sequence above the back.
            </p>
            <div
              className="mt-8 flex justify-center"
              style={{ minHeight: "10rem" }}
            >
              <div className="origin-top scale-[2.75]">
                <Crumbs size="lg" pose="nap" animated />
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
