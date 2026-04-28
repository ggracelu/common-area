import { exampleActivities } from "@/lib/site-content";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ActivityGrid() {
  return (
    <section id="activities" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Example activities"
          title="Mock season picks for a Chicago cohort."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {exampleActivities.map((activity, index) =>
            index < 2 ? (
              <Polaroid
                key={activity.title}
                title={activity.neighborhood}
                caption={activity.vibe}
                tilt={index % 2 === 0 ? "left" : "right"}
              >
                <div className="flex min-h-[13rem] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(242,231,216,0.92))] p-5">
                  <p className="section-eyebrow">{activity.neighborhood}</p>
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
                    {activity.title}
                  </h3>
                  <div aria-hidden="true" className="mt-4 flex items-end justify-between text-4xl">
                    <span>☕</span>
                    <span>🎟️</span>
                  </div>
                </div>
              </Polaroid>
            ) : (
              <Card key={activity.title} variant="paper" className="flex h-full flex-col justify-between lift-hover">
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
            ),
          )}
        </div>
      </div>
    </section>
  );
}
