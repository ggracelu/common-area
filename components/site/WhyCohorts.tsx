import { cohortHighlights } from "@/lib/site-content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function WhyCohorts() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge>Why cohorts beat swiping</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            You do not need another app built around random strangers and one perfect first impression.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cohortHighlights.map((highlight, index) => (
            <Card key={highlight.title} className={index === 1 ? "bg-[color:rgba(255,245,231,0.92)]" : ""}>
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
