import { steps } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How it works"
          title="Pick 4 activities. Meet the same people twice. Let the city do the rest."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              variant={index === 1 ? "scrapbook" : "paper"}
              className="lift-hover"
            >
              <p className="section-eyebrow">
                {step.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
