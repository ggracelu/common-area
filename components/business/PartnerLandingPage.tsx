import Link from "next/link";
import { CommonAreaLogoLink } from "@/components/brand/CommonAreaLogo";
import { PartnerBusinessGallery } from "@/components/business/PartnerBusinessGallery";
import { V16Theme } from "@/components/site/V16Theme";
import type { PartnerBusiness } from "@/lib/business-partners";

type PartnerLandingPageProps = {
  businesses: PartnerBusiness[];
};

export function PartnerLandingPage({ businesses }: PartnerLandingPageProps) {
  return (
    <V16Theme className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <CommonAreaLogoLink href="/" className="gap-3">
            <span className="v16-topline">Common Area</span>
          </CommonAreaLogoLink>
          <div className="flex items-center gap-3">
            <Link href="/partner/sign-in" className="v16-btn v16-btn-outline text-xs">
              Sign in
            </Link>
            <Link href="/partner/sign-up" className="v16-btn v16-btn-solid text-xs">
              Become a partner
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <section className="max-w-3xl">
            <p className="v16-kicker">Chicago host partners</p>
            <h1 className="v16-h1 mt-4">Welcome, small business owners.</h1>
            <p className="v16-lede mt-6">
              Common Area brings recurring cohorts to your door—neighbors who return on a rhythm, not one-off promo
              blasts. Host standing nights that feel like a campus common room in your neighborhood.
            </p>
            <p className="v16-small mt-4">
              Partner preview: this surface shows how hosts join the network. Cohort schedules and live assignments
              arrive after the member season loop proves retention.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/partner/sign-up" className="v16-btn v16-btn-solid">
                Create a business account
              </Link>
              <Link href="/partner/sign-in" className="v16-btn v16-btn-outline">
                Sign in to your business account
              </Link>
            </div>
          </section>

          <PartnerBusinessGallery businesses={businesses} />

          <section className="mt-20 grid gap-5 md:grid-cols-3">
            {[
              [
                "Regulars, not strangers",
                "Cohorts of 15–20 members overlap on shared activities, so your room fills with familiar faces.",
              ],
              [
                "Neighbors, not leads",
                "Members choose local experiences on purpose. You meet people who live nearby and want to return.",
              ],
              [
                "Rhythm, not one-offs",
                "Weekly or biweekly standing slots help your team plan staffing and treat the room like a campus hour.",
              ],
            ].map(([title, body]) => (
              <article key={title} className="v16-step">
                <p className="v16-step-t">{title}</p>
                <p className="v16-step-b">{body}</p>
              </article>
            ))}
          </section>

          <section className="mt-20 rounded-[2rem] border border-black/10 bg-white px-6 py-10 md:px-10">
            <p className="v16-kicker">What hosts get</p>
            <h2 className="v16-h2 mt-3">A predictable neighbor pipeline.</h2>
            <p className="v16-small mt-4 max-w-2xl">
              Common Area curates seasonal cohorts for Chicago Gen Z adults who want a campus feeling after college.
              Hosts publish cohort-friendly rituals—workshops, tastings, walks, studio nights—and Common Area routes
              returning groups to your tables.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/partner/sign-up" className="v16-btn v16-btn-solid v16-btn-dark">
                Start partner onboarding
              </Link>
              <Link href="/" className="v16-btn v16-btn-outline v16-btn-dark-outline">
                See the member experience
              </Link>
            </div>
          </section>
        </div>
      </main>
    </V16Theme>
  );
}
