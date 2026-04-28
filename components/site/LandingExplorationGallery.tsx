import Link from "next/link";
import { ActivityGrid } from "@/components/site/ActivityGrid";
import { CrumbsSection } from "@/components/site/CrumbsSection";
import { DepositSection } from "@/components/site/DepositSection";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { SeasonPreview } from "@/components/site/SeasonPreview";
import { SocialProof } from "@/components/site/SocialProof";
import { WhyCohorts } from "@/components/site/WhyCohorts";

export const explorationVersions = [
  {
    slug: "current-draft",
    number: "00",
    title: "Current first draft",
    description: "The existing warm editorial landing page, preserved as the baseline.",
    palette: "Warm paper, rust, butter",
  },
  {
    slug: "v5-polaroid",
    number: "01",
    title: "V5 Polaroid",
    description: "A cleaner Figma v5-inspired direction with white sections and photo-object warmth.",
    palette: "Cream, white, clay, sky",
  },
  {
    slug: "v5-dark",
    number: "02",
    title: "V5 Dark",
    description: "The same structure after dark: editorial, cinematic, and higher contrast.",
    palette: "Ink, cream, amber, clay",
  },
  {
    slug: "campus-map",
    number: "03",
    title: "Campus Map",
    description: "A map-like exploration where local spots become buildings on a city campus.",
    palette: "Paper, marker blue, moss, butter",
  },
  {
    slug: "cabaret-room",
    number: "04",
    title: "Cabaret Room",
    description: "A theatrical social-club version with marquee rhythm and oversized type.",
    palette: "Deep rust, cream, butter",
  },
  {
    slug: "yearbook-wall",
    number: "05",
    title: "Yearbook Wall",
    description: "A photocopied campus yearbook direction with bold contrast and cutout cards.",
    palette: "Black, white, butter, red",
  },
] as const;

type ExplorationSlug = (typeof explorationVersions)[number]["slug"];

const activities = [
  ["Pottery night", "Logan Square", "bg-[#d9b49a]"],
  ["Cooking class", "West Loop", "bg-[#f0c86e]"],
  ["Comedy show", "Old Town", "bg-[#e7c1b8]"],
  ["Mural walk", "Pilsen", "bg-[#bfd4df]"],
  ["Coffee crawl", "Wicker Park", "bg-[#dcccb8]"],
  ["Board game night", "Lakeview", "bg-[#b8c6a6]"],
];

function CurrentDraftSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SeasonPreview />
        <WhyCohorts />
        <ActivityGrid />
        <SocialProof />
        <CrumbsSection />
        <DepositSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

function PhotoCard({
  title,
  place,
  color,
  className = "",
}: {
  title: string;
  place: string;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`gallery-float-slow rounded-[1rem] border border-[color:rgba(32,28,26,0.24)] bg-white p-3 pb-5 shadow-[0_18px_42px_rgba(52,36,24,0.14)] ${className}`.trim()}
    >
      <div className={`h-36 rounded-[0.72rem] ${color}`} />
      <p className="mt-4 text-sm font-black uppercase tracking-normal text-[#201c1a]">{title}</p>
      <p className="mt-1 text-xs text-[#6f5d52]">{place}</p>
    </div>
  );
}

function SmallTag({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-4 py-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] ${
        dark ? "border-white/25 bg-[#f2cb71] text-[#181211]" : "border-[#40342e] bg-[#f2cb71] text-[#201c1a]"
      }`}
    >
      {children}
    </span>
  );
}

function V5PolaroidSite() {
  return (
    <main className="min-h-screen bg-[#f3eadf] text-[#201c1a]">
      <section className="mx-auto max-w-[1440px] px-5 py-6 md:px-10">
        <div className="rounded-[2rem] border border-[#5b4c43] bg-[#faf5ee] p-6 md:p-10">
          <nav className="mb-16 flex items-center justify-between rounded-[1.4rem] border border-[#5b4c43] bg-white px-6 py-4">
            <p className="text-xl font-black uppercase">Common Area</p>
            <Link className="rounded-full bg-[#bd623f] px-5 py-3 text-xs font-black uppercase text-white" href="/">
              Gallery
            </Link>
          </nav>
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <SmallTag>V5 Polaroid</SmallTag>
              <h1 className="mt-7 max-w-3xl font-display text-[4.4rem] font-black uppercase leading-[0.9] tracking-normal md:text-[7.4rem]">
                Turn your city into a campus.
              </h1>
              <p className="mt-8 max-w-xl text-xl leading-9 text-[#4b4038]">
                White-space, polaroids, and warm paper contrast. This is the cleanest version of the Common Area scrapbook idea.
              </p>
            </div>
            <div className="relative min-h-[620px] rounded-[2rem] border border-[#5b4c43] bg-white p-8">
              <PhotoCard title="Pottery night" place="Logan Square" color="bg-[#d9b49a]" className="-rotate-3" />
              <PhotoCard title="Coffee crawl" place="Wicker Park" color="bg-[#bfd4df]" className="absolute right-10 top-10 w-60 rotate-2" />
              <PhotoCard title="Comedy show" place="Old Town" color="bg-[#e7c1b8]" className="absolute bottom-10 left-24 w-56 rotate-1" />
              <div className="absolute bottom-16 right-12 max-w-xs rounded-[1.4rem] border border-[#5b4c43] bg-[#fff8f0] p-6">
                <p className="font-display text-4xl font-black uppercase leading-none tracking-normal">Meet the same people twice.</p>
                <p className="mt-4 text-sm leading-6 text-[#5b4c43]">A season gives the city enough repetition to feel familiar.</p>
              </div>
            </div>
          </div>
        </div>
        <WhiteSection />
        <ActivitiesPolaroidGrid />
        <FooterStrip />
      </section>
    </main>
  );
}

function V5DarkSite() {
  return (
    <main className="min-h-screen bg-[#130f0e] text-[#fff7ed]">
      <section className="mx-auto max-w-[1440px] px-5 py-6 md:px-10">
        <div className="rounded-[2rem] border border-white/18 bg-[#1d1715] p-6 md:p-10">
          <nav className="mb-16 flex items-center justify-between border-b border-white/16 pb-5">
            <p className="text-xl font-black uppercase">Common Area</p>
            <Link className="rounded-full bg-[#f2cb71] px-5 py-3 text-xs font-black uppercase text-[#201c1a]" href="/">
              Gallery
            </Link>
          </nav>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <SmallTag dark>V5 Dark</SmallTag>
              <h1 className="mt-8 max-w-4xl font-display text-[4.2rem] font-black uppercase leading-[0.88] tracking-normal text-[#fff7ed] md:text-[8rem]">
                The common room after dark.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-white/70">
                A moodier version of v5: late-night paper objects, amber contrast, and a more cinematic landing page.
              </p>
            </div>
            <div className="grid gap-5">
              {["Join the season", "Pick four plans", "Come back again"].map((item, index) => (
                <div
                  key={item}
                  className="gallery-wiggle rounded-[1.4rem] border border-white/18 bg-[#fff7ed] p-7 text-[#201c1a]"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#934a30]">Step {index + 1}</p>
                  <p className="mt-4 font-display text-5xl font-black uppercase leading-none tracking-normal">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {activities.slice(0, 3).map(([title, place, color]) => (
              <PhotoCard key={title} title={title} place={place} color={color} className="bg-[#fff7ed] text-[#201c1a]" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CampusMapSite() {
  return (
    <main className="min-h-screen bg-[#edf2e4] text-[#172018]">
      <section className="relative mx-auto max-w-[1440px] px-5 py-6 md:px-10">
        <div className="rounded-[2rem] border-2 border-[#172018] bg-[#fbf7ea] p-6 md:p-10">
          <div className="flex items-center justify-between border-b-2 border-[#172018] pb-5">
            <p className="font-mono text-lg font-black uppercase tracking-[0.18em]">Common Area Map Office</p>
            <Link className="rounded-full border-2 border-[#172018] px-5 py-3 text-xs font-black uppercase" href="/">
              Gallery
            </Link>
          </div>
          <h1 className="mt-14 max-w-6xl font-mono text-[3.7rem] font-black uppercase leading-[0.92] tracking-normal md:text-[7rem]">
            The city is the campus map.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8">
            A route-based concept: every local business becomes a building, every cohort becomes a path, every return visit makes the map easier to read.
          </p>
          <div className="relative mt-14 min-h-[720px] rounded-[2rem] border-2 border-[#172018] bg-white p-8">
            <div className="gallery-draw-line absolute left-8 top-[48%] h-1 w-[92%] bg-[#2e6f7d]" aria-hidden="true" />
            {activities.map(([title, place, color], index) => (
              <div
                key={title}
                className={`absolute rounded-[1rem] border-2 border-[#172018] bg-[#fbf7ea] p-5 shadow-[6px_6px_0_rgba(23,32,24,0.12)] ${
                  [
                    "left-12 top-16",
                    "right-20 top-20",
                    "left-[38%] top-64",
                    "left-20 bottom-28",
                    "right-16 bottom-32",
                    "left-[44%] bottom-12",
                  ][index]
                }`}
              >
                <div className={`mb-4 h-4 w-28 rounded-full ${color}`} />
                <p className="font-mono text-sm font-black uppercase tracking-normal">{title}</p>
                <p className="mt-1 text-xs">{place}</p>
              </div>
            ))}
            <div className="absolute left-[42%] top-[43%] rounded-full border-2 border-[#172018] bg-[#f2cb71] px-7 py-5 font-mono text-sm font-black uppercase">
              Cohort Hub
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CabaretRoomSite() {
  return (
    <main className="min-h-screen bg-[#5f241d] text-[#fff8f0]">
      <section className="mx-auto max-w-[1440px] px-5 py-6 md:px-10">
        <div className="rounded-[2rem] border border-[#f2cb71]/60 bg-[#8b3f2b] p-6 md:p-10">
          <nav className="mb-12 flex items-center justify-between">
            <p className="text-2xl font-black uppercase">Common Area</p>
            <Link className="rounded-full bg-[#f2cb71] px-5 py-3 text-xs font-black uppercase text-[#201c1a]" href="/">
              Gallery
            </Link>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="w-fit border border-[#f2cb71]/70 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.24em]">
                Cabaret room
              </p>
              <h1 className="mt-8 font-display text-[4rem] font-black uppercase leading-[0.86] tracking-normal md:text-[8.4rem]">
                A city social club with curtains open.
              </h1>
            </div>
            <div className="grid gap-4">
              {["No swiping", "No dinner roulette", "No empty room"].map((line) => (
                <div key={line} className="gallery-wiggle border border-[#f2cb71]/70 bg-[#fff8f0] p-6 text-[#201c1a]">
                  <p className="font-display text-5xl font-black uppercase leading-none tracking-normal">{line}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 overflow-hidden border-y border-[#f2cb71]/70 py-4">
            <div className="gallery-marquee flex min-w-max gap-10 font-display text-5xl font-black uppercase leading-none tracking-normal">
              <span>Turn your city into a campus.</span>
              <span>Not another meetup.</span>
              <span>A common area.</span>
              <span>Turn your city into a campus.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function YearbookWallSite() {
  return (
    <main className="min-h-screen bg-white text-[#111]">
      <section className="mx-auto max-w-[1440px] px-5 py-6 md:px-10">
        <div className="border-4 border-[#111] p-6 md:p-10">
          <nav className="flex items-center justify-between border-b-4 border-[#111] pb-5">
            <p className="font-mono text-xl font-black uppercase tracking-[0.14em]">Common Area Yearbook</p>
            <Link className="border-2 border-[#111] px-5 py-3 text-xs font-black uppercase shadow-[5px_5px_0_#111]" href="/">
              Gallery
            </Link>
          </nav>
          <h1 className="mt-12 max-w-6xl font-serif text-[4rem] font-black uppercase leading-[0.88] tracking-normal md:text-[8.6rem]">
            Your neighborhood, with classmates again.
          </h1>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {activities.map(([title, place], index) => (
              <div
                key={title}
                className={`gallery-float-slow min-h-56 border-4 border-[#111] bg-[#fdfbf6] p-6 shadow-[10px_10px_0_rgba(17,17,17,0.15)] ${
                  index % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#bd623f]">File {index + 1}</p>
                <p className="mt-5 font-serif text-4xl font-black uppercase leading-none tracking-normal">{title}</p>
                <p className="mt-5 text-base">{place}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {["Meet the same people more than once.", "Local spots become campus buildings.", "A social life with a home base."].map((line) => (
              <p key={line} className="border-4 border-[#111] bg-[#f2cb71] p-6 font-serif text-4xl font-black uppercase leading-none tracking-normal shadow-[8px_8px_0_#111]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function WhiteSection() {
  return (
    <section className="mt-8 rounded-[2rem] border border-[#5b4c43] bg-white p-8 md:p-10">
      <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#934a30]">How it works</p>
      <h2 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-none tracking-normal md:text-7xl">
        Pick four activities. Meet the same people twice.
      </h2>
    </section>
  );
}

function ActivitiesPolaroidGrid() {
  return (
    <section className="mt-8 rounded-[2rem] border border-[#5b4c43] bg-white p-8 md:p-10">
      <div className="grid gap-6 md:grid-cols-3">
        {activities.map(([title, place, color]) => (
          <PhotoCard key={title} title={title} place={place} color={color} />
        ))}
      </div>
    </section>
  );
}

function FooterStrip() {
  return (
    <footer className="mt-8 flex flex-col justify-between gap-4 border-t border-[#5b4c43] py-8 text-sm text-[#5b4c43] md:flex-row">
      <span>Common Area</span>
      <span>Turn your city into a campus.</span>
      <span>Crumbs saved you a spot.</span>
    </footer>
  );
}

export function ExplorationSite({ slug }: { slug: ExplorationSlug }) {
  if (slug === "current-draft") return <CurrentDraftSite />;
  if (slug === "v5-polaroid") return <V5PolaroidSite />;
  if (slug === "v5-dark") return <V5DarkSite />;
  if (slug === "campus-map") return <CampusMapSite />;
  if (slug === "cabaret-room") return <CabaretRoomSite />;
  return <YearbookWallSite />;
}

export function LandingExplorationGallery() {
  return (
    <main className="min-h-screen bg-[#f6efe6] px-4 py-6 text-[#201c1a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <header className="rounded-[2rem] border border-[color:rgba(32,28,26,0.18)] bg-[#fff8f0] p-6 shadow-[0_18px_40px_rgba(52,36,24,0.1)] md:p-10">
          <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-[#bd623f]">Common Area design lab</p>
          <h1 className="mt-5 max-w-5xl font-display text-[4rem] font-black uppercase leading-[0.9] tracking-normal md:text-[7.4rem]">
            Landing page exploration gallery.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#4b4038]">
            Open each direction as a standalone mini-site. Port 3000 stays the real landing page; port 3001 is the exploration lab.
          </p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {explorationVersions.map((version, index) => (
            <Link
              key={version.slug}
              href={`/explorations/${version.slug}`}
              target="_blank"
              rel="noreferrer"
              className="group min-h-[360px] rounded-[2rem] border border-[color:rgba(32,28,26,0.2)] bg-white p-6 shadow-[0_18px_42px_rgba(52,36,24,0.1)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(52,36,24,0.16)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#bd623f]">{version.number}</span>
                <span className="rounded-full border border-[#5b4c43] px-3 py-1 text-[0.65rem] font-black uppercase">Open</span>
              </div>
              <div className="mt-8 h-32 overflow-hidden rounded-[1.2rem] border border-[color:rgba(32,28,26,0.18)] bg-[#f6efe6] p-4">
                <div className={`h-full rounded-xl ${activities[index % activities.length][2]} transition group-hover:scale-105`} />
              </div>
              <h2 className="mt-8 font-display text-5xl font-black uppercase leading-none tracking-normal">{version.title}</h2>
              <p className="mt-5 text-base leading-7 text-[#5b4c43]">{version.description}</p>
              <p className="mt-6 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#934a30]">{version.palette}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
