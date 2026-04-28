import Link from "next/link";
import type { CSSProperties } from "react";
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
import { MrmBrasilInspiredSite } from "@/components/site/explorations/MrmBrasilInspired";
import { V12ScrapbookStudioSite } from "@/components/site/explorations/V12ScrapbookStudio";
import { V13KitschComputerClubSite } from "@/components/site/explorations/V13KitschComputerClub";
import { V14AdckerIndexSite } from "@/components/site/explorations/V14AdckerIndex";
import { V15CampusArcadeSite } from "@/components/site/explorations/V15CampusArcade";
import { V16CampusCrumbsSite } from "@/components/site/explorations/V16CampusCrumbs";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

export const explorationVersions = [
  {
    slug: "current-draft",
    number: "00",
    title: "Current first draft",
    description: "The existing warm editorial landing page, preserved as the baseline.",
    palette: "Warm paper, rust, butter",
    typography: 'Display serif + clean sans. Calm editorial hierarchy.',
    motion: "Lift hover + soft reveal + light artifact motion.",
  },
  {
    slug: "v5-polaroid",
    number: "01",
    title: "V5 Polaroid",
    description: "A cleaner Figma v5-inspired direction with white sections and photo-object warmth.",
    palette: "Cream, white, clay, sky",
    typography: "Poster-style all-caps display + mono tags.",
    motion: "Floating cards + gentle wiggle + clean composition shifts.",
  },
  {
    slug: "v5-dark",
    number: "02",
    title: "V5 Dark",
    description: "The same structure after dark: editorial, cinematic, and higher contrast.",
    palette: "Ink, cream, amber, clay",
    typography: "All-caps display + mono steps. High-contrast rhythm.",
    motion: "Wiggle steps + float artifacts + marquee strip.",
  },
  {
    slug: "campus-map",
    number: "03",
    title: "Campus Map",
    description: "A map-like exploration where local spots become buildings on a city campus.",
    palette: "Paper, marker blue, moss, butter",
    typography: "Mono-heavy “map office” voice with stamped labels.",
    motion: "Route line draw + anchored pop-in pins.",
  },
  {
    slug: "cabaret-room",
    number: "04",
    title: "Cabaret Room",
    description: "A theatrical social-club version with marquee rhythm and oversized type.",
    palette: "Deep rust, cream, butter",
    typography: "Dramatic display + loud poster blocks.",
    motion: "Marquee scroll + theatrical hover + spotlight glow.",
  },
  {
    slug: "yearbook-wall",
    number: "05",
    title: "Yearbook Wall",
    description: "A photocopied campus yearbook direction with bold contrast and cutout cards.",
    palette: "Black, white, butter, red",
    typography: "Hard-contrast serif headlines + mono file labels.",
    motion: "Float + staggered card lift + punchy shadows.",
  },
  {
    slug: "common-room-radio",
    number: "06",
    title: "Common Room Radio",
    description: "Analog campus radio energy: cassette labels, show posters, warm late-night lounge grit.",
    palette: "Ink, butter, rust, warm paper",
    typography: 'Chunky sans headlines + mono “station metadata” + warm readable body.',
    motion: "ON AIR pulse + radio ticker + floating album sleeves + hoverable flyer stack.",
  },
  {
    slug: "crumbs-cafe",
    number: "07",
    title: "Crumbs Café",
    description: "A sleepy neighborhood café built around Crumbs: menu boards, soft paper layers, gentle humor.",
    palette: "Cream, espresso, moss, butter",
    typography: "Warm serif display + rounded sans body + handwritten-feeling labels (system-safe).",
    motion: "Drifting steam shapes + lazy floating note + polaroid tilt + soft reveals.",
  },
  {
    slug: "campus-after-dark",
    number: "08",
    title: "Campus After Dark",
    description: "Cabaret/poster wall meets comedy-night warmth. Dramatic, social, but not clubby.",
    palette: "Near-black, ember, marquee gold, cream",
    typography: "High-contrast serif headlines + condensed label vibe + crisp body.",
    motion: "Spotlight gradient + marquee lights shimmer + fan-out image cards on hover.",
  },
  {
    slug: "field-guide",
    number: "09",
    title: "Field Guide",
    description: "A neighborhood guidebook: marginal notes, stamps, map pins, and a city-as-campus index.",
    palette: "Paper, moss, sky ink, stamp red",
    typography: "Bookish serif headings + utilitarian sans body + mono coordinates/notes.",
    motion: "Route line draw + pin bob + “discovered” card reveals.",
  },
  {
    slug: "house-party-bulletin",
    number: "10",
    title: "House Party Bulletin",
    description: "Maximal anti-design bulletin board: tape, flyers, stickers, yearbook pulls — still readable.",
    palette: "Paper, neon-ish accents, ink, tape beige",
    typography: "Loud all-caps sans display + serif pull-quotes + casual body.",
    motion: "Sticker wiggle + flyer overlap lift + loud marquee announcements + collage hover transforms.",
  },
  {
    slug: "mrm-bw-overlap",
    number: "11",
    title: "MRM BW Overlap",
    description:
      "A black/white base with loud accent pops and dense overlapping motion. Closely inspired by MRM Brasil’s homepage energy.",
    palette: "Black/white + neon lime + red + electric blue",
    typography: "System UI display (heavy) + mono microcopy + brutal hierarchy.",
    motion: "Cursor layer + marquees + zoom/lift + in-view reveals + overlap stacks.",
  },
  {
    slug: "v12-scrapbook-studio",
    number: "12",
    title: "V12 Scrapbook Studio",
    description:
      "Light-mode default with bold serif headlines, tiny body copy, italic scrapbook moments, polaroid collage galleries, and post-it note sections.",
    palette: "White paper + warm cream + rust + butter + electric blue",
    typography: "Bold serif display + small calm sans body + italic serif as scrapbook texture.",
    motion: "Cursor glow + scrolling banner + photo zoom hover + reveal steps + collage lift.",
  },
  {
    slug: "v13-kitsch-computer-club",
    number: "13",
    title: "V13 Kitsch Computer Club",
    description:
      "Early-computer nostalgia: typewriter-ish mono labels, bright system colors, scanlines, and maximal sticky-note + polaroid collage energy.",
    palette: "White base + neon lime + red + electric blue + magenta",
    typography: "Heavy system UI display + retro mono microcopy (90s game-ish).",
    motion: "Single-color cursor glow + extra marquees + float + scanlines + zoom + wiggle.",
  },
  {
    slug: "v14-adcker-index",
    number: "14",
    title: "V14 Adcker Index",
    description:
      "Adcker-inspired editorial minimalism: parentheses UI chrome, huge serif headlines, mono labels, and click-to-focus cards.",
    palette: "Black/white base + selective neon pops",
    typography: "Oversized serif display + mono UI labels + clean body.",
    motion: "Scroll % counter + pulsing dot + menu overlay + hover zoom.",
  },
  {
    slug: "v15-campus-arcade",
    number: "15",
    title: "V15 Campus Arcade",
    description:
      "Evolved from v13 into a believable landing: campus-first copy, pixel Crumbs, Streamline pixel icons, fuller hero collage, and scroll whoosh/zoom.",
    palette: "White base + neon lime + red + electric blue + magenta",
    typography: "Heavy system UI display + retro mono microcopy.",
    motion: "Single-color cursor glow + deeper scroll whoosh + collage zoom.",
  },
  {
    slug: "v16-campus-crumbs",
    number: "16",
    title: "V16 Campus Crumbs",
    description:
      "V15 refined: hero collage fixed to 3 photos and Crumbs upgraded to a full-body pixel cat with lick/curl/nap micro-animations.",
    palette: "White base + neon lime + red + electric blue + magenta",
    typography: "Heavy system UI display + retro mono microcopy.",
    motion: "Cursor glow + marquee + scanlines + scroll whoosh + Crumbs pose cycle (reduced-motion safe).",
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

const unsplash = {
  cozyCafeInterior:
    "https://images.unsplash.com/photo-1762770622112-4a708ce0d731?auto=format&fit=crop&w=2200&q=80",
  coffeePastryWindow:
    "https://images.unsplash.com/photo-1766981934909-278a54cc1efd?auto=format&fit=crop&w=2200&q=80",
  bulletinBoardFlyers:
    "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80",
  recordPlayerWarm:
    "https://images.unsplash.com/photo-1709649246219-220dfca6f75a?auto=format&fit=crop&w=2200&q=80",
  vinylCloseup:
    "https://images.unsplash.com/photo-1770928346199-a23fa7667e5b?auto=format&fit=crop&w=2200&q=80",
  partyLaughing:
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2200&q=80",
  potteryHands:
    "https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?auto=format&fit=crop&w=2200&q=80",
  catOnCouch:
    "https://images.unsplash.com/photo-1660760509528-14208e92b9ae?auto=format&fit=crop&w=2200&q=80",
  dragonMuralStreet:
    "https://images.unsplash.com/photo-1754079132860-5b37dab49daa?auto=format&fit=crop&w=2200&q=80",
  stageMicrophone:
    "https://images.unsplash.com/photo-1731007733979-6f3d7b8632ae?auto=format&fit=crop&w=2200&q=80",
} as const;

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

function CommonRoomRadioSite() {
  return (
    <main
      className="min-h-screen bg-[#0f0d0c] text-[#fff7ed]"
      style={
        {
          "--radio-display":
            '"Impact","Haettenschweiler","Franklin Gothic Heavy","Arial Black",system-ui,sans-serif',
          "--radio-body":
            '"Trebuchet MS","Avenir Next","Segoe UI",system-ui,-apple-system,sans-serif',
          "--radio-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as CSSVars
      }
    >
      <header className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(242,203,113,0.18),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(189,98,63,0.16),transparent_42%)]">
        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative grid h-14 w-14 place-items-center rounded-[1.2rem] border border-white/12 bg-white/6 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                <span aria-hidden="true" className="text-2xl">
                  🐈
                </span>
                <span
                  className="absolute -right-1 -top-1 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.22em]"
                  style={{ fontFamily: "var(--radio-mono)" }}
                >
                  <span className="gallery-onair-dot" aria-hidden="true" />
                  ON AIR
                </span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--radio-mono)" }}>
                  Common Room Radio
                </p>
                <p className="text-sm text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                  A warm signal for people who want a campus feeling again.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/16 bg-white/6 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white hover:bg-white/10"
              >
                Gallery
              </Link>
              <a
                href="#radio-cta"
                className="rounded-full bg-[#f2cb71] px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#140f0d] shadow-[0_18px_44px_rgba(242,203,113,0.22)] hover:-translate-y-0.5 hover:shadow-[0_26px_62px_rgba(242,203,113,0.28)]"
              >
                Join the season
              </a>
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-t border-white/10 bg-black/35">
          <div
            className="gallery-radio-ticker flex min-w-max gap-12 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white/80"
            style={{ fontFamily: "var(--radio-mono)" }}
            aria-label="Radio ticker"
          >
            <span>Chicago season preview</span>
            <span>Recurring cohorts</span>
            <span>Local businesses = campus buildings</span>
            <span>No swiping</span>
            <span>Showing up counts</span>
            <span>Crumbs saved you a spot</span>
            <span aria-hidden="true">•</span>
            <span>Chicago season preview</span>
            <span>Recurring cohorts</span>
            <span>Local businesses = campus buildings</span>
            <span>No swiping</span>
            <span>Showing up counts</span>
            <span>Crumbs saved you a spot</span>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-12 md:px-10 md:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p
                className="inline-flex rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--radio-mono)" }}
              >
                88.8 FM • Common Area
              </p>
              <h1
                className="mt-8 max-w-3xl text-[4.2rem] leading-[0.86] tracking-[-0.02em] md:text-[6.2rem]"
                style={{ fontFamily: "var(--radio-display)" }}
              >
                Turn your city into a campus.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl" style={{ fontFamily: "var(--radio-body)" }}>
                Common Area is the opposite of “one-off meetup roulette.” It’s a season-long signal: recurring plans, familiar faces, and local spots that start to
                feel like campus buildings.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#radio-cta"
                  className="inline-flex items-center justify-center rounded-full bg-[#bd623f] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_rgba(189,98,63,0.24)] hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(189,98,63,0.32)]"
                >
                  Find your common area
                </a>
                <a
                  href="#radio-how"
                  className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/6 px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white hover:bg-white/10"
                >
                  How it works
                </a>
              </div>
              <p className="mt-6 text-sm text-white/55" style={{ fontFamily: "var(--radio-body)" }}>
                Photos via Unsplash. (This page is a design exploration — no backend logic.)
              </p>
            </div>

            <div className="relative min-h-[520px] rounded-[2rem] border border-white/12 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#f2cb71]/14 blur-2xl" aria-hidden="true" />
              <div className="absolute -right-12 bottom-10 h-36 w-36 rounded-full bg-[#bd623f]/14 blur-2xl" aria-hidden="true" />

              <div className="grid gap-5 md:grid-cols-2">
                <figure className="gallery-float-slow overflow-hidden rounded-[1.4rem] border border-white/12 bg-black/30">
                  <img
                    src={unsplash.recordPlayerWarm}
                    alt="A vinyl record on a record player under warm light."
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--radio-mono)" }}>
                      Side A: Familiar faces
                    </p>
                    <p className="mt-2 text-sm text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                      Repeated presence beats first-impression theater.
                    </p>
                  </figcaption>
                </figure>

                <figure className="gallery-float-slower mt-6 overflow-hidden rounded-[1.4rem] border border-white/12 bg-black/30 md:mt-0">
                  <img
                    src={unsplash.bulletinBoardFlyers}
                    alt="A bulletin board packed with posters and flyers."
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--radio-mono)" }}>
                      Show posters
                    </p>
                    <p className="mt-2 text-sm text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                      Campus bulletin board energy, but with clearer rules.
                    </p>
                  </figcaption>
                </figure>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-white/12 bg-[#fff7ed] p-5 text-[#140f0d] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--radio-mono)" }}>
                  This season’s structure
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Deposit", "$20", "Keeps the room from being empty."],
                    ["Choices", "4 of 6", "Enough overlap to recognize people twice."],
                    ["Cohort", "15–20", "Big enough to feel social. Small enough to feel real."],
                  ].map(([label, value, note]) => (
                    <div key={label} className="rounded-[1.2rem] border border-[#201c1a]/10 bg-white p-4">
                      <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--radio-mono)" }}>
                        {label}
                      </p>
                      <p className="mt-2 text-3xl leading-none" style={{ fontFamily: "var(--radio-display)" }}>
                        {value}
                      </p>
                      <p className="mt-3 text-sm text-[#4b4038]" style={{ fontFamily: "var(--radio-body)" }}>
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="radio-how" className="border-t border-white/10 bg-black/25">
          <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-18">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2 className="text-4xl leading-[0.95] md:text-6xl" style={{ fontFamily: "var(--radio-display)" }}>
                  How it works
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                  A season is a shared schedule. You don’t need to “crush networking.” You just need a few repeats.
                </p>
              </div>
              <ol className="grid gap-4">
                {[
                  ["Join the Chicago season", "Sign up for the season and claim a spot before cohorts close."],
                  ["Pick 4 activities", "Choose four neighborhood plans you’d actually show up for."],
                  ["Come back to familiar faces", "You’ll see the same people again — on purpose."],
                ].map(([title, body], index) => (
                  <li key={title} className="gallery-reveal-up rounded-[1.6rem] border border-white/12 bg-white/6 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--radio-mono)" }}>
                      Step {index + 1}
                    </p>
                    <p className="mt-4 text-2xl leading-tight" style={{ fontFamily: "var(--radio-display)" }}>
                      {title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                      {body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-18">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl md:text-6xl" style={{ fontFamily: "var(--radio-display)" }}>
                Activity preview
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                The point is not perfection — it’s a reason to leave the house that isn’t “networking.”
              </p>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55" style={{ fontFamily: "var(--radio-mono)" }}>
              Sample set • Chicago neighborhoods
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Pottery night", "Logan Square", unsplash.potteryHands],
              ["Mural walk", "Pilsen", unsplash.dragonMuralStreet],
              ["Comedy show", "Old Town", unsplash.stageMicrophone],
            ].map(([title, place, img]) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[1.7rem] border border-white/12 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
              >
                <img src={img} alt={`${title} in ${place}.`} className="h-56 w-full object-cover opacity-90 transition group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--radio-mono)" }}>
                    {place}
                  </p>
                  <h3 className="mt-4 text-3xl leading-none" style={{ fontFamily: "var(--radio-display)" }}>
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                    Photo via Unsplash.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(189,98,63,0.16),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(242,203,113,0.14),transparent_40%)]">
          <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-18">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div className="rounded-[2rem] border border-white/12 bg-black/25 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--radio-mono)" }}>
                  Cohort logic
                </p>
                <h2 className="mt-5 text-5xl leading-[0.9] md:text-6xl" style={{ fontFamily: "var(--radio-display)" }}>
                  Community is mostly showing up.
                </h2>
                <p className="mt-6 text-lg leading-8 text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                  Common Area is built around repeated presence: the second time is easier, the third time is yours, and suddenly the city has a home base again.
                </p>
                <ul className="mt-8 grid gap-3 text-sm text-white/70" style={{ fontFamily: "var(--radio-body)" }}>
                  <li className="rounded-[1.2rem] border border-white/12 bg-white/5 p-4">15–20 people per cohort: social, not crowded.</li>
                  <li className="rounded-[1.2rem] border border-white/12 bg-white/5 p-4">Overlapping picks create recognition without pressure.</li>
                  <li className="rounded-[1.2rem] border border-white/12 bg-white/5 p-4">Local businesses become “campus buildings” you return to.</li>
                </ul>
              </div>

              <figure className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                <img
                  src={unsplash.partyLaughing}
                  alt="A group of friends laughing together under warm string lights."
                  className="h-[520px] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--radio-mono)" }}>
                    Photo via Unsplash
                  </p>
                  <p className="mt-3 max-w-md text-sm text-white/80" style={{ fontFamily: "var(--radio-body)" }}>
                    You don’t need to be the most interesting person in the room. You just need a room that exists again next week.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="radio-cta" className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[#fff7ed] p-8 text-[#140f0d] shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:p-12">
            <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-[#f2cb71]/50 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#bd623f]/28 blur-3xl" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--radio-mono)" }}>
              Call time
            </p>
            <h2 className="mt-5 max-w-4xl text-[3.2rem] leading-[0.9] md:text-[4.6rem]" style={{ fontFamily: "var(--radio-display)" }}>
              Crumbs saved you a spot. (He will not greet you at the door.)
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4b4038]" style={{ fontFamily: "var(--radio-body)" }}>
              Join the season, pick a few plans, and let repeated presence do the rest.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[#201c1a] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#fff7ed] shadow-[0_18px_48px_rgba(32,28,26,0.22)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(32,28,26,0.28)]"
              >
                Join the Chicago season
              </Link>
              <a
                href="#radio-how"
                className="inline-flex items-center justify-center rounded-full border border-[#201c1a]/18 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#201c1a] hover:bg-[#f2e7d8]"
              >
                Back to how it works
              </a>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}

function CrumbsCafeSite() {
  return (
    <main
      className="min-h-screen bg-[#f6efe6] text-[#201c1a]"
      style={
        {
          "--cafe-display":
            '"Iowan Old Style","Palatino Linotype","Book Antiqua",Georgia,serif',
          "--cafe-body":
            '"Trebuchet MS","Verdana","Segoe UI",system-ui,-apple-system,sans-serif',
          "--cafe-hand": '"Segoe Print","Bradley Hand","Comic Sans MS",cursive',
          "--cafe-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as CSSVars
      }
    >
      <header className="relative overflow-hidden px-5 pb-12 pt-7 md:px-10 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(242,203,113,0.36),transparent_45%),radial-gradient(circle_at_84%_10%,rgba(191,212,223,0.44),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(189,98,63,0.14),transparent_48%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav className="flex flex-col gap-4 rounded-[2rem] border border-black/10 bg-white/70 p-5 backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-[1.4rem] bg-[#bd623f] text-white shadow-[0_14px_40px_rgba(189,98,63,0.22)]">
                <span aria-hidden="true" className="text-2xl">
                  🐈
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--cafe-body)" }}>
                  Crumbs Café
                </p>
                <p className="text-sm text-black/60" style={{ fontFamily: "var(--cafe-hand)" }}>
                  “Low pressure. Warm lighting. Familiar faces.”
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.22em] shadow-[0_14px_34px_rgba(52,36,24,0.1)] hover:-translate-y-0.5"
              >
                Gallery
              </Link>
              <a
                href="#cafe-cta"
                className="rounded-full bg-[#201c1a] px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-[#fff8f0] shadow-[0_18px_40px_rgba(32,28,26,0.18)] hover:-translate-y-0.5"
              >
                Save me a spot
              </a>
            </div>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p
                className="inline-flex w-fit rounded-full border border-black/10 bg-[#f2cb71] px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--cafe-mono)" }}
              >
                Neighborhood café edition
              </p>
              <h1 className="mt-7 text-[4.1rem] leading-[0.9] md:text-[6.2rem]" style={{ fontFamily: "var(--cafe-display)" }}>
                Turn your city into a campus, quietly.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-black/70 md:text-xl" style={{ fontFamily: "var(--cafe-body)" }}>
                Cohorts feel like the regulars table. You come back. You recognize people. The city stops being a performance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#cafe-how"
                  className="inline-flex items-center justify-center rounded-full bg-[#bd623f] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_46px_rgba(189,98,63,0.24)] hover:-translate-y-0.5"
                >
                  Read the menu
                </a>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.22em] shadow-[0_14px_34px_rgba(52,36,24,0.1)] hover:-translate-y-0.5"
                >
                  Join the season
                </Link>
              </div>
              <p className="mt-6 text-sm text-black/55" style={{ fontFamily: "var(--cafe-hand)" }}>
                Crumbs note: your couch will forgive you.
              </p>
            </div>

            <div className="relative min-h-[560px] rounded-[2.2rem] border border-black/10 bg-white/75 p-6 shadow-[0_26px_70px_rgba(52,36,24,0.14)] backdrop-blur">
              <div className="absolute -left-8 top-10 h-36 w-36 rounded-full bg-[#f2cb71]/60 blur-3xl" aria-hidden="true" />
              <div className="absolute -right-10 bottom-12 h-40 w-40 rounded-full bg-[#bfd4df]/60 blur-3xl" aria-hidden="true" />

              <div className="absolute right-6 top-6">
                <div className="gallery-steam-stack" aria-hidden="true">
                  <span className="gallery-steam" />
                  <span className="gallery-steam gallery-steam-delay" />
                  <span className="gallery-steam gallery-steam-delay2" />
                </div>
              </div>

              <figure className="gallery-reveal-up overflow-hidden rounded-[1.8rem] border border-black/10 bg-[#fff8f0] shadow-[0_18px_48px_rgba(52,36,24,0.14)]">
                <img
                  src={unsplash.coffeePastryWindow}
                  alt="Coffee and pastry on a table by a window."
                  className="h-60 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="px-5 py-5">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--cafe-mono)" }}>
                    Today’s special
                  </p>
                  <p className="mt-2 text-lg leading-8 text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
                    A season-long social rhythm, served warm.
                  </p>
                  <p className="mt-3 text-sm text-black/55" style={{ fontFamily: "var(--cafe-body)" }}>
                    Photo via Unsplash.
                  </p>
                </figcaption>
              </figure>

              <figure className="gallery-float-slow absolute -bottom-8 left-6 w-[78%] max-w-[420px] rotate-[-2deg] overflow-hidden rounded-[1.9rem] border border-black/10 bg-white shadow-[0_26px_70px_rgba(52,36,24,0.14)]">
                <img
                  src={unsplash.catOnCouch}
                  alt="A cat sleeping on a couch."
                  className="h-56 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="px-5 py-4">
                  <p className="text-sm text-black/60" style={{ fontFamily: "var(--cafe-hand)" }}>
                    Crumbs is not ignoring you. He is observing.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <section id="cafe-how" className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 shadow-[0_18px_46px_rgba(52,36,24,0.1)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--cafe-mono)" }}>
              How it works
            </p>
            <h2 className="mt-5 text-5xl leading-[0.95] md:text-6xl" style={{ fontFamily: "var(--cafe-display)" }}>
              Familiar faces, not first impressions.
            </h2>
            <p className="mt-6 text-lg leading-8 text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
              A season is an excuse to return. The structure handles the awkward part. You just show up.
            </p>
          </div>

          <ol className="grid gap-4">
            {[
              ["Join the season", "Claim a spot in the Chicago season."],
              ["Pick 4 activities", "Choose four plans that feel like a yes."],
              ["Come back again", "Overlapping picks build recognition."],
            ].map(([title, body], index) => (
              <li
                key={title}
                className="gallery-reveal-up rounded-[2rem] border border-black/10 bg-[#fff8f0] p-7 shadow-[0_18px_46px_rgba(52,36,24,0.1)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#bd623f]" style={{ fontFamily: "var(--cafe-mono)" }}>
                  Step {index + 1}
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--cafe-body)" }}>
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] border border-black/10 bg-white/70 p-7 shadow-[0_18px_46px_rgba(52,36,24,0.1)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--cafe-mono)" }}>
              Activity preview
            </p>
            <h2 className="mt-5 text-5xl leading-[0.95] md:text-6xl" style={{ fontFamily: "var(--cafe-display)" }}>
              Plans that feel like a warm yes.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
              Pottery. Cooking. Comedy. Coffee crawls. City walks. Board games. Enough structure to connect through play.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Pottery night", "Logan Square", unsplash.potteryHands],
                ["Coffee crawl", "Wicker Park", unsplash.coffeePastryWindow],
                ["Mural walk", "Pilsen", unsplash.dragonMuralStreet],
              ].map(([title, place, img]) => (
                <article key={title} className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-[0_18px_46px_rgba(52,36,24,0.1)]">
                  <img src={img} alt={`${title} in ${place}.`} className="h-40 w-full object-cover transition group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#bd623f]" style={{ fontFamily: "var(--cafe-mono)" }}>
                      {place}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--cafe-body)" }}>
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-black/60" style={{ fontFamily: "var(--cafe-body)" }}>
                      Photo via Unsplash.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#f2cb71] p-7 shadow-[0_18px_46px_rgba(52,36,24,0.12)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#201c1a]" style={{ fontFamily: "var(--cafe-mono)" }}>
              Crumbs moment
            </p>
            <p className="mt-5 text-3xl leading-tight" style={{ fontFamily: "var(--cafe-hand)" }}>
              “You can leave after an hour.”
            </p>
            <p className="mt-4 text-sm leading-7 text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
              Community doesn’t require a personality audition. It mostly requires a place worth returning to.
            </p>
            <div className="gallery-float-slow mt-8 rounded-[1.6rem] border border-black/10 bg-white/85 p-5 shadow-[0_18px_46px_rgba(52,36,24,0.1)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#934a30]" style={{ fontFamily: "var(--cafe-mono)" }}>
                Menu board
              </p>
              <ul className="mt-4 grid gap-3 text-sm text-black/70" style={{ fontFamily: "var(--cafe-body)" }}>
                <li>Deposit: $20 (keeps the room from being empty)</li>
                <li>Pick: 4 of 6 activities</li>
                <li>Cohort: ~15–20 people</li>
              </ul>
            </div>
          </aside>
        </section>

        <section id="cafe-cta" className="mt-10">
          <div className="rounded-[2.2rem] border border-black/10 bg-[#201c1a] p-8 text-[#fff8f0] shadow-[0_26px_70px_rgba(32,28,26,0.22)] md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--cafe-mono)" }}>
              Last call (gentle)
            </p>
            <h2 className="mt-6 text-[3.2rem] leading-[0.9] md:text-[4.6rem]" style={{ fontFamily: "var(--cafe-display)" }}>
              Join the Chicago season.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75" style={{ fontFamily: "var(--cafe-body)" }}>
              Crumbs saved you a spot in the warm corner. He will not move if someone sits there first.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[#f2cb71] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#201c1a] shadow-[0_18px_46px_rgba(242,203,113,0.22)] hover:-translate-y-0.5"
              >
                Create an account
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#fff8f0] hover:bg-white/12"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}

function CampusAfterDarkSite() {
  return (
    <main
      className="min-h-screen bg-[#0a0909] text-[#fbf3e8]"
      style={
        {
          "--dark-display":
            '"Didot","Bodoni MT","Baskerville","Times New Roman",serif',
          "--dark-body":
            '"Helvetica Neue","Segoe UI",system-ui,-apple-system,sans-serif',
          "--dark-condensed":
            '"Arial Narrow","Franklin Gothic Medium","Helvetica Neue",Arial,sans-serif',
          "--dark-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as CSSVars
      }
    >
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(242,203,113,0.18),transparent_48%),radial-gradient(circle_at_20%_40%,rgba(189,98,63,0.18),transparent_46%),radial-gradient(circle_at_80%_55%,rgba(191,212,223,0.12),transparent_46%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.16),transparent_70%)] gallery-spotlight" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-8 md:px-10 md:pb-18">
          <nav className="flex flex-col gap-4 rounded-[2rem] border border-white/12 bg-white/5 p-5 backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-[1.4rem] bg-[#f2cb71] text-[#201c1a] shadow-[0_18px_50px_rgba(242,203,113,0.2)]">
                <span aria-hidden="true" className="text-2xl">
                  🐈
                </span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--dark-condensed)" }}>
                  Campus After Dark
                </p>
                <p className="text-sm text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                  Comedy-night warmth, poster-wall drama, zero clubby cringe.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/14 bg-white/6 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] hover:bg-white/10"
              >
                Gallery
              </Link>
              <a
                href="#dark-cta"
                className="rounded-full bg-[#bd623f] px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_54px_rgba(189,98,63,0.24)] hover:-translate-y-0.5"
              >
                Get a spot
              </a>
            </div>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex w-fit rounded-full border border-white/14 bg-white/6 px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                Chicago season • after dark
              </p>
              <h1 className="mt-8 text-[4.1rem] leading-[0.86] tracking-[-0.02em] md:text-[6.8rem]" style={{ fontFamily: "var(--dark-display)" }}>
                A common room with the lights low.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl" style={{ fontFamily: "var(--dark-body)" }}>
                Same promise, different mood: structured play, familiar faces, and a reason to go out that isn’t “make new friends in 30 seconds.”
              </p>
              <div className="mt-9 overflow-hidden rounded-[1.6rem] border border-white/12 bg-black/35 py-3">
                <div className="gallery-marquee flex min-w-max gap-10 px-6 text-[1.05rem] font-black uppercase tracking-[0.12em] text-white/85 md:text-[1.25rem]" style={{ fontFamily: "var(--dark-condensed)" }}>
                  <span>Comedy. Cooking. Pottery. City walks.</span>
                  <span>Not a nightlife brand.</span>
                  <span>Just a place to return to.</span>
                  <span>Comedy. Cooking. Pottery. City walks.</span>
                  <span>Not a nightlife brand.</span>
                  <span>Just a place to return to.</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2.2rem] border border-white/12 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <div className="grid gap-5 md:grid-cols-2">
                <figure className="overflow-hidden rounded-[1.6rem] border border-white/12 bg-black/35">
                  <img src={unsplash.stageMicrophone} alt="A performer holding a microphone on stage." className="h-56 w-full object-cover" loading="lazy" decoding="async" />
                  <figcaption className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                      Comedy night
                    </p>
                    <p className="mt-3 text-sm text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                      Built-in conversation starters. Built-in exits.
                    </p>
                  </figcaption>
                </figure>

                <figure className="overflow-hidden rounded-[1.6rem] border border-white/12 bg-black/35">
                  <img src={unsplash.partyLaughing} alt="Friends laughing together under string lights." className="h-56 w-full object-cover" loading="lazy" decoding="async" />
                  <figcaption className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                      Familiar faces
                    </p>
                    <p className="mt-3 text-sm text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                      The second time is easier. That’s the whole point.
                    </p>
                  </figcaption>
                </figure>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Deposit", "$20"],
                  ["Pick", "4 of 6"],
                  ["Cohort", "15–20"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.6rem] border border-white/12 bg-white/6 p-5">
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                      {label}
                    </p>
                    <p className="mt-3 text-3xl leading-none" style={{ fontFamily: "var(--dark-display)" }}>
                      {value}
                    </p>
                    <p className="mt-3 text-sm text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                      Photo via Unsplash.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <section id="dark-how" className="mt-2 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/12 bg-white/5 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
              How it works
            </p>
            <h2 className="mt-5 text-5xl leading-[0.9] md:text-6xl" style={{ fontFamily: "var(--dark-display)" }}>
              A season, not a scramble.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
              A cohort is a room you can return to. Same faces. Same neighborhoods. Less pressure to perform.
            </p>
          </div>
          <ol className="grid gap-4">
            {[
              ["Join the season", "Sign up and claim a spot."],
              ["Pick four plans", "Choose what you’d actually attend."],
              ["Come back to people", "Overlap creates recognition."],
            ].map(([title, body], index) => (
              <li
                key={title}
                className="gallery-reveal-up rounded-[2rem] border border-white/12 bg-white/5 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                  Step {index + 1}
                </p>
                <p className="mt-4 text-2xl font-black uppercase tracking-[0.08em]" style={{ fontFamily: "var(--dark-condensed)" }}>
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-[2.2rem] border border-white/12 bg-white/5 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.5)] md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
                Activity preview
              </p>
              <h2 className="mt-5 text-5xl leading-[0.9] md:text-6xl" style={{ fontFamily: "var(--dark-display)" }}>
                Connection through play.
              </h2>
            </div>
            <p className="text-sm text-white/65" style={{ fontFamily: "var(--dark-body)" }}>
              Hover the stack — it fans like a poster wall.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="relative min-h-[420px] rounded-[2rem] border border-white/12 bg-black/35 p-6">
              <div className="flex flex-wrap items-center gap-3">
                {["Comedy show", "Cooking class", "City walk", "Pottery night"].map((tag) => (
                  <span key={tag} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--dark-condensed)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  [unsplash.stageMicrophone, "Warm stage light"],
                  [unsplash.vinylCloseup, "A record cue"],
                  [unsplash.potteryHands, "Hands in clay"],
                  [unsplash.dragonMuralStreet, "Neighborhood texture"],
                ].map(([src, alt], index) => (
                  <figure
                    key={src}
                    className="gallery-fan-card overflow-hidden rounded-[1.6rem] border border-white/12 bg-black/35"
                    style={{ "--fan-index": `${index}` } as CSSVars}
                  >
                    <img src={src} alt={alt} className="h-44 w-full object-cover" loading="lazy" decoding="async" />
                    <figcaption className="p-4 text-xs text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
                      Photo via Unsplash.
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/12 bg-[#f2cb71] p-7 text-[#201c1a] shadow-[0_26px_70px_rgba(242,203,113,0.12)]">
              <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ fontFamily: "var(--dark-mono)" }}>
                Crumbs moment
              </p>
              <p className="mt-6 text-4xl leading-tight" style={{ fontFamily: "var(--dark-display)" }}>
                “Your couch will forgive you.”
              </p>
              <p className="mt-5 text-sm leading-7 text-black/70" style={{ fontFamily: "var(--dark-body)" }}>
                After dark doesn’t mean high pressure. It means a softer room, a clearer plan, and a decent exit.
              </p>
            </aside>
          </div>
        </section>

        <section id="dark-cta" className="mt-10">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(189,98,63,0.24),rgba(242,203,113,0.12),rgba(10,9,9,0))] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.55)] md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2cb71]" style={{ fontFamily: "var(--dark-mono)" }}>
              CTA
            </p>
            <h2 className="mt-6 max-w-4xl text-[3.2rem] leading-[0.9] md:text-[4.8rem]" style={{ fontFamily: "var(--dark-display)" }}>
              Join the season. Show up twice. That’s enough.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70" style={{ fontFamily: "var(--dark-body)" }}>
              This is a design exploration. No payment logic. No assignment logic. Just the vibe.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[#f2cb71] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#201c1a] hover:-translate-y-0.5"
              >
                Create an account
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}

function FieldGuideSite() {
  return (
    <main
      className="min-h-screen bg-[#eef0e8] text-[#172018]"
      style={
        {
          "--guide-display":
            '"Bookman Old Style","Palatino Linotype","Iowan Old Style",Georgia,serif',
          "--guide-body":
            '"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif',
          "--guide-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as CSSVars
      }
    >
      <header className="border-b-2 border-[#172018] bg-[#fbf7ea]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">
          <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] border-2 border-[#172018] bg-[#f2cb71]">
                <span aria-hidden="true" className="text-2xl">
                  🐈
                </span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em]" style={{ fontFamily: "var(--guide-mono)" }}>
                  Common Area Field Guide
                </p>
                <p className="text-sm text-[#172018]/70" style={{ fontFamily: "var(--guide-body)" }}>
                  The city as campus map. Local spots as buildings.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border-2 border-[#172018] bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] shadow-[5px_5px_0_rgba(23,32,24,0.12)] hover:-translate-y-0.5"
              >
                Gallery
              </Link>
              <a
                href="#guide-cta"
                className="rounded-full border-2 border-[#172018] bg-[#172018] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#fbf7ea] shadow-[5px_5px_0_rgba(23,32,24,0.12)] hover:-translate-y-0.5"
              >
                Get the guide
              </a>
            </div>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="inline-flex w-fit rounded-full border-2 border-[#172018] bg-white px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.18em]" style={{ fontFamily: "var(--guide-mono)" }}>
                Chicago season • index
              </p>
              <h1 className="mt-8 text-[4.2rem] leading-[0.9] md:text-[6.2rem]" style={{ fontFamily: "var(--guide-display)" }}>
                The neighborhood field guide to making friends.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#172018]/80 md:text-xl" style={{ fontFamily: "var(--guide-body)" }}>
                Common Area turns local businesses into “campus buildings.” A season gives you routes. A cohort gives you classmates. Repetition makes the map readable.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Deposit", "$20", "Commitment, not a paywall."],
                  ["Choices", "4 of 6", "Overlap creates recognition."],
                  ["Cohort", "15–20", "A room you can return to."],
                ].map(([k, v, d]) => (
                  <div key={k} className="rounded-[1.2rem] border-2 border-[#172018] bg-white p-4 shadow-[6px_6px_0_rgba(23,32,24,0.12)]">
                    <dt className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--guide-mono)" }}>
                      {k}
                    </dt>
                    <dd className="mt-2 text-3xl leading-none" style={{ fontFamily: "var(--guide-display)" }}>
                      {v}
                    </dd>
                    <dd className="mt-3 text-sm text-[#172018]/75" style={{ fontFamily: "var(--guide-body)" }}>
                      {d}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="relative overflow-hidden rounded-[2rem] border-2 border-[#172018] bg-white shadow-[10px_10px_0_rgba(23,32,24,0.12)]">
              <img src={unsplash.dragonMuralStreet} alt="A sunny street scene featuring a dragon mural." className="h-[520px] w-full object-cover" loading="lazy" decoding="async" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(251,247,234,0.92))] p-6">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--guide-mono)" }}>
                  Photo via Unsplash
                </p>
                <p className="mt-2 text-sm text-[#172018]/75" style={{ fontFamily: "var(--guide-body)" }}>
                  Neighborhood texture matters. The map is the point.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 md:px-10">
        <section id="guide-how" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border-2 border-[#172018] bg-[#fbf7ea] p-7 shadow-[10px_10px_0_rgba(23,32,24,0.12)]">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#2e6f7d]" style={{ fontFamily: "var(--guide-mono)" }}>
              How it works
            </p>
            <h2 className="mt-5 text-5xl leading-[0.92] md:text-6xl" style={{ fontFamily: "var(--guide-display)" }}>
              Three steps, then repetition.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#172018]/80" style={{ fontFamily: "var(--guide-body)" }}>
              The guidebook version of friendship: routes, notes, stamps, and returning to places.
            </p>
          </div>

          <ol className="grid gap-4">
            {[
              ["Join the season", "Start a season so the map has a shared timeframe."],
              ["Pick 4 activities", "Mark four routes you’d actually follow."],
              ["Get assigned a cohort", "Your classmates for the season (15–20)."],
            ].map(([title, body], index) => (
              <li
                key={title}
                className="gallery-reveal-up rounded-[2rem] border-2 border-[#172018] bg-white p-7 shadow-[10px_10px_0_rgba(23,32,24,0.12)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--guide-mono)" }}>
                  Step {index + 1}
                </p>
                <p className="mt-4 text-2xl font-black" style={{ fontFamily: "var(--guide-display)" }}>
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#172018]/75" style={{ fontFamily: "var(--guide-body)" }}>
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-[2.2rem] border-2 border-[#172018] bg-white p-7 shadow-[12px_12px_0_rgba(23,32,24,0.12)] md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#2e6f7d]" style={{ fontFamily: "var(--guide-mono)" }}>
                Activity preview
              </p>
              <h2 className="mt-5 text-5xl leading-[0.92] md:text-6xl" style={{ fontFamily: "var(--guide-display)" }}>
                Pin the route. Take notes.
              </h2>
            </div>
            <p className="text-sm text-[#172018]/70" style={{ fontFamily: "var(--guide-body)" }}>
              Pins bob slightly — they’re anchored, not floating away.
            </p>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] border-2 border-[#172018] bg-[#fbf7ea] p-6 md:p-8">
            <div className="gallery-draw-line absolute left-8 top-[52%] h-1 w-[92%] bg-[#2e6f7d]" aria-hidden="true" />
            {[
              ["Pottery night", "Logan Square", "left-10 top-12", unsplash.potteryHands],
              ["Coffee crawl", "Wicker Park", "right-10 top-16", unsplash.coffeePastryWindow],
              ["Comedy show", "Old Town", "left-[38%] top-44", unsplash.stageMicrophone],
              ["Mural walk", "Pilsen", "left-16 bottom-24", unsplash.dragonMuralStreet],
            ].map(([title, place, pos, img]) => (
              <article key={title} className={`gallery-pin-bob absolute ${pos} w-56 rounded-[1.4rem] border-2 border-[#172018] bg-white shadow-[8px_8px_0_rgba(23,32,24,0.12)]`}>
                <div className="overflow-hidden rounded-[1.2rem] border-b-2 border-[#172018]">
                  <img src={img} alt={`${title} in ${place}.`} className="h-28 w-full object-cover" loading="lazy" decoding="async" />
                </div>
                <div className="p-4">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--guide-mono)" }}>
                    {place}
                  </p>
                  <p className="mt-2 text-sm font-black" style={{ fontFamily: "var(--guide-display)" }}>
                    {title}
                  </p>
                  <p className="mt-2 text-xs text-[#172018]/70" style={{ fontFamily: "var(--guide-body)" }}>
                    Photo via Unsplash.
                  </p>
                </div>
              </article>
            ))}

            <div className="absolute left-[44%] top-[46%] rounded-full border-2 border-[#172018] bg-[#f2cb71] px-6 py-4 text-[0.72rem] font-black uppercase tracking-[0.18em]" style={{ fontFamily: "var(--guide-mono)" }}>
              Cohort hub
            </div>
          </div>
        </section>

        <section id="guide-crumbs" className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="rounded-[2rem] border-2 border-[#172018] bg-[#f2cb71] p-7 shadow-[10px_10px_0_rgba(23,32,24,0.12)]">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em]" style={{ fontFamily: "var(--guide-mono)" }}>
              Crumbs note
            </p>
            <p className="mt-6 text-4xl leading-tight" style={{ fontFamily: "var(--guide-display)" }}>
              “The map is easier on your second visit.”
            </p>
            <p className="mt-5 text-sm leading-7 text-[#172018]/75" style={{ fontFamily: "var(--guide-body)" }}>
              He’s right. Repetition isn’t boring — it’s how places become yours.
            </p>
          </aside>
          <div className="rounded-[2rem] border-2 border-[#172018] bg-white p-7 shadow-[10px_10px_0_rgba(23,32,24,0.12)]">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#2e6f7d]" style={{ fontFamily: "var(--guide-mono)" }}>
              Cohort/community
            </p>
            <h2 className="mt-5 text-5xl leading-[0.92] md:text-6xl" style={{ fontFamily: "var(--guide-display)" }}>
              A city with classmates again.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#172018]/80" style={{ fontFamily: "var(--guide-body)" }}>
              Your cohort is a steady group that overlaps on activities. It’s enough repetition that people move from “strangers” to “oh hey.”
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-[#172018]/75" style={{ fontFamily: "var(--guide-body)" }}>
              <li className="rounded-[1.2rem] border-2 border-[#172018] bg-[#fbf7ea] p-4 shadow-[6px_6px_0_rgba(23,32,24,0.12)]">
                Overlap is the design: you’ll share at least a couple activities with others.
              </li>
              <li className="rounded-[1.2rem] border-2 border-[#172018] bg-[#fbf7ea] p-4 shadow-[6px_6px_0_rgba(23,32,24,0.12)]">
                Local businesses anchor the routine and make returning feel real.
              </li>
              <li className="rounded-[1.2rem] border-2 border-[#172018] bg-[#fbf7ea] p-4 shadow-[6px_6px_0_rgba(23,32,24,0.12)]">
                Connection through play: structured activities beat awkward small talk.
              </li>
            </ul>
          </div>
        </section>

        <section id="guide-cta" className="mt-10">
          <div className="rounded-[2.2rem] border-2 border-[#172018] bg-[#172018] p-8 text-[#fbf7ea] shadow-[12px_12px_0_rgba(23,32,24,0.12)] md:p-12">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#f2cb71]" style={{ fontFamily: "var(--guide-mono)" }}>
              CTA
            </p>
            <h2 className="mt-6 text-[3.2rem] leading-[0.9] md:text-[4.6rem]" style={{ fontFamily: "var(--guide-display)" }}>
              Join the season. Pin a route. Show up twice.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75" style={{ fontFamily: "var(--guide-body)" }}>
              Design exploration only — no backend logic is being added here.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="inline-flex items-center justify-center rounded-full bg-[#f2cb71] px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#172018] hover:-translate-y-0.5">
                Create an account
              </Link>
              <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#fbf7ea] hover:bg-white/12">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}

function HousePartyBulletinSite() {
  return (
    <main
      className="min-h-screen bg-[#f7f1e7] text-[#1a1716]"
      style={
        {
          "--party-display":
            '"Impact","Arial Black","Franklin Gothic Heavy","Haettenschweiler",system-ui,sans-serif',
          "--party-body":
            '"Arial Rounded MT Bold","Trebuchet MS","Segoe UI",system-ui,-apple-system,sans-serif',
          "--party-serif": 'Georgia,"Times New Roman",serif',
          "--party-mono":
            '"SFMono-Regular","SF Mono",Consolas,"Liberation Mono",monospace',
        } as CSSVars
      }
    >
      <header className="relative overflow-hidden px-5 pb-12 pt-8 md:px-10 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,203,113,0.42),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(191,212,223,0.52),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(189,98,63,0.18),transparent_46%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-[0.8rem] border-2 border-[#1a1716] bg-white shadow-[6px_6px_0_rgba(26,23,22,0.12)]">
                <span aria-hidden="true" className="text-2xl">
                  🐈
                </span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em]" style={{ fontFamily: "var(--party-mono)" }}>
                  House Party Bulletin
                </p>
                <p className="text-sm text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                  Maximal collage, still readable.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border-2 border-[#1a1716] bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] shadow-[6px_6px_0_rgba(26,23,22,0.12)] hover:-translate-y-0.5"
              >
                Gallery
              </Link>
              <a
                href="#party-cta"
                className="rounded-full border-2 border-[#1a1716] bg-[#1a1716] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#f7f1e7] shadow-[6px_6px_0_rgba(26,23,22,0.12)] hover:-translate-y-0.5"
              >
                Open invite
              </a>
            </div>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="rounded-[2rem] border-2 border-[#1a1716] bg-white p-7 shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
              <p className="inline-flex w-fit rotate-[-2deg] rounded-full border-2 border-[#1a1716] bg-[#f2cb71] px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.18em] gallery-sticker-wiggle" style={{ fontFamily: "var(--party-mono)" }}>
                Flyers / tape / chaos (controlled)
              </p>
              <h1 className="mt-8 text-[4.4rem] leading-[0.82] md:text-[6.8rem]" style={{ fontFamily: "var(--party-display)" }}>
                TURN YOUR CITY INTO A CAMPUS.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                The vibe: a bulletin board that actually helps you show up. The structure: cohorts and repeats. The point: community without the performance.
              </p>
              <div className="mt-8 overflow-hidden rounded-[1.4rem] border-2 border-[#1a1716] bg-[#1a1716] py-3 text-[#f7f1e7] shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
                <div className="gallery-party-marquee flex min-w-max gap-10 px-6 text-[1.05rem] font-black uppercase tracking-[0.14em]" style={{ fontFamily: "var(--party-display)" }}>
                  <span>NO SWIPING</span>
                  <span>SHOW UP TWICE</span>
                  <span>LOCAL SPOTS = CAMPUS BUILDINGS</span>
                  <span>CRUMBS SAVED YOU A SPOT</span>
                  <span>NO SWIPING</span>
                  <span>SHOW UP TWICE</span>
                  <span>LOCAL SPOTS = CAMPUS BUILDINGS</span>
                  <span>CRUMBS SAVED YOU A SPOT</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[620px] rounded-[2rem] border-2 border-[#1a1716] bg-[#fbf7ea] p-6 shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
              <figure className="gallery-flyer-stack absolute left-6 top-8 w-[78%] max-w-[460px] rotate-[-2deg] overflow-hidden rounded-[1.4rem] border-2 border-[#1a1716] bg-white shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
                <img src={unsplash.bulletinBoardFlyers} alt="A bulletin board packed with posters and flyers." className="h-64 w-full object-cover" loading="lazy" decoding="async" />
                <figcaption className="p-5">
                  <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--party-mono)" }}>
                    Photo via Unsplash
                  </p>
                  <p className="mt-3 text-sm text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                    Bulletin board energy, but with clear hierarchy.
                  </p>
                </figcaption>
              </figure>

              <figure className="gallery-flyer-stack absolute bottom-10 right-6 w-[70%] max-w-[420px] rotate-[2deg] overflow-hidden rounded-[1.4rem] border-2 border-[#1a1716] bg-white shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
                <img src={unsplash.partyLaughing} alt="Friends laughing together under warm lights." className="h-64 w-full object-cover" loading="lazy" decoding="async" />
                <figcaption className="p-5">
                  <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--party-mono)" }}>
                    Photo via Unsplash
                  </p>
                  <p className="mt-3 text-sm text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                    Real-feeling social proof beats “look at our app.”
                  </p>
                </figcaption>
              </figure>

              <div className="absolute left-10 bottom-20 rotate-[-3deg] rounded-[1.4rem] border-2 border-[#1a1716] bg-[#f2cb71] px-6 py-5 shadow-[10px_10px_0_rgba(26,23,22,0.12)] gallery-sticker-wiggle">
                <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ fontFamily: "var(--party-mono)" }}>
                  Crumbs note
                </p>
                <p className="mt-3 text-2xl leading-tight" style={{ fontFamily: "var(--party-serif)" }}>
                  “You can leave after an hour.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <section id="party-how" className="mt-6 grid gap-6 lg:grid-cols-3">
          {[
            ["Join the season", "Pick a season, not an endless feed."],
            ["Pick 4 activities", "Choose four plans with actual structure."],
            ["Return to people", "Overlap makes recognition inevitable."],
          ].map(([title, body], index) => (
            <article
              key={title}
              className="gallery-reveal-up rounded-[2rem] border-2 border-[#1a1716] bg-white p-7 shadow-[10px_10px_0_rgba(26,23,22,0.12)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--party-mono)" }}>
                Step {index + 1}
              </p>
              <h2 className="mt-5 text-3xl leading-none" style={{ fontFamily: "var(--party-display)" }}>
                {title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                {body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] border-2 border-[#1a1716] bg-[#fbf7ea] p-7 shadow-[10px_10px_0_rgba(26,23,22,0.12)] md:p-10">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#2e6f7d]" style={{ fontFamily: "var(--party-mono)" }}>
              Activity preview
            </p>
            <h2 className="mt-6 text-5xl leading-[0.85] md:text-6xl" style={{ fontFamily: "var(--party-display)" }}>
              MAKE PLANS. TOUCH GRASS. MAKE FRIENDS.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Pottery night", "Logan Square", unsplash.potteryHands],
                ["Coffee crawl", "Wicker Park", unsplash.coffeePastryWindow],
                ["Comedy show", "Old Town", unsplash.stageMicrophone],
              ].map(([title, place, img]) => (
                <article key={title} className="group overflow-hidden rounded-[1.6rem] border-2 border-[#1a1716] bg-white shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
                  <img src={img} alt={`${title} in ${place}.`} className="h-40 w-full object-cover transition group-hover:scale-[1.04]" loading="lazy" decoding="async" />
                  <div className="p-5">
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--party-mono)" }}>
                      {place}
                    </p>
                    <h3 className="mt-3 text-2xl leading-none" style={{ fontFamily: "var(--party-display)" }}>
                      {title}
                    </h3>
                    <p className="mt-3 text-sm text-black/70" style={{ fontFamily: "var(--party-body)" }}>
                      Photo via Unsplash.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border-2 border-[#1a1716] bg-white p-7 shadow-[10px_10px_0_rgba(26,23,22,0.12)]">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#bd623f]" style={{ fontFamily: "var(--party-mono)" }}>
              Cohort/community
            </p>
            <p className="mt-6 text-3xl leading-tight" style={{ fontFamily: "var(--party-serif)" }}>
              “Repeated presence beats first-impression theater.”
            </p>
            <p className="mt-5 text-sm leading-7 text-black/70" style={{ fontFamily: "var(--party-body)" }}>
              Cohorts aren’t about exclusivity — they’re about giving friendship a schedule.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-black/70" style={{ fontFamily: "var(--party-body)" }}>
              <div className="rounded-[1.2rem] border-2 border-[#1a1716] bg-[#f2cb71] p-4 shadow-[6px_6px_0_rgba(26,23,22,0.12)]">
                15–20 people: social, not overwhelming.
              </div>
              <div className="rounded-[1.2rem] border-2 border-[#1a1716] bg-[#bfd4df] p-4 shadow-[6px_6px_0_rgba(26,23,22,0.12)]">
                Pick overlap so you recognize people twice.
              </div>
              <div className="rounded-[1.2rem] border-2 border-[#1a1716] bg-[#e8c2b8] p-4 shadow-[6px_6px_0_rgba(26,23,22,0.12)]">
                Local spots become your home base.
              </div>
            </div>
          </aside>
        </section>

        <section id="party-cta" className="mt-10">
          <div className="rounded-[2.2rem] border-2 border-[#1a1716] bg-[#1a1716] p-8 text-[#f7f1e7] shadow-[12px_12px_0_rgba(26,23,22,0.12)] md:p-12">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#f2cb71]" style={{ fontFamily: "var(--party-mono)" }}>
              CTA
            </p>
            <h2 className="mt-6 text-[3.2rem] leading-[0.82] md:text-[4.6rem]" style={{ fontFamily: "var(--party-display)" }}>
              JOIN THE SEASON.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75" style={{ fontFamily: "var(--party-body)" }}>
              Design exploration only. No backend changes. Just five new directions for the landing page lab.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="inline-flex items-center justify-center rounded-full bg-[#f2cb71] px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#1a1716] hover:-translate-y-0.5">
                Create an account
              </Link>
              <Link href="/sign-in" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#f7f1e7] hover:bg-white/12">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </main>
  );
}

export function ExplorationSite({ slug }: { slug: ExplorationSlug }) {
  if (slug === "current-draft") return <CurrentDraftSite />;
  if (slug === "v5-polaroid") return <V5PolaroidSite />;
  if (slug === "v5-dark") return <V5DarkSite />;
  if (slug === "campus-map") return <CampusMapSite />;
  if (slug === "cabaret-room") return <CabaretRoomSite />;
  if (slug === "common-room-radio") return <CommonRoomRadioSite />;
  if (slug === "crumbs-cafe") return <CrumbsCafeSite />;
  if (slug === "campus-after-dark") return <CampusAfterDarkSite />;
  if (slug === "field-guide") return <FieldGuideSite />;
  if (slug === "house-party-bulletin") return <HousePartyBulletinSite />;
  if (slug === "mrm-bw-overlap") return <MrmBrasilInspiredSite />;
  if (slug === "v12-scrapbook-studio") return <V12ScrapbookStudioSite />;
  if (slug === "v13-kitsch-computer-club") return <V13KitschComputerClubSite />;
  if (slug === "v14-adcker-index") return <V14AdckerIndexSite />;
  if (slug === "v15-campus-arcade") return <V15CampusArcadeSite />;
  if (slug === "v16-campus-crumbs") return <V16CampusCrumbsSite />;
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
              <div className="mt-6 grid gap-3 text-sm text-[#5b4c43]">
                <p>
                  <span className="font-mono text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#934a30]">
                    Type
                  </span>
                  <span className="ml-3">{version.typography}</span>
                </p>
                <p>
                  <span className="font-mono text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#934a30]">
                    Motion
                  </span>
                  <span className="ml-3">{version.motion}</span>
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
