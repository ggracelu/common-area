import { ActivityGrid } from "@/components/site/ActivityGrid";
import { DepositSection } from "@/components/site/DepositSection";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { SeasonPreview } from "@/components/site/SeasonPreview";
import { SocialProof } from "@/components/site/SocialProof";
import { WallySection } from "@/components/site/WallySection";
import { WhyCohorts } from "@/components/site/WhyCohorts";

export default function Home() {
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
        <WallySection />
        <DepositSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
