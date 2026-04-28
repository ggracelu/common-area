import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/site/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Join the season before the room fills up."
      description="Create your account now. Real season signup, deposits, and activity selection come next, but the Common Area auth foundation is ready."
    >
      <div className="flex justify-center py-4">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
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
          }}
        />
      </div>
    </AuthShell>
  );
}
