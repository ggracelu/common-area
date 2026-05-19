# Common Area

Common Area is a seasonal, cohort-based social platform for Gen Z young adults in Chicago. It turns the city into a campus through recurring, interest-driven cohorts hosted by local businesses.

## Project Overview
This repository includes the Phase 4 Supabase catalog foundation for Common Area plus Design System v1 implementation. The app has a polished public landing page, Clerk-powered sign-in and sign-up flows, and shared design tokens/primitives aligned with the Common Area brand direction.

**Demo + server onboarding (v3)**:
- Signed-in flows use a **Supabase onboarding snapshot** when `SUPABASE_SECRET_KEY` is set (deposit, four activity picks, cohort assignment, reveal flag, bingo progress helpers).
- A **local demo layer** (`lib/demo-state.ts`) still powers chat composer persistence and presentation fallbacks; chat is explicitly demo-persisted in v3.
- **Grader controls** on dashboard, bingo, and cohort undo persisted stages for QA reruns.

Current scope:
- Base Next.js app structure
- Repo documentation and planning context
- Public landing page and brand system
- Clerk authentication and protected route scaffolding
- Authenticated dashboard, cohort, bingo, and profile surfaces
- Supabase client utilities, migrations, seeds, and catalog query helpers
- Server actions for deposits, activity selections, cohort assignment, reveal, bingo progress, and grader undo
- Design system documentation in `docs/DESIGN_SYSTEM.md`
- Shared UI primitives and global design tokens
- Playwright smoke, grader journey, and preview smoke projects
- Grader login, walkthrough, pitch readiness scorecard, and tooling friction notes in `docs/`

Still partial or environment-gated:
- Stripe live checkout (UI + routes exist; demo deposit path when checkout returns `501`)
- Cohort chat persistence in Postgres (demo localStorage in v3, labeled in UI)
- Production-grade assignment at scale (heuristic overlap bucketing for the prototype)

Authority note:
- When `SUPABASE_SECRET_KEY` is set, deposit, picks, matching, reveal, and roster state come from Supabase server snapshots on dashboard, bingo, and cohort.
- `lib/demo-state.ts` remains a local cache for chat composer messages and for signed-out or no-Secret-Key fallbacks; it does not override server onboarding gates.
- Paid deposit state is only shown from server/webhook-confirmed records. Stripe checkout is used when secrets exist; otherwise the demo deposit action writes paid state in Supabase.
- Stripe endpoints (`/api/checkout`, `/api/webhooks/stripe`) return `501` when Stripe secrets are missing.

Key files:
- `lib/demo-data.ts`: centralized sample businesses, events, cohorts, bingo tiles, and seeded chat messages
- `lib/demo-state.ts`: local demo cache (chat composer, presentation fallbacks when Supabase is not authoritative)
- `lib/onboarding.ts`: server onboarding snapshot for signed-in users

## Current Project Phase
This repo is in Phase 4+: catalog + design system plus a repeatable new-user demo with server-first onboarding when Supabase is configured.

Brand note:
- The visible product is **Common Area**.
- The GitHub repository is [`ggracelu/common-area`](https://github.com/ggracelu/common-area). The local folder may still be named `whynot` on disk until you rename it manually.
- Production deploy: **https://common-area-one.vercel.app** (legacy **https://whynot-one.vercel.app** still resolves). The hostname `common-area.vercel.app` is owned by another Vercel project and is not this app.

See:
- [AGENTS.md](./AGENTS.md)
- [Investor demo script](./docs/DEMO_SCRIPT.md)
- [Automation and eval](./docs/AUTOMATION_AND_EVAL.md)
- [Grader login](./docs/GRADER_LOGIN.md)
- [Grader walkthrough](./docs/GRADER_WALKTHROUGH.md)
- [Product Plan](./docs/PRODUCT_PLAN.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Data Model](./docs/DATA_MODEL.md)
- [Build Phases](./docs/BUILD_PHASES.md)
- [Design System](./docs/DESIGN_SYSTEM.md)

## Planned Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Clerk
- Supabase Postgres + RLS + Realtime
- Stripe test mode
- Vercel

## Local Setup
1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Add Clerk, Supabase, optional Stripe, and optional grader values to `.env.local` (see [`.env.example`](./.env.example)).

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

6. Reset and seed local Supabase (recommended for the new-user demo):

```bash
npx supabase db reset
```

Or apply migrations manually: run `supabase/migrations/202604280001_catalog_foundation.sql`, then `supabase/seed.sql`.

7. Test the app locally:
- Visit `/sign-up` to create a test user in Clerk (or use grader creds from `.env.local`)
- Visit `/sign-in` to authenticate
- Confirm protected routes like `/dashboard` redirect unauthenticated users to sign in
- Walk deposit → four picks → matching → Future letter → `/cohort` roster → bingo bonus (see [docs/GRADER_WALKTHROUGH.md](./docs/GRADER_WALKTHROUGH.md))

## Available Commands
- `npm run dev` starts the local development server
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting files
- `npm run test` runs local Playwright smoke (public routes)
- `npm run test:grader` runs the signed-in grader journey when `GRADER_CLERK_EMAIL` and `GRADER_CLERK_PASSWORD` are set
- `npm run test:preview` runs preview smoke when `PLAYWRIGHT_BASE_URL` is set
- `npm run test:install` installs Playwright Chromium if browsers are missing
- `npm run build` creates a production build

## Environment Variable Notes
Environment placeholders live in [`.env.example`](./.env.example).

These values are required for the server-first demo:
- `NEXT_PUBLIC_APP_URL`
- Clerk keys and auth route vars
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`

Optional:
- Stripe keys for live test checkout + webhook-confirmed deposits
- `GRADER_CLERK_EMAIL`, `GRADER_CLERK_PASSWORD`, and `NEXT_PUBLIC_GRADER_EMAIL_HINT` for grader sign-in callout and `npm run test:grader`

Never commit real secrets. Follow the security and environment policies in [AGENTS.md](./AGENTS.md).

Design system note:
- `docs/DESIGN_SYSTEM.md` defines the current Common Area visual system
- Design tokens now live in `app/globals.css`
- Shared primitives in `components/ui` provide the base button, card, badge, sticker, polaroid, and section-header patterns

Clerk owns identity; Supabase `profiles` are created server-side on signed-in flows when `SUPABASE_SECRET_KEY` is set.

Mascot note:
- Common Area's mascot is now Crumbs the Cat, the resident lounge cat who makes the product feel familiar, cozy, and lightly funny without undermining trust or clarity.

## Repo Context
Before implementing features, read:
- [AGENTS.md](./AGENTS.md)
- [docs/PRODUCT_PLAN.md](./docs/PRODUCT_PLAN.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DATA_MODEL.md](./docs/DATA_MODEL.md)
- [docs/BUILD_PHASES.md](./docs/BUILD_PHASES.md)
