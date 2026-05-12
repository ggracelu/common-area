import { SignIn } from "@clerk/nextjs";
import { MinimalAuthShell } from "@/components/site/MinimalAuthShell";

const clerkAppearance = {
  elements: {
    card: "shadow-none bg-transparent",
    rootBox: "w-full",
    formButtonPrimary:
      "rounded-[var(--radius-button)] bg-[var(--color-foreground)] text-[var(--color-paper)] shadow-[var(--shadow-button)] hover:bg-[var(--color-accent-dark)]",
    footerActionLink: "text-[var(--color-accent)] hover:text-[var(--color-accent-dark)]",
    formFieldInput:
      "rounded-[1rem] border-[var(--color-line)] bg-white/70 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]",
    formFieldLabel: "text-[var(--color-foreground)]",
  },
};

const partnerGraderEmailHint = process.env.NEXT_PUBLIC_PARTNER_GRADER_EMAIL_HINT?.trim();
const partnerTesterEmailHint = process.env.NEXT_PUBLIC_PARTNER_TESTER_EMAIL_HINT?.trim();

export default function PartnerSignInPage() {
  return (
    <MinimalAuthShell title="Sign in to your business account.">
      <p className="mb-4 text-sm text-[color:rgba(37,34,30,0.78)]">
        Partner sign-in starts from a fresh Clerk session on this page. Choose the partner grader or tester account you
        want to use, then continue to the business dashboard.
      </p>
      {partnerGraderEmailHint ? (
        <div
          className="mx-auto mb-4 max-w-md rounded-[1.25rem] border border-black/10 bg-white/75 px-4 py-3 text-sm text-[color:rgba(37,34,30,0.78)]"
          data-testid="partner-grader-sign-in-callout"
        >
          <p className="font-semibold text-black">Grader&apos;s Coffee</p>
          <p className="mt-1">
            Partner grader login: <span className="font-semibold">{partnerGraderEmailHint}</span> with the shared test
            password in <code className="rounded bg-black/5 px-1 py-0.5 text-xs">.env.example</code>. If Clerk asks for
            an email code, use <span className="font-semibold">424242</span> for <code>+clerk_test</code> addresses.
          </p>
        </div>
      ) : null}
      {partnerTesterEmailHint ? (
        <div
          className="mx-auto mb-4 max-w-md rounded-[1.25rem] border border-black/10 bg-white/75 px-4 py-3 text-sm text-[color:rgba(37,34,30,0.78)]"
          data-testid="partner-tester-sign-in-callout"
        >
          <p className="font-semibold text-black">Crumbs Cafe</p>
          <p className="mt-1">
            Personal tester login: <span className="font-semibold">{partnerTesterEmailHint}</span> with the shared test
            password in <code className="rounded bg-black/5 px-1 py-0.5 text-xs">.env.example</code>. Use this account
            when you want onboarding answers to persist without disturbing the grader profile.
          </p>
        </div>
      ) : null}
      <div className="flex justify-center py-4">
        <SignIn
          path="/partner/sign-in"
          routing="path"
          signUpUrl="/partner/sign-up"
          fallbackRedirectUrl="/business/dashboard"
          appearance={clerkAppearance}
        />
      </div>
    </MinimalAuthShell>
  );
}
