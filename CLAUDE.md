# Claude project guide — Common Area

Read [AGENTS.md](./AGENTS.md) first for engineering guardrails, stack, security, and RLS rules. This file adds **product strategy** and **priorities** for Claude-assisted work in the **common-area** repository (product name: **Common Area**).

## Mission

Help Gen Z young adults in Chicago rebuild a **campus feeling** after college through **seasonal, interest-driven cohorts** hosted by local businesses—repeated presence, familiar faces, and a social rhythm anchored in real neighborhood spaces.

**Core promise:** turn your city into a campus.

Repository and npm package are **common-area**; the product name is **Common Area**. Do not rename the local checkout folder or Vercel project again unless explicitly asked.

## Strategic canon

| Document | Use |
|----------|-----|
| [docs/COMMUNITY_PLAY_RESEARCH.md](./docs/COMMUNITY_PLAY_RESEARCH.md) | Competitors, Gen Z / third-place research, play-as-unlock, format experiments, community metrics |
| [docs/PRODUCT_PLAN.md](./docs/PRODUCT_PLAN.md) | MVP journey, constraints, non-goals |
| [docs/GAMIFICATION.md](./docs/GAMIFICATION.md) | Prompt types, presence, quests, schema sketch |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) + [design-system/MASTER.md](./design-system/MASTER.md) | Visual and voice direction |
| [.specify/constitution.md](./.specify/constitution.md) | Auth, data authority, Crumbs vs WebGL chrome |
| [docs/GRADER_WALKTHROUGH.md](./docs/GRADER_WALKTHROUGH.md) | Repeatable new-user demo and QA commands |

## Product hierarchy

1. **Core product** — Over a season, strangers in a stable cohort become familiar faces through **repeat encounters** at shared third places, helped by **light play** (prompts, rituals, co-presence)—not by opaque matching magic.
2. **Infrastructure** — Onboarding must be server-durable when Supabase is configured: deposit, four picks, assignment, reveal, roster, bingo progress helpers. Chat may stay demo-labeled until Postgres chat ships.
3. **Later** — Business-facing host experience (predictable repeat customers for small businesses). Document and stub only until the consumer loop proves retention.

**Anti-goals:** swipe/dating UX, one-off stranger dinners as the whole story, infinite city marketplace, gamification that feels like homework or XP grind.

## Positioning vs facilitators

[222](https://222.place/) and [Timeleft](https://timeleft.com/) optimize **facilitated first encounters** at scale. Common Area optimizes **encounters 4–12**: same cohort, chosen interests, recurring **areas** (hosts). See [docs/COMMUNITY_PLAY_RESEARCH.md](./docs/COMMUNITY_PLAY_RESEARCH.md) for sources and teardown.

## Bingo and play

The bingo card is a **foundation** (onboarding discovery + seasonal metaphor), not the ceiling. Push toward **relationship and place legibility**: recognition, co-presence, cohort challenges, host rituals, season archive. Prefer metrics in the research doc (returns, co-attendance, chat depth) over stamp completion alone.

When extending features, update [.specify/features/](./.specify/features/) scenarios and link tests in [e2e/](./e2e/) where appropriate.

## Implementation defaults

- Next.js App Router, TypeScript, Tailwind; Clerk auth; Supabase Postgres + RLS; privileged writes via server actions only.
- When `SUPABASE_SECRET_KEY` is set, onboarding gates on dashboard, bingo, and cohort follow the **server snapshot**; `lib/demo-state.ts` is cache or labeled fallback (especially chat), not authority over assignment or reveal.
- Crumbs is **pixel-art** mascot; shader/glass layers are atmospheric chrome only ([.specify/constitution.md](./.specify/constitution.md)).
- Preserve grader `data-testid` hooks when changing UI unless QA docs are updated.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:install   # if Playwright browsers missing
npm run test:grader    # requires GRADER_CLERK_* in env
```

Local Supabase: `npx supabase db reset` before a clean new-user or grader run when testing persisted state.

## Tone

Warm, editorial, youthful, trustworthy, communal—**campus common room**, not nightlife marketplace or generic SaaS. Crumbs: cozy, observant, quietly funny, low-pressure.
