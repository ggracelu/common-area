import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function SocialProof() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Badge>Why this feels different</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for people who want familiar places, familiar faces, and a social life with a home base.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Card className="bg-[color:rgba(255,255,255,0.84)]">
            <p className="text-4xl font-semibold tracking-tight">15-20</p>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              The target cohort size is large enough to feel social and small enough to feel familiar.
            </p>
          </Card>
          <Card className="bg-[color:rgba(255,245,231,0.92)]">
            <p className="text-4xl font-semibold tracking-tight">4 of 6</p>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              Curated choice without decision overload, built around neighborhoods and local spots people actually want to return to.
            </p>
          </Card>
          <Card className="bg-[color:rgba(237,244,248,0.92)]">
            <p className="text-4xl font-semibold tracking-tight">2x</p>
            <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
              The system is designed so repeated interaction does the social work that one-off matching never could.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
