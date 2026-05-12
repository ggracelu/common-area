# Grader login

Use this page for **who signs in**, **with what credentials**, and **what the app should show** after login. For environment setup, database reset, and the full onboarding script, see [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md).

## Quick reference

Common Area grading uses **two separate Clerk flows**. Do not sign in on `/sign-in` when you mean to grade the partner preview, and do not use the member grader email on `/partner/sign-in`.

| Flow | Sign-in URL | Email | Password | After login |
|------|-------------|-------|----------|-------------|
| **Member season grader** | `/sign-in` | `grader@example.com` | `CAgr8r-9Qm!vT2wL6pX` | `/dashboard` (Summer 2026 member journey) |
| **Partner grader (Grader's Coffee)** | `/partner/sign-in` | `graders-coffee+clerk_test@example.com` | `CAPartner-8Qm!vT2wL6pX` | `/business/dashboard` (host onboarding + partner preview) |
| **Partner tester (Crumbs Cafe)** | `/partner/sign-in` | `crumbs-cafe+clerk_test@example.com` | `CAPartner-Cr7m!vT2wL6pX` | `/business/dashboard` (separate saved onboarding profile) |

Partner emails use the `+clerk_test` subaddress so Clerk development instances treat the inbox as a test address. No real email is delivered. If Clerk still asks for a verification code, enter **`424242`**.

On Vercel, set the matching `NEXT_PUBLIC_*_EMAIL_HINT` values so `/sign-in` and `/partner/sign-in` show the right callouts. Passwords stay in this doc and [`.env.example`](../.env.example), not in the UI.

## Shared member test account

Common Area uses one **shared Clerk test-mode account** for member grading and QA reruns. It is not a production user.

| Field | Value |
|-------|--------|
| Email | `grader@example.com` |
| Password | `CAgr8r-9Qm!vT2wL6pX` |
| Clerk username | `grader` (required on some Clerk instances; use email sign-in when the form allows it) |

Clerk rejects passwords that appear in public breach lists. If the sign-in form still complains, use **Sign in** (not Sign up) with the account already provisioned in Clerk, or ask an operator to reset the password in the Clerk dashboard and update `GRADER_CLERK_PASSWORD` in that environment’s env.

These values match [`.env.example`](../.env.example) (`GRADER_CLERK_EMAIL`, `GRADER_CLERK_PASSWORD`, `NEXT_PUBLIC_GRADER_EMAIL_HINT`). Operators copy them into `.env.local` for local dev and into the Vercel project for preview/production when grading on a deploy.

**Do not** use this account for real personal data. Rotate the password in Clerk if the test instance is shared outside your team.

## Partner preview grader account (Grader's Coffee)

Use a **second shared Clerk test account** to grade the partner preview (host onboarding and business dashboard). It is separate from the member grader account above.

| Field | Value |
|-------|--------|
| Business | Grader's Coffee |
| Email | `graders-coffee+clerk_test@example.com` |
| Password | `CAPartner-8Qm!vT2wL6pX` |
| Clerk username | `graders-coffee` (use email sign-in when the form allows it) |
| Supabase slug | `graders-coffee` in `partner_businesses` |

Use the `+clerk_test` subaddress so Clerk development instances treat the inbox as a test address. No real email is delivered; if the sign-in or sign-up flow still asks for a verification code, enter **`424242`**.

These values match [`.env.example`](../.env.example) (`PARTNER_GRADER_CLERK_EMAIL`, `PARTNER_GRADER_CLERK_PASSWORD`, `NEXT_PUBLIC_PARTNER_GRADER_EMAIL_HINT`).

After `npx supabase db reset`, provision or relink the shared partner Clerk accounts when users are missing or the database was recreated:

```bash
node scripts/provision-partner-accounts.mjs
```

The script creates or reuses the Clerk users, verifies `+clerk_test` addresses, and writes `clerk_user_id` on the `graders-coffee` partner row. Ten Chicago host businesses (including Grader's Coffee) are seeded from `supabase/seed_partner_businesses.sql`; the public gallery on `/partner` reads them from Supabase when env is aligned.

## Partner preview tester account (Crumbs Cafe)

Use a **third shared Clerk test account** when you want to walk partner onboarding with answers that persist in browser storage without disturbing the Grader's Coffee grader profile.

| Field | Value |
|-------|--------|
| Business | Crumbs Cafe |
| Email | `crumbs-cafe+clerk_test@example.com` |
| Password | `CAPartner-Cr7m!vT2wL6pX` |
| Clerk username | `crumbs-cafe` (use email sign-in when the form allows it) |

These values match [`.env.example`](../.env.example) (`PARTNER_TESTER_CLERK_EMAIL`, `PARTNER_TESTER_CLERK_PASSWORD`, `NEXT_PUBLIC_PARTNER_TESTER_EMAIL_HINT`). The same `node scripts/provision-partner-accounts.mjs` command provisions this account alongside Grader's Coffee.

## Partner onboarding sample answers

Use these values when grading the partner preview manually, or click **Apply sample answers** on `/business/dashboard` when signed in as the matching test account.

### Grader's Coffee (`graders-coffee+clerk_test@example.com`)

| Step | Field | Sample answer |
|------|-------|----------------|
| Business basics | Business name | Grader's Coffee |
| Business basics | Neighborhood | Wicker Park |
| Business basics | Category | Coffee shop |
| Business basics | Contact email | `graders-coffee+clerk_test@example.com` |
| Hosting preferences | Event types | Tasting or crawl; Listening or performance |
| Hosting preferences | Frequency | Biweekly |
| Hosting preferences | Typical group size | 10–15 guests |
| Partner plan | Monthly fee acknowledgement | Checked |
| Review | Complete onboarding | Submit |

### Crumbs Cafe (`crumbs-cafe+clerk_test@example.com`)

| Step | Field | Sample answer |
|------|-------|----------------|
| Business basics | Business name | Crumbs Cafe |
| Business basics | Neighborhood | Ukrainian Village |
| Business basics | Category | Coffee shop |
| Business basics | Contact email | `crumbs-cafe+clerk_test@example.com` |
| Hosting preferences | Event types | Hands-on workshop; Open studio night |
| Hosting preferences | Frequency | Weekly |
| Hosting preferences | Typical group size | 6–10 guests |
| Partner plan | Monthly fee acknowledgement | Checked |
| Review | Complete onboarding | Submit |

Partner onboarding progress is stored in browser `localStorage` keyed by Clerk user id. Use separate accounts so grader reruns and personal tester sessions do not overwrite each other.

## Partner testing controls (undo buttons)

When signed in on `/business/dashboard` as **Grader's Coffee** or **Crumbs Cafe**, a **Partner testing controls** panel appears for QA only. It is not a production host tool.

| Account | Apply sample answers (`data-testid`) | Reset partner onboarding (`data-testid`) |
|---------|--------------------------------------|------------------------------------------|
| Grader's Coffee | `partner-grader-apply-sample-onboarding` | `partner-grader-reset-onboarding` |
| Crumbs Cafe | `partner-tester-apply-sample-onboarding` | `partner-tester-reset-onboarding` |

**Apply sample answers** prefills the documented tables above for the active account. **Reset partner onboarding** clears browser-only partner preview state for that Clerk user and returns you to step 1. Confirm dialogs are expected.

## Where to sign in

### Member app (season grader)

| Environment | URL |
|-------------|-----|
| Local dev | `http://localhost:3000/sign-in` (or your `PLAYWRIGHT_LOCAL_BASE_URL`) |
| Production alias | `https://whynot-one.vercel.app/sign-in` |
| Preview deploy | Latest URL from `npm run preview:url` or the Vercel dashboard |

After a successful sign-in, Clerk redirects to **`/dashboard`**.

### Partner preview (business logins)

| Environment | URL |
|-------------|-----|
| Local dev | `http://localhost:3000/partner/sign-in` |
| Production alias | `https://whynot-one.vercel.app/partner/sign-in` |
| Preview deploy | Latest preview base URL + `/partner/sign-in` |

After a successful sign-in, Clerk redirects to **`/business/dashboard`**. Browse **`/partner`** without auth to review the host gallery and copy.

**Fresh partner session:** `/partner`, `/partner/sign-in`, and `/partner/sign-up` sign out any existing Clerk session before partner auth so a member grader login does not carry over. You do not need to sign out again on `/business/dashboard` once you are in the partner flow.

**Which business login to use:** sign in as **Grader's Coffee** for the canonical partner grader rerun and **Apply sample answers** on `/business/dashboard`. Sign in as **Crumbs Cafe** when you want a second saved onboarding profile without overwriting Grader's Coffee.

## Sign-in screen

When `NEXT_PUBLIC_GRADER_EMAIL_HINT` is set, `/sign-in` and `/sign-up` show a **Grader account** callout with the shared member email. The password is documented here and in the walkthrough, not in the UI.

When `NEXT_PUBLIC_PARTNER_GRADER_EMAIL_HINT` is set, `/partner/sign-in` shows a **Grader's Coffee** callout with the partner grader email. When `NEXT_PUBLIC_PARTNER_TESTER_EMAIL_HINT` is set, the same page shows a **Crumbs Cafe** personal tester callout. Passwords are documented here and in [`.env.example`](../.env.example), not in the UI.

You may **sign in** with each table above or **sign up once** with the same email and password if that user does not exist yet in that Clerk application.

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

## First screen after partner login: `/business/dashboard`

You should land on the **Partner preview** business dashboard (not the member season dashboard).

### Partner preview badge

Surfaces are labeled **Partner preview**. The monthly partner fee is explanatory only; no live partner billing or cohort assignment runs in this slice.

### Host onboarding

Until onboarding is complete, a multi-step flow collects business basics, hosting preferences, and subscription acknowledgement. Progress is stored in browser `localStorage` keyed by Clerk user id. Sample answers and testing-only undo controls are documented in [GRADER_LOGIN.md](./GRADER_LOGIN.md) under **Partner onboarding sample answers** and **Partner testing controls**.

### After onboarding

The business dashboard uses tabs: **Dashboard**, **Calendar**, **Analytics**, **Community**, and **Profile**.

- **Dashboard** — headline metrics, upcoming cohort nights, and the **What's next** panel.
- **Calendar** — past and upcoming events (sample preview data).
- **Analytics** — attendance, revenue/profit estimates, demographics, and per-event insights (sample preview data).
- **Community** — cross-host partnership ideas, guest profiles from past events, and the **Partner network** directory.
- **Profile** — read-only summary of onboarding answers for the signed-in host.

Sample calendar, analytics, and community content is illustrative only. Live cohort assignment, payouts, and CRM are out of scope for this preview.

### Public gallery

Open **`/partner`** while signed out to confirm the autoscrolling host gallery, Unsplash imagery, and the headline **Building community, 1 brick at a time**.

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
