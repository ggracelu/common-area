import { exampleActivities } from "@/lib/site-content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ActivityGrid() {
  return (
    <section id="activities" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge>Example activities</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Mock season picks for a Chicago cohort.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {exampleActivities.map((activity) => (
            <Card key={activity.title} className="flex h-full flex-col justify-between bg-white/80">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  {activity.neighborhood}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  {activity.title}
                </h3>
              </div>
              <p className="mt-5 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                {activity.vibe}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
