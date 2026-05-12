# Pitch readiness scorecard

Living checklist for investor-pitch prototype quality. Update after Playwright grader runs or timed pitch dry-runs.

## Pitch-ready gate

| Gate | Target | Current | Evidence |
|------|--------|---------|----------|
| Functional | 7/7 onboarding stages + 9/9 MVP pages + grader journey green locally | TBD | `npm run test:grader`, manual script |
| Operable | ≤8 min demo; preview smoke green; undo/reset verified | TBD | Timed dry-run; `npm run test:preview` |
| Experience | Crumbs + reduced motion; landing Lighthouse on pitch URL | TBD | Manual / Lighthouse |
| Trust | This scorecard + tooling friction doc linked from grader walkthrough | Partial | [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) |

## A. Functional completeness

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Onboarding stages | 7/7 without localStorage-only gates when Supabase configured | TBD | `e2e/grader-journey.spec.ts`, checklist testids |
| MVP pages | 9/9 walkable in pitch script | TBD | Manual page checklist below |
| Persisted journey | ≥6/7 stages via Supabase (chat may stay demo-labeled) | TBD | Row checks after each stage |
| Sample cohorts | ≥2 cohorts, 15–20 roster members on `/cohort` | TBD | `supabase/seed_cohorts.sql` + UI |
| Cohort overlap story | ≥2 shared activity types vs four picks | TBD | Assignment snapshot |
| Grader re-run | 6/6 undo actions + full reset | TBD | Grader panel + Playwright |

## B. Demo operability

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Live demo duration | ≤8 minutes | TBD | Timed dry-run |
| Demo recovery | ≤30 seconds per undo | TBD | Grader panel |
| Cold start | ≤15 minutes clone → signed-in checklist | TBD | [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) |
| Preview confidence | 100% preview smoke when URL set | TBD | `npm run test:preview` |
| Critical path blockers | 0 “coming soon” on deposit → bingo path | TBD | Copy audit |

## C. UX and brand

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Automated regression | typecheck + build + grader suite green | TBD | CI / local commands |
| Crumbs surfaces | ≥4 interactive surfaces + aria labels | TBD | Inventory |
| Reduced motion | Crumbs loops respect `prefers-reduced-motion` | TBD | Playwright emulateMedia |
| Primary flow a11y | 0 critical keyboard gaps on core routes | TBD | Manual pass |
| Landing Lighthouse | perf ≥80, a11y ≥90 mobile `/` | TBD | Lighthouse on pitch URL |
| Design system | ≥8/10 on dashboard, cohort, bingo | TBD | `design-system/MASTER.md` |

## D. Engineering trust

| Metric | Target | Current | How measured |
|--------|--------|---------|--------------|
| Playwright grader coverage | ≥1 assertion per onboarding stage + undo | TBD | Spec inventory |
| Spec alignment | onboarding-funnel scenarios mapped to tests | TBD | Traceability below |
| Auth / data guardrails | privileged writes via server actions only | TBD | [AGENTS.md](../AGENTS.md) |
| Tooling artifact | TOOLING_FRICTION with ≥3 failure modes | Done | [TOOLING_FRICTION.md](./TOOLING_FRICTION.md) |

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
