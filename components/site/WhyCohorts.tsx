import { cohortHighlights } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function WhyCohorts() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why cohorts beat swiping"
          title="You do not need another app built around random strangers and one perfect first impression."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cohortHighlights.map((highlight, index) => (
            <Card
              key={highlight.title}
              variant={index === 1 ? "scrapbook" : "default"}
              className="lift-hover"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
                {highlight.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                {highlight.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
