import { AppShell } from "@/components/app/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";

export default async function ProfilePage() {
  return (
    <AppShell
      title="Profile foundation"
      description="This page previews the future profiles surface. Clerk server keys are required to show real user data in production."
    >
      <Card variant="scrapbook" className="max-w-3xl">
        <Badge variant="sky">Placeholder</Badge>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Clerk user id</dt>
            <dd className="mt-1 text-base font-medium">—</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Email</dt>
            <dd className="mt-1 text-base font-medium">—</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Display name</dt>
            <dd className="mt-1 text-base font-medium">—</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Avatar url</dt>
            <dd className="mt-1 break-all text-base font-medium">—</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[color:rgba(37,34,30,0.62)]">Onboarding status</dt>
            <dd className="mt-1 text-base font-medium">created</dd>
          </div>
        </dl>
        <Sticker className="mt-6">Crumbs believes in low-pressure setup.</Sticker>
      </Card>
    </AppShell>
  );
}
