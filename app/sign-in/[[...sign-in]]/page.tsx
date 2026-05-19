import { SignIn } from "@clerk/nextjs";
import { DemoAccountPanel } from "@/components/auth/DemoAccountPanel";
import { MinimalAuthShell } from "@/components/site/MinimalAuthShell";

const graderEmailHint = process.env.NEXT_PUBLIC_GRADER_EMAIL_HINT?.trim();

export default function SignInPage() {
  return (
    <MinimalAuthShell title="Sign in.">
      {graderEmailHint ? (
        <div
          className="mx-auto mb-4 max-w-md rounded-[1.25rem] border border-black/10 bg-white/75 px-4 py-3 text-sm text-[color:rgba(37,34,30,0.78)]"
          data-testid="grader-sign-in-callout"
        >
          <p className="font-semibold text-black">Grader account</p>
          <p className="mt-1">
            Use <span className="font-semibold">{graderEmailHint}</span> with the shared test password in{" "}
            <code className="rounded bg-black/5 px-1 py-0.5 text-xs">docs/GRADER_LOGIN.md</code>. Signing up with
            the same email works for grading.
          </p>
        </div>
      ) : null}
      <DemoAccountPanel variant="member" />
      <div className="flex justify-center py-4">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
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
    </MinimalAuthShell>
  );
}
