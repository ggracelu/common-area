import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Card } from "@/components/ui/Card";

export default function SeasonLoading() {
  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Card className="bg-white/82">
            <p className="text-sm font-medium text-[color:rgba(37,34,30,0.7)]">
              Loading the current Common Area season...
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
