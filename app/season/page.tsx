import { ActivityGrid } from "@/components/site/ActivityGrid";
import { DepositSection } from "@/components/site/DepositSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SeasonPreview } from "@/components/site/SeasonPreview";

export default function SeasonPage() {
  return (
    <>
      <Header />
      <main>
        <SeasonPreview />
        <ActivityGrid />
        <DepositSection />
      </main>
      <Footer />
    </>
  );
}
