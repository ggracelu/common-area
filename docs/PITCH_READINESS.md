# Pitch readiness scorecard

Living checklist for investor-pitch prototype quality. Update after Playwright grader runs or timed pitch dry-runs.

**Last trust verification:** 2026-05-19 (branch `main`, final-mile sprint); production **https://common-area-one.vercel.app**; repo **ggracelu/common-area**; investor script [DEMO_SCRIPT.md](./DEMO_SCRIPT.md); automation contract [AUTOMATION_AND_EVAL.md](./AUTOMATION_AND_EVAL.md); defect log [FINAL_MILE_QA.md](./FINAL_MILE_QA.md). Re-run eval ladder after each deploy.

## Pitch-ready gate

| Gate | Target | Current | Evidence |
|------|--------|---------|----------|
| Functional | 7/7 onboarding stages + 9/9 MVP pages + grader journey green locally | **Pass** | `npm run test:grader` pass (2026-05-12, 3/3 reruns); MVP manual matrix below; second-driver live demo not recorded |
| Operable | ≤8 min demo; preview smoke green; undo/reset verified | **Pass** | [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) investor cut ~7 min; preview smoke **5 tests** on `common-area-one` when `PLAYWRIGHT_BASE_URL` + bypass set; partner landing + business redirect covered |
| Experience | Crumbs + reduced motion; landing Lighthouse on pitch URL | **Partial** | `e2e/smoke.spec.ts` reduced-motion + Crumbs `aria-label`; pitch URL Lighthouse **blocked** (401); local mobile Lighthouse baseline 72 perf / 91 a11y |
| Trust | This scorecard + tooling friction doc linked from grader walkthrough | **Done** | Week 7 probes below; [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md), [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) |

**Sign-off:** **Partial — ready for investor demo on production** when Vercel Deployment Protection allows public access (see [FINAL_MILE_QA.md](./FINAL_MILE_QA.md) P0-1). Member path + partner preview documented; hide grader/partner QA controls during pitch. **Live second-driver** and **non-grader signup** still open.

## A. Functional completeness

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Onboarding stages | 7/7 without localStorage-only gates when Supabase configured | **Pass (E2E)** | `e2e/grader-journey.spec.ts` green on aligned local Supabase |
| MVP pages | 9/9 walkable in pitch script | **Pass (walked)** | Checklist below with hierarchy/copy/state notes |
| Persisted journey | ≥6/7 stages via Supabase (chat may stay demo-labeled) | **Pass** | `scripts/grader-db-spotcheck.mjs`: deposit `paid`, 4 picks, `cohort_members` + `reveal_seen_at`, `bingo_completions` ≥1 |
| Sample cohorts | ≥2 cohorts, 15–20 roster members on `/cohort` | **Seeded** | `supabase/seed_cohorts.sql`; roster asserted in grader spec |
| Cohort overlap story | ≥2 shared activity types vs four picks | **Pass (demo data)** | Each demo cohort exposes 2 `sharedEventTypeOverlap` types; grader’s first four activity tiles map to ≥2 overlapping types for the inferred cohort (see overlap audit) |
| Grader re-run | 6/6 undo actions + full reset | **Pass** | `scripts/grader-undo-all.mjs` after happy path; E2E covers matching/reveal/reset |

## B. Demo operability

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Live demo duration | ≤8 minutes | **Pass (estimated)** | Automated grader path ~10–13s; narrated pitch budget ~6 min with grader controls hidden |
| Demo recovery | ≤30 seconds per undo | **Pass (E2E)** | `grader-undo-*` / `grader-reset-journey` with 30s Playwright timeouts; server refresh after undo |
| Cold start | ≤15 minutes clone → signed-in checklist | **Not measured** | [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) |
| Preview confidence | 100% preview smoke when URL set | **Pass** | `PLAYWRIGHT_BASE_URL=$(npm run preview:url)` → `https://common-area-one.vercel.app` + `VERCEL_AUTOMATION_BYPASS_SECRET`; localhost/unset still **skips** (no false pass) |
| Critical path blockers | 0 “coming soon” on deposit → bingo path | **Pass (copy)** | No “coming soon” on deposit → bingo path in repo grep |

## C. UX and brand

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Automated regression | typecheck + build + grader suite green | **Pass** | typecheck + build + `npm run test` + `npm run test:grader` + `npm run test:preview` green (2026-05-12) |
| Crumbs surfaces | ≥4 interactive surfaces + aria labels | **Pass** | Landing sticky + Meet Crumbs; dashboard mailroom; bingo deposit handoff; cohort reveal; `CrumbsWorking` / `Crumbs.tsx` `aria-label` |
| Reduced motion | Crumbs loops respect `prefers-reduced-motion` | **Pass** | `e2e/smoke.spec.ts`, grader `emulateMedia` |
| Primary flow a11y | 0 critical keyboard gaps on core routes | **Pass (code)** | Deposit `role="dialog"`; assignment `role="alert"`; chat form submit + saved/retry status; no blocking gaps found on deposit → assignment → chat → bingo bonus |
| Landing Lighthouse | perf ≥80, a11y ≥90 mobile `/` | **Exception** | Pitch URL unreachable (401). Local mobile Lighthouse on `http://127.0.0.1:3000/`: **perf 72**, **a11y 91** — perf gap: hero Unsplash collage + client motion; re-run on public URL after bypass |
| Design system | MASTER-aligned trust pass on dashboard, season card, cohort, chat | **Pass (code)** | Ink/paper/lime/blue/magenta, mono chips, transform/opacity motion, no WebGL mascot; authority copy on server vs local vs pending vs error |

### Week 7 Design Trust Pass

| Surface | Status | Notes |
|---------|--------|-------|
| MASTER alignment | **Pass** | Bulletin-board cards, season rail, mono chips; single **Open season card** entry to `/bingo`. |
| Critical-path copy | **Pass** | 4-of-6 contract; **Saved to your account** vs **Local demo cache**; deposit handoff paid/pending/failed/refunded; assignment running/error; chat server vs local vs unavailable. |
| A11y on deposit / assignment / chat | **Pass** | `bingo-deposit-handoff` `role="dialog"` + labelled title; assignment banner + mailroom error `role="alert"`; chat send/saved/retry + `type="submit"`. |
| Remaining blocker | **Open** | Vercel Deployment Protection (401) without bypass; live second-driver demo; pitch URL Lighthouse; timed investor dry-run not logged in DEMO_SCRIPT |

### Week 7 auth / data surface probes (2026-05-12)

| Probe | Expected | Result |
|-------|----------|--------|
| `POST /api/checkout` signed out | 401 | **401** |
| `GET /dashboard` signed out | Redirect to sign-in | **307** |
| Clerk `proxy.ts` matcher | `/api/*` in middleware | **Pass** |
| Anon REST read `deposits`, `profiles`, `chat_messages` | No rows | **Pass** |
| Anon REST insert `chat_messages` | Blocked | **Pass** (RLS `42501`) |
| Paid deposit without server | UI must not claim paid | **Pass (local grader)** | `/api/checkout` records via server action; handoff shows paid after server record |

## D. Engineering trust

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Playwright grader coverage | ≥1 assertion per onboarding stage + undo | **Pass** | `e2e/grader-journey.spec.ts` green (2026-05-12) |
| Spec alignment | onboarding-funnel scenarios mapped to tests | **Partial** | Scenarios in `.specify/features/*`; chat/bingo specs ahead of full green run |
| Auth / data guardrails | privileged writes via server actions only | **Pass (code)** | `app/actions/*`, `lib/chat.ts` |
| Tooling artifact | TOOLING_FRICTION with ≥3 failure modes | **Done** | [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) |
| Secrets management | Environment-specific keyrings, no preview→prod DB | **Pass (code)** | `lib/secrets.ts`, [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) |
| RLS policies | Member-scope access, client writes blocked | **Pass (local)** | deposit + chat migrations |
| Payment security | Server-recorded deposit in local; webhook in preview/prod | **Partial** | Demo deposit via `/api/checkout`; Stripe webhook `501` when secrets stripped in Playwright `webServer` |

## MVP page checklist (pitch script)

- [x] **Landing `/`** — Editorial hero, Summer 2026 kicker, deposit/pick/cohort metrics, Crumbs on sticky note + Meet Crumbs (`aria-label`). Footer updated to Summer 2026 prototype copy (final mile).
- [x] **Partner `/partner` + `/business/dashboard`** — Host gallery, onboarding, five-tab preview dashboard; sample data labeled; unsigned business route → partner sign-in.
- [x] **Sign-in `/sign-in`** — `MinimalAuthShell`, Clerk tokens, optional `grader-sign-in-callout`. Signed-out users redirect from `/dashboard`.
- [x] **Sign-up `/sign-up`** — Same shell as sign-in; optional `grader-sign-up-callout` when `NEXT_PUBLIC_GRADER_EMAIL_HINT` is set.
- [x] **Season / deposit handoff (bingo + checkout)** — Submit → fold animation → `bingo-deposit-handoff` dialog with authority copy, `join-season-deposit`, server vs local paid labels; reduced-motion skips fold loops.
- [x] **Activity selection `/bingo`** — 4-of-6 contract, autosave status (saving/saved/error), locked passport after commit; bonus tiles gated until assignment.
- [x] **Assignment pending `/dashboard` Current** — Season rail, checklist `data-testid`s, mailroom animation, assignment error alert + retry; Future tab locked until assignment.
- [x] **Cohort dashboard `/cohort`** — Roster at cohort scale, overlap card (2 types), “why matched” bullets; pre-reveal gate points to Dashboard Future.
- [x] **Cohort chat `/cohort/chat`** — `cohort-chat-demo-label` (Postgres vs local vs unavailable); locked state before assignment; send/saved/retry on composer.
- [x] **Bingo bonus `/bingo` post-assignment** — Bonus stamp with server save status (`bingo-bonus-save-status`); grader journey asserts persist + unstamp.

## Cohort overlap audit (demo narrative)

| Cohort | Shared types (≥2) | Season activity types (6) | Grader default four picks (first Activity tiles) | Overlap vs picks |
|--------|-------------------|----------------------------|------------------------------------------------|------------------|
| The Art Room Regulars | pottery, cafe | pottery, walking-tour, cafe, board-games, cooking, comedy | pottery, mural walk, café crawl, board games | **2** (pottery, cafe) |
| Table + Laughs Department | cooking, comedy | (same six) | pasta + comedy path if chosen | **2** when both food + laughs picks |
| Neighborhood Strollers Union | walking-tour, board-games | (same six) | mural + board games path | **2** (walking-tour, board-games) |

`inferCohortFromSelections` scores cohort buckets from pick `activityType`s; each cohort’s UI overlap card and `whyThisCohortWorks` lines reference **two** shared types, satisfying the ≥2-type demo story against four picks.

## Spec traceability

| Scenario (onboarding-funnel) | Automated | Manual |
|------------------------------|-----------|--------|
| Profile bootstrap on dashboard | `e2e/grader-journey.spec.ts` | Grader walkthrough §3 |
| Paid deposit + four picks | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Future letter marks reveal | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Cohort roster on `/cohort` | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Undo matching regression | `e2e/grader-journey.spec.ts` | Grader walkthrough §5 |

## Manual verification matrix (2026-05-12)

| Stage | Route / artifact | Result | Notes |
|-------|------------------|--------|-------|
| Discover + auth | `/` → `/sign-in` | **Pass** | Preview smoke + local grader storage state |
| Deposit | `/bingo` handoff | **Pass** | `bingo-deposit-handoff` shows **Paid** after `/api/checkout` (200/501) |
| Four picks | `/bingo` | **Pass** | Autosave **Saved to your account**; tile modal closes via `bingo-tile-close` |
| Matching | `/dashboard` Current | **Pass** | Checklist deposit/picks/matching **Done** |
| Reveal | `/dashboard` Future | **Pass** | `cohort-reveal-letter` → **Enter your common room** |
| Cohort room | `/cohort` | **Pass** | `cohort-roster` visible |
| Chat | `/cohort/chat` | **Pass** | `cohort-chat-demo-label` (Postgres-backed when migration applied) |
| Bingo bonus | `/bingo` | **Pass** | `bingo-bonus-save-status` saved + unstamp after reload |
| Undo / reset | Grader panel | **Pass** | Six `grader-undo-*` + `grader-reset-journey` (288–1090ms each); E2E matching/reveal/reset |

**Timed dry-run:** single-operator grader script **~10s** wall-clock (`prefers-reduced-motion`); narrated pitch budget **~6 min** with grader controls hidden.

**Gaps this pass:** no live second-driver session; no separate Clerk signup outside the shared grader account (happy path exercised via grader storage + `scripts/grader-db-spotcheck.mjs`).

## Automated command log (2026-05-12 PM)

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npm run test` | Pass (3/3 local smoke) |
| `npx supabase db reset` | Pass (before grader) |
| `npm run test:grader` | Pass (1/1, ~10.2s; **Saved to your account** on dashboard) |
| `npm run test:preview` | Pass (3/3) with `PLAYWRIGHT_BASE_URL=https://common-area-one.vercel.app` + bypass secret |
| `node scripts/grader-db-spotcheck.mjs` | Pass (deposit/picks/cohort/reveal/bingo rows) |
| `node scripts/grader-undo-all.mjs` | Pass (6 undo + reset, all ≤30s) |
| Mobile Lighthouse `/` (pitch URL) | **Not run** — optional after bypass |
| Mobile Lighthouse `/` (local `127.0.0.1:3000`) | **perf 72**, **a11y 91** (prior baseline) |

## ≤8 minute dry-run script (grader)

1. Sign in → dashboard checklist (**Saved to your account**) — ~1 min with narrative.
2. `/bingo` — four picks, submit, deposit handoff — ~2 min.
3. `/dashboard` Current → Future letter → cohort — ~2 min.
4. `/cohort/chat` send + `/bingo` bonus stamp — ~1 min.
5. Optional undo one stage via grader panel — ≤30s per stage (E2E-verified).

**Investor demo:** See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) (member loop + partner tabs; hide grader chrome).

**Recovery:** `grader-reset-journey` or stage `grader-undo-*` on dashboard, bingo, or cohort when server authoritative.
