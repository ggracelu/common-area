# WhyNot

WhyNot is a seasonal, cohort-based social platform for Gen Z young adults in Chicago. The core promise is simple: no swiping, just sign up and show up.

## Project Overview
This repository is currently in the bootstrap and tooling phase. The app is scaffolded with Next.js App Router, TypeScript, Tailwind CSS, and ESLint, but no product features are implemented yet.

Current scope:
- Base Next.js app structure
- Repo documentation and planning context
- Minimal branded starter homepage
- Environment template for future integrations

Not implemented yet:
- Clerk auth
- Supabase database logic
- Stripe payment flow
- Cohort assignment
- Chat
- Bingo prompts

## Current Project Phase
This repo is in Phase 1: Bootstrap repo and tooling.

See:
- [AGENTS.md](./AGENTS.md)
- [Product Plan](./docs/PRODUCT_PLAN.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Data Model](./docs/DATA_MODEL.md)
- [Build Phases](./docs/BUILD_PHASES.md)

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

2. Create a local env file when integrations are added later:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Available Commands
- `npm run dev` starts the local development server
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting files
- `npm run test` is a placeholder until a real test framework is added
- `npm run build` creates a production build

## Environment Variable Notes
Environment placeholders live in [`.env.example`](./.env.example).

These values are documented now but intentionally not wired up yet:
- `NEXT_PUBLIC_APP_URL`
- Clerk keys
- Supabase keys
- Stripe keys

Never commit real secrets. Follow the security and environment policies in [AGENTS.md](./AGENTS.md).

## Repo Context
Before implementing features, read:
- [AGENTS.md](./AGENTS.md)
- [docs/PRODUCT_PLAN.md](./docs/PRODUCT_PLAN.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/DATA_MODEL.md](./docs/DATA_MODEL.md)
- [docs/BUILD_PHASES.md](./docs/BUILD_PHASES.md)
