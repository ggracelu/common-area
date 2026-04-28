import { depositHighlights } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sticker } from "@/components/ui/Sticker";

export function DepositSection() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeader
            eyebrow="Deposit explanation"
            title="A small deposit, so the common room stays full."
            description="Common Area uses a $20 seasonal deposit as a commitment signal. This is not a marketplace checkout and not a subscription product. It is a lightweight social nudge that helps cohorts form around people who actually intend to come back."
          />
          <Sticker className="mt-6">
            A small deposit keeps the room from being empty.
          </Sticker>
        </div>
        <div className="grid gap-5">
          {depositHighlights.map((highlight, index) => (
            <Card key={highlight.title} variant={index === 0 ? "scrapbook" : "paper"} className="lift-hover">
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
