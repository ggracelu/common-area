import { createServerSupabasePublicClient } from "@/lib/supabase/server";
import { partnerBusinesses, type PartnerBusiness } from "@/lib/business-partners";

type PartnerBusinessRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  neighborhood: string;
  host_summary: string;
  cadence: string;
  group_size: string;
  image_url: string;
  accent_token: string;
  is_grader: boolean;
};

function mapPartnerRow(row: PartnerBusinessRow): PartnerBusiness {
  return {
    id: row.slug,
    name: row.name,
    neighborhood: row.neighborhood,
    category: row.category,
    hostSummary: row.host_summary,
    cadence: row.cadence,
    groupSize: row.group_size,
    accent: row.accent_token,
    imageUrl: row.image_url,
    isGrader: row.is_grader,
  };
}

export async function getPartnerBusinesses(): Promise<PartnerBusiness[]> {
  try {
    const supabase = createServerSupabasePublicClient();
    const { data, error } = await supabase
      .from("partner_businesses")
      .select(
        "id, slug, name, category, neighborhood, host_summary, cadence, group_size, image_url, accent_token, is_grader",
      )
      .order("display_order", { ascending: true });

    if (error || !data?.length) {
      return partnerBusinesses;
    }

    return data.map((row) => mapPartnerRow(row as PartnerBusinessRow));
  } catch {
    return partnerBusinesses;
  }
}
