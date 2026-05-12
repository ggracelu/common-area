# Grader walkthrough

Use this script to grade the Common Area prototype with persisted Supabase state, shared Clerk credentials, and per-stage undo controls.

## 1. Environment

1. Copy [`.env.example`](../.env.example) to `.env.local`.
2. Fill Clerk keys from the Clerk dashboard (test mode).
3. **Supabase env contract (local grader E2E):** after `npx supabase db reset`, copy **all three** values from the **same** local project:

```bash
npx supabase status -o env
```

Set in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` → `API_URL` (for example `http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → `PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` → `SECRET_KEY`

**Failure mode:** a hosted `NEXT_PUBLIC_SUPABASE_URL` (for example `https://….supabase.co`) paired with a local `sb_secret_…` from `npx supabase status` does **not** point at the same project. The dashboard badge stays **Local demo cache**, `npm run test:grader` fails on **Saved to your account**, and onboarding stays demo-authoritative even though `SUPABASE_SECRET_KEY` is set.

4. Create one Clerk **test-mode** user for grading and add to `.env.local`:
   - `GRADER_CLERK_EMAIL`
   - `GRADER_CLERK_PASSWORD`
   - `NEXT_PUBLIC_GRADER_EMAIL_HINT` (same email, safe to expose in the UI)
5. Playwright:
   - `PLAYWRIGHT_LOCAL_BASE_URL` for `npm run test:grader` (defaults to `http://localhost:3000`)
   - `PLAYWRIGHT_BASE_URL` for `npm run test:preview` — the **public** Vercel deploy of [ggracelu/whynot](https://github.com/ggracelu/whynot). Resolve the latest Preview `environment_url` with:

```bash
npm run preview:url
# or: gh api repos/ggracelu/whynot/deployments --jq '.[] | select(.environment=="Preview") | .id' | head -1 | xargs -I{} gh api repos/ggracelu/whynot/deployments/{}/statuses --jq '.[] | select(.state=="success") | .environment_url' | head -1
```

   Do **not** use `common-area.vercel.app`; that host is not this app. Preview smoke **skips** when `PLAYWRIGHT_BASE_URL` is unset or points at `localhost` / `127.0.0.1` (no false pass against local dev). If Vercel Deployment Protection returns **401**, set `VERCEL_AUTOMATION_BYPASS_SECRET` from the Vercel project or disable protection for the preview environment.

Playwright loads `.env.local` automatically for `npm run test:grader` and `npm run test:preview`, and **overrides** inherited shell `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SECRET_KEY` values so local grading matches the file contract above.

## 2. Database reset

```bash
npx supabase db reset
npm run dev
```

Seeds apply `seed.sql`, `seed_cohorts.sql`, and gamification seeds from migrations.

## 3. Sign in

1. Open `/sign-in`.
2. Sign in with the shared grader email and password (or sign up once with the same email).
3. Confirm `/dashboard` loads the onboarding checklist (`data-testid="grader-onboarding-checklist"`) and the **Saved to your account** badge (not **Local demo cache**).

## 4. Happy path

1. `/bingo` — pick 4 of 6 experiences, submit the card, then pay the deposit (`data-testid="join-season-deposit"`). Stripe checkout is used when configured; otherwise the grader deposit path records paid state in Supabase.
2. `/dashboard` — confirm matching runs from server state; open **Future** and finish the cohort letter (`data-testid="cohort-reveal-letter"`).
3. `/cohort` — roster visible (`data-testid="cohort-roster"`).
4. `/cohort/chat` — chat uses `chat_messages` when the migration is present; otherwise the unavailable/demo state is labeled in UI.
5. `/bingo` — bonus tiles unlock after assignment.

## 5. Undo for re-runs

On dashboard, bingo, or cohort, use **Grader controls** (`grader-undo-*`, `grader-reset-journey`) to rewind one stage or reset the full journey. Each undo updates Supabase and refreshes local demo cache.

Suggested order for manual re-tests: undo bingo → reveal → matching → picks → deposit, or **Reset full journey**.

## 6. QA commands

```bash
npm run typecheck
npm run build
npm run test
npm run test:install
npm run test:grader
PLAYWRIGHT_BASE_URL=<public-vercel-deploy> npm run test:preview
```

Install Playwright browsers once per machine with `npm run test:install` if `test` or `test:grader` report missing Chromium.

## Spec Kit

Living specs: [`.specify/features/onboarding-funnel.md`](../.specify/features/onboarding-funnel.md).

## Tooling friction

See [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) for what broke with parallel worktrees vs what landed in this repo.

## Pitch readiness

Track investor-pitch metrics in [PITCH_READINESS.md](./PITCH_READINESS.md).
