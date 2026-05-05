# Common Area

Common Area is a seasonal, cohort-based social platform for Gen Z young adults in Chicago. It turns the city into a campus through recurring, interest-driven cohorts hosted by local businesses.

## Project Overview
This repository now includes the Phase 4 Supabase catalog foundation for Common Area plus Design System v1 implementation. The app has a polished public landing page, Clerk-powered sign-in and sign-up flows, protected route scaffolding, a real public season page backed by Supabase catalog data, and shared design tokens/primitives aligned with the Common Area brand direction. Payments, cohort logic, chat, and bingo persistence are still intentionally deferred.

Current scope:
- Base Next.js app structure
- Repo documentation and planning context
- Public landing page and brand system
- Clerk authentication and protected route scaffolding
- Minimal authenticated dashboard shell
- Supabase client utilities and catalog query helpers
- Initial schema and seed data for profiles, seasons, activities, and season_activities
- Public `/season` page backed by Supabase
- Design system documentation in `docs/DESIGN_SYSTEM.md`
- Shared UI primitives and global design tokens
- Environment template for future integrations

Not implemented yet:
- Stripe payment flow
- Activity selection
- Cohort assignment
- Chat
- Bingo prompts

## Current Project Phase
This repo is in Phase 4 with the initial Common Area design system now implemented across the public landing page and authenticated placeholder shell.

Brand note:
- The visible product is now `Common Area`.
- The repository and root folder remain named `whynot` for now to avoid unnecessary churn.

See:
- [AGENTS.md](./AGENTS.md)
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

3. Add Clerk and Supabase values to `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

6. Apply the initial Supabase schema manually:
- Run the SQL in `supabase/migrations/202604280001_catalog_foundation.sql`
- Then run `supabase/seed.sql`
- You can do this in the Supabase SQL editor or your preferred database workflow

7. Test the app locally:
- Visit `/sign-up` to create a test user in Clerk
- Visit `/sign-in` to authenticate
- Confirm protected routes like `/dashboard` redirect unauthenticated users to sign in
- Confirm the signed-in header shows `Dashboard`, `Season`, `Cohort`, `Bingo`, and the Clerk `UserButton`
- Visit `/season` to confirm the active season and six activities load from Supabase

## Available Commands
- `npm run dev` starts the local development server
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting files
- `npm run test` is a placeholder until a real test framework is added
- `npm run build` creates a production build

## Environment Variable Notes
Environment placeholders live in [`.env.example`](./.env.example).

These values are now required for local auth setup:
- `NEXT_PUBLIC_APP_URL`
- Clerk keys
- Clerk auth route vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- Stripe keys

Never commit real secrets. Follow the security and environment policies in [AGENTS.md](./AGENTS.md).

Design system note:
- `docs/DESIGN_SYSTEM.md` defines the current Common Area visual system
- Design tokens now live in `app/globals.css`
- Shared primitives in `components/ui` now provide the base button, card, badge, sticker, polaroid, and section-header patterns
- This pass did not change backend scope or add new product logic

Profile persistence is not implemented in this phase. Clerk user data is normalized into an in-memory preview shape only; the real `profiles` table integration will come later with Supabase.
Clerk still owns identity in this phase. Supabase `profiles` are prepared in schema only, and profile creation/upsert should remain a server-controlled flow in a later phase.

Mascot note:
- Common Area's mascot is now Crumbs the Cat, the resident lounge cat who makes the product feel familiar, cozy, and lightly funny without undermining trust or clarity.

## Repo Context
Before implementing features, read:
- [AGENTS.md](./AGENTS.md)
- [docs/PRODUCT_PLAN.md](./docs/PRODUCT_PLAN.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DATA_MODEL.md](./docs/DATA_MODEL.md)
- [docs/BUILD_PHASES.md](./docs/BUILD_PHASES.md)

## Parallel Agent Workflow

This project supports parallel development with multiple agents. See the following resources for coordination:

- [docs/AGENT_HANDOFF.md](docs/AGENT_HANDOFF.md) - Multichat workflow, branch strategy, and handoff guide
- [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) - Manual QA flows for all features
- [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md) - Security rules and checks
- [.board/](.board/) - Ticket board with all feature tickets

Before starting work, always read the relevant ticket in `.board/` and follow the agent handoff guide.
