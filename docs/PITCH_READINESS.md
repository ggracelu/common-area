# Pitch readiness scorecard

Living checklist for investor-pitch prototype quality. Update after Playwright grader runs or timed pitch dry-runs.

**Last trust verification:** 2026-05-12 (local Supabase trio aligned to `http://127.0.0.1:54321`; grader E2E green after deposit handoff + tile-close fixes).

## Pitch-ready gate

| Gate | Target | Current | Evidence |
|------|--------|---------|----------|
| Functional | 7/7 onboarding stages + 9/9 MVP pages + grader journey green locally | **Partial** | `npm run test:grader` pass (2026-05-12); MVP pages not manually walked |
| Operable | ≤8 min demo; preview smoke green; undo/reset verified | **Partial** | Preview smoke **fails** on Vercel Deployment Protection (401) until `VERCEL_AUTOMATION_BYPASS_SECRET` or protection is disabled; undo/reset covered in grader spec, not manually timed |
| Experience | Crumbs + reduced motion; landing Lighthouse on pitch URL | **Partial** | `e2e/smoke.spec.ts` reduced-motion + Crumbs `aria-label`; Lighthouse not run |
| Trust | This scorecard + tooling friction doc linked from grader walkthrough | **Partial** | Week 7 probes below; [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md), [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) |

**Sign-off:** **No** — preview smoke has not passed against a reachable public deploy (latest Preview URL returns Vercel 401 without bypass); manual fresh-user + second-driver demo not completed. **Local grader E2E is green** on aligned Supabase + grader credentials.

## A. Functional completeness

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Onboarding stages | 7/7 without localStorage-only gates when Supabase configured | **Pass (E2E)** | `e2e/grader-journey.spec.ts` green on aligned local Supabase |
| MVP pages | 9/9 walkable in pitch script | **Not verified** | Manual checklist below unchecked |
| Persisted journey | ≥6/7 stages via Supabase (chat may stay demo-labeled) | **Partial** | Code + specs: deposit/picks/matching/reveal/roster/bingo via server; chat via `chat_messages` when assigned |
| Sample cohorts | ≥2 cohorts, 15–20 roster members on `/cohort` | **Seeded** | `supabase/seed_cohorts.sql`; roster asserted in grader spec when run completes |
| Cohort overlap story | ≥2 shared activity types vs four picks | **Not verified** | No manual overlap audit this pass |
| Grader re-run | 6/6 undo actions + full reset | **Partial** | Spec covers undo matching/reveal + full reset; E2E green; not all six undo buttons asserted individually |

## B. Demo operability

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Live demo duration | ≤8 minutes | **Not measured** | Timed dry-run pending |
| Demo recovery | ≤30 seconds per undo | **Not measured** | Grader panel present when server authoritative |
| Cold start | ≤15 minutes clone → signed-in checklist | **Not measured** | [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) |
| Preview confidence | 100% preview smoke when URL set | **Blocked** | `PLAYWRIGHT_BASE_URL=https://whynot-3m7vddtwg-ggracelus-projects.vercel.app` (2026-05-12 Preview) returns **401** without `VERCEL_AUTOMATION_BYPASS_SECRET`; unset/localhost still **skips** (no false pass) |
| Critical path blockers | 0 “coming soon” on deposit → bingo path | **Pass (copy)** | No “coming soon” on deposit → bingo path in repo grep |

## C. UX and brand

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Automated regression | typecheck + build + grader suite green | **Partial** | typecheck + build + `npm run test` + `npm run test:grader` green; preview skipped without deploy URL |
| Crumbs surfaces | ≥4 interactive surfaces + aria labels | **Partial** | Landing smoke + `components/brand/Crumbs.tsx` `aria-label` |
| Reduced motion | Crumbs loops respect `prefers-reduced-motion` | **Pass** | `e2e/smoke.spec.ts`, grader `emulateMedia` |
| Primary flow a11y | 0 critical keyboard gaps on core routes | **Not verified** | Week 7 dialog/composer states in code; no full keyboard pass |
| Landing Lighthouse | perf ≥80, a11y ≥90 mobile `/` | **Not run** | Needs pitch URL |
| Design system | MASTER-aligned trust pass on dashboard, season card, cohort, chat | **In progress** | Week 7 authority copy + state audit |

### Week 7 Design Trust Pass

| Surface | Status | Notes |
|---------|--------|-------|
| MASTER alignment | In progress | Warm bulletin-board direction preserved; single Season card entry to `/bingo`. |
| Critical-path copy | In progress | 4-of-6 contract; server vs local demo vs pending vs error on deposit/assignment/chat labels. |
| A11y on deposit / assignment / chat | In progress | Deposit handoff `role="dialog"`; assignment `role="alert"`; chat send/saved/retry. |
| Remaining blocker | **Open** | Grader E2E green on aligned env; preview smoke green on reachable `PLAYWRIGHT_BASE_URL` (bypass or disable Vercel protection); manual pass `/` → `/cohort/chat` + second-driver demo. |

### Week 7 auth / data surface probes (2026-05-12)

| Probe | Expected | Result |
|-------|----------|--------|
| `POST /api/checkout` signed out | 401 | **401** |
| `GET /dashboard` signed out | Redirect to sign-in | **307** |
| Clerk `proxy.ts` matcher | `/api/*` in middleware | **Pass** (`proxy.ts` matcher includes `/(api|trpc)(.*)`) |
| Anon REST read `deposits`, `profiles`, `chat_messages` | No rows | **Pass** (empty `[]`) |
| Anon REST insert `chat_messages` | Blocked | **Pass** (RLS `42501`) |
| Paid deposit without server | UI must not claim paid | **Pass (local grader)** | `/api/checkout` 200 `demo` records via server action; handoff shows paid after server record; no client-only paid when `serverAuthoritative` |

## D. Engineering trust

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Playwright grader coverage | ≥1 assertion per onboarding stage + undo | **Pass** | `e2e/grader-journey.spec.ts` green (2026-05-12) |
| Spec alignment | onboarding-funnel scenarios mapped to tests | **Partial** | Scenarios in `.specify/features/*`; chat/bingo specs ahead of full green run |
| Auth / data guardrails | privileged writes via server actions only | **Pass (code)** | `app/actions/*`, `lib/chat.ts`; browser does not write privileged tables directly |
| Tooling artifact | TOOLING_FRICTION with ≥3 failure modes | **Done** | [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) |
| Secrets management | Environment-specific keyrings, no preview→prod DB | **Pass (code)** | `lib/secrets.ts`, [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) Supabase trio contract |
| RLS policies | Member-scope access, client writes blocked | **Pass (local)** | `202605120001_deposits_and_rls.sql`, `202605120003_chat_messages_and_private_rls.sql` |
| Payment security | Server-recorded deposit in local; webhook in preview/prod | **Partial** | Demo deposit via authenticated `/api/checkout` + `markDepositPaidForDemo`; Stripe webhook `501` when secrets stripped in Playwright `webServer` |

## MVP page checklist (pitch script)

- [ ] Landing `/`
- [ ] Sign-in `/sign-in`
- [ ] Sign-up `/sign-up`
- [ ] Season / deposit handoff (bingo + checkout)
- [ ] Activity selection `/bingo`
- [ ] Assignment pending `/dashboard` Current
- [ ] Cohort dashboard `/cohort`
- [ ] Cohort chat `/cohort/chat`
- [ ] Bingo bonus `/bingo` post-assignment

## Spec traceability

| Scenario (onboarding-funnel) | Automated | Manual |
|------------------------------|-----------|--------|
| Profile bootstrap on dashboard | `e2e/grader-journey.spec.ts` | Grader walkthrough §3 |
| Paid deposit + four picks | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Future letter marks reveal | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Cohort roster on `/cohort` | `e2e/grader-journey.spec.ts` | Grader walkthrough §4 |
| Undo matching regression | `e2e/grader-journey.spec.ts` | Grader walkthrough §5 |

## Automated command log (2026-05-12)

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npm run test` | Pass (3/3 local smoke) |
| `npm run test:grader` | Pass (1/1) |
| `npm run test:preview` | **Failed (3/3)** with `PLAYWRIGHT_BASE_URL` set to latest Preview URL — Vercel Deployment Protection **401** (set `VERCEL_AUTOMATION_BYPASS_SECRET` or disable protection). **Skipped (3/3)** when URL unset or localhost. |
