import { notFound } from "next/navigation";
import {
  ExplorationSite,
  explorationVersions,
} from "@/components/site/LandingExplorationGallery";

export function generateStaticParams() {
  return explorationVersions.map((version) => ({ slug: version.slug }));
}

export default async function ExplorationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const version = explorationVersions.find((item) => item.slug === slug);

  if (!version) {
    notFound();
  }

  return <ExplorationSite slug={version.slug} />;
}
