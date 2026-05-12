function isLocalSupabaseUrl(url: string) {
  return /:\/\/(127\.0\.0\.1|localhost)([:/]|$)/.test(url) || url.includes(":54321");
}

function isHostedSupabaseUrl(url: string) {
  return url.includes(".supabase.co");
}

export function getSupabaseEnvContractWarning(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !secret) {
    return null;
  }

  if (isHostedSupabaseUrl(url) && secret.startsWith("sb_secret_")) {
    return [
      "NEXT_PUBLIC_SUPABASE_URL points at a hosted Supabase project, but SUPABASE_SECRET_KEY looks like a local CLI secret from `npx supabase status -o env`.",
      "Grader E2E and server-backed onboarding need all three values from the same project.",
      "For local grading, set NEXT_PUBLIC_SUPABASE_URL to http://127.0.0.1:54321 and copy the matching publishable + secret keys from `npx supabase status -o env` after `npx supabase db reset`.",
    ].join(" ");
  }

  if (isLocalSupabaseUrl(url) && secret.startsWith("eyJ")) {
    return [
      "NEXT_PUBLIC_SUPABASE_URL points at local Supabase, but SUPABASE_SECRET_KEY looks like a hosted JWT service-role key.",
      "Use the SECRET_KEY from `npx supabase status -o env` for local grading.",
    ].join(" ");
  }

  if (publishableKey && isLocalSupabaseUrl(url) && publishableKey.startsWith("eyJ")) {
    return [
      "NEXT_PUBLIC_SUPABASE_URL points at local Supabase, but NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY looks like a hosted anon JWT.",
      "Copy the publishable key from `npx supabase status -o env` alongside the matching SECRET_KEY.",
    ].join(" ");
  }

  if (publishableKey && isHostedSupabaseUrl(url) && publishableKey.startsWith("sb_publishable_")) {
    return [
      "NEXT_PUBLIC_SUPABASE_URL points at a hosted Supabase project, but NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY looks like a local CLI publishable key.",
      "Align URL, publishable key, and secret from the same Supabase project.",
    ].join(" ");
  }

  return null;
}
