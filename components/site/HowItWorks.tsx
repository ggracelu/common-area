import { steps } from "@/lib/site-content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge>How it works</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pick 4 activities. Meet the same people twice. Let the city do the rest.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="bg-white/78">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
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
