import { faqs } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="FAQ" title="A few things people will ask first." />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <Card key={item.question} variant={index % 2 === 0 ? "paper" : "default"} className="lift-hover">
              <h3 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                {item.question}
              </h3>
              <p className="mt-4 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
