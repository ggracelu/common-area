import { SignUp } from "@clerk/nextjs";
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

export default function PartnerSignUpPage() {
  return (
    <MinimalAuthShell title="Create your business account.">
      <p className="mb-4 text-sm text-[color:rgba(37,34,30,0.78)]">
        Chicago small business owners can join the partner preview with a Common Area account. After sign-up you will
        finish host onboarding on the business dashboard.
      </p>
      <div className="flex justify-center py-4">
        <SignUp
          path="/partner/sign-up"
          routing="path"
          signInUrl="/partner/sign-in"
          fallbackRedirectUrl="/business/dashboard"
          appearance={clerkAppearance}
        />
      </div>
    </MinimalAuthShell>
  );
}
