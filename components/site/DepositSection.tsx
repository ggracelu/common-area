import { depositHighlights } from "@/lib/site-content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function DepositSection() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge>Deposit explanation</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            A small deposit, so the social plan can be real.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[color:rgba(37,34,30,0.74)]">
            WhyNot uses a $20 seasonal deposit as a commitment signal. This is not a marketplace
            checkout and not a subscription product. It is a lightweight social nudge that helps
            cohorts form around people who actually intend to participate.
          </p>
        </div>
        <div className="grid gap-5">
          {depositHighlights.map((highlight) => (
            <Card key={highlight.title} className="bg-[color:rgba(255,255,255,0.8)]">
              <h3 className="text-2xl font-semibold tracking-tight">{highlight.title}</h3>
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
