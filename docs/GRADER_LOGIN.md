# Grader login

Use this page for **who signs in**, **with what credentials**, and **what the app should show** after login. For environment setup, database reset, and the full onboarding script, see [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md).

## Shared test account

Common Area uses one **shared Clerk test-mode account** for grading and QA reruns. It is not a production user.

| Field | Value |
|-------|--------|
| Email | `grader@example.com` |
| Password | `CAgr8r-9Qm!vT2wL6pX` |

Clerk rejects passwords that appear in public breach lists. If the sign-in form still complains, use **Sign in** (not Sign up) with the account already provisioned in Clerk, or ask an operator to reset the password in the Clerk dashboard and update `GRADER_CLERK_PASSWORD` in that environment’s env.
| Clerk username | `grader` (required on some Clerk instances; use email sign-in when the form allows it) |

These values match [`.env.example`](../.env.example) (`GRADER_CLERK_EMAIL`, `GRADER_CLERK_PASSWORD`, `NEXT_PUBLIC_GRADER_EMAIL_HINT`). Operators copy them into `.env.local` for local dev and into the Vercel project for preview/production when grading on a deploy.

**Do not** use this account for real personal data. Rotate the password in Clerk if the test instance is shared outside your team.

## Where to sign in

| Environment | URL |
|-------------|-----|
| Local dev | `http://localhost:3000/sign-in` (or your `PLAYWRIGHT_LOCAL_BASE_URL`) |
| Production alias | `https://whynot-one.vercel.app/sign-in` |
| Preview deploy | Latest URL from `npm run preview:url` or the Vercel dashboard |

After a successful sign-in, Clerk redirects to **`/dashboard`**.

## Sign-in screen

When `NEXT_PUBLIC_GRADER_EMAIL_HINT` is set, `/sign-in` and `/sign-up` show a **Grader account** callout with the shared email. The password is documented here and in the walkthrough, not in the UI.

You may **sign in** with the table above or **sign up once** with the same email and password if the user does not exist yet in that Clerk application.

## First screen after login: `/dashboard`

You should land on the **Summer 2026** dashboard with the following cues.

### Authority badge (top of dashboard)

| Badge | Meaning |
|-------|---------|
| **Saved to your account** | Supabase is configured and the server onboarding snapshot is authoritative for deposit, picks, matching, reveal, and roster. |
| **Local demo cache** | The app is **not** reading a aligned server snapshot (missing `SUPABASE_SECRET_KEY`, or Supabase URL and secret from different projects). Do not treat onboarding as persisted until env is fixed. |

If you expect server-backed grading locally, run `npx supabase db reset`, align all three Supabase values from `npx supabase status -o env` in `.env.local`, and restart `npm run dev`.

### Season progress rail

A horizontal rail summarizes **deposit → four picks → matching → letter → cohort room** with done/pending styling for the active season.

### Onboarding checklist

A checklist lists the same stages with **Done** or **Pending** per row (`grader-onboarding-checklist`). On a **fresh** database after reset, deposit and picks are typically **Pending** until you complete `/bingo`.

### Tabs

- **Current** — assignment mailroom, season context, and checklist while matching runs.
- **Future** — cohort reveal letter after assignment; locked until the server records an assignment.

### Grader controls

When the server snapshot is authoritative, a **Grader controls** panel appears on **dashboard**, **bingo**, and **cohort**. Use it to undo one onboarding stage or **Reset full journey** for another full pass. Confirm dialogs are expected.

## What to do next (happy path)

1. **`/bingo`** — Pick **4 of 6** experiences, submit the card, complete the **$20 deposit** handoff (`join-season-deposit`). On local dev without Stripe, the grader path records a paid deposit in Supabase.
2. **`/dashboard`** — Confirm checklist rows move to **Done** for deposit, picks, and matching; open **Future** and finish the cohort letter.
3. **`/cohort`** — Confirm the roster loads for your assigned cohort.
4. **`/cohort/chat`** — Read the status banner: Postgres-backed thread when configured, or a clearly labeled demo/unavailable state.
5. **`/bingo`** — After assignment, bonus tiles unlock; stamping should show account-backed save status when the server is authoritative.

Step-by-step detail, undo order, and automated checks: [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md).

## Returning grader vs fresh season

- **Same Clerk user, reset database** — Sign in again; use **Reset full journey** if the checklist is not at deposit **Pending**.
- **New browser or deploy** — Same email and password; ensure that environment’s Clerk app includes the grader user (create once in Clerk test mode if needed).

## If login fails

- Confirm Clerk **test** keys for the environment you are hitting (local `.env.local` vs Vercel env vars).
- On Vercel, add the deploy URL to Clerk allowed origins and redirect URLs.
- If the dashboard shows **Local demo cache** on a machine with Supabase configured, fix the Supabase trio mismatch described in [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) §1.

## Related docs

- [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) — setup, happy path, undo, Playwright
- [PITCH_READINESS.md](./PITCH_READINESS.md) — verification scorecard
- [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) — known tooling pitfalls
