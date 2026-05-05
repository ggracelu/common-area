import { headers } from "next/headers";
import { LandingExplorationGallery } from "@/components/site/LandingExplorationGallery";
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
import { ThirdPlaces } from "@/components/site/ThirdPlaces";
import { WhyCohorts } from "@/components/site/WhyCohorts";

async function MarketingLanding() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SeasonPreview />
        <WhyCohorts />
        <ThirdPlaces />
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

export default async function Home() {
  const host = (await headers()).get("host") ?? "";

  if (host.includes(":3001")) {
    return <LandingExplorationGallery />;
  }

  return <MarketingLanding />;
}
