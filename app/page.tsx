import { headers } from "next/headers";
import { LandingExplorationGallery } from "@/components/site/LandingExplorationGallery";
import { V16CampusCrumbsSite } from "@/components/site/explorations/V16CampusCrumbs";

export default async function Home() {
  const host = (await headers()).get("host") ?? "";

  if (host.includes(":3001")) {
    return <LandingExplorationGallery />;
  }

  return <V16CampusCrumbsSite />;
}
