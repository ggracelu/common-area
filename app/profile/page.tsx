import { currentUser } from "@clerk/nextjs/server";
import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { buildProfilePreviewFromClerkUser } from "@/lib/profile";

export default async function ProfilePage() {
  const user = await currentUser();
  const profilePreview = buildProfilePreviewFromClerkUser(user);

  return (
    <AppShell
      title="Profile foundation"
      description="This page previews how Clerk user data will map into the future Common Area profiles table once Supabase arrives."
    >
      <Card variant="scrapbook" className="max-w-3xl">
        <Badge variant="sky">In-memory preview only</Badge>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Clerk user id</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.clerkUserId ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Email</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.email ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Display name</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.displayName ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Avatar url</dt>
            <dd className="mt-1 break-all text-base font-medium">{profilePreview.avatarUrl ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Onboarding status</dt>
            <dd className="mt-1 text-base font-medium">{profilePreview.onboardingStatus}</dd>
          </div>
        </dl>
        <Sticker className="mt-6">Crumbs believes in low-pressure setup.</Sticker>
      </Card>
    </AppShell>
  );
}
