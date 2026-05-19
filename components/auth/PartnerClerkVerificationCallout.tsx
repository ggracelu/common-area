import { CLERK_TEST_VERIFICATION_CODE } from "@/lib/demo-accounts";

/**
 * Always visible on partner auth routes. Business demo emails use +clerk_test;
 * Clerk development instances accept 424242 as the email verification code.
 */
export function PartnerClerkVerificationCallout() {
  return (
    <div
      className="mx-auto mb-4 max-w-2xl rounded-[1.25rem] border border-[color:rgba(200,120,60,0.35)] bg-[color:rgba(255,248,238,0.95)] px-4 py-3 text-sm text-[color:rgba(37,34,30,0.88)]"
      data-testid="partner-clerk-verification-callout"
    >
      <p className="font-semibold text-black">Business test email verification</p>
      <p className="mt-1">
        All business demo addresses end in <code className="rounded bg-black/5 px-1 text-xs">+clerk_test@example.com</code>.
        No real email is sent. If Clerk asks for a code during sign-in or sign-up, enter{" "}
        <span className="font-mono font-semibold text-black">{CLERK_TEST_VERIFICATION_CODE}</span> (six digits).
      </p>
      <p className="mt-2 text-xs text-black/60">
        Requires Clerk <span className="font-semibold">development</span> keys. Run{" "}
        <code className="rounded bg-black/5 px-1">npm run provision:demo-accounts</code> before a demo to pre-verify
        inboxes and reduce prompts.
      </p>
    </div>
  );
}
