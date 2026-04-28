import { faqs } from "@/lib/site-content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function FAQ() {
  return (
    <section id="faq" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge>FAQ</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            A few things people will ask first.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {faqs.map((item) => (
            <Card key={item.question} className="bg-white/78">
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
