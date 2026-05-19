# Final mile QA — defect log

**Date:** 2026-05-19  
**Production:** https://common-area-one.vercel.app  
**Commit:** `main` at time of sprint

## P0 — blocks investor demo

| ID | Surface | Issue | Status |
|----|---------|-------|--------|
| P0-1 | Production | **Vercel Deployment Protection** returns **401** on `common-area-one.vercel.app` for unauthenticated curl/browser without bypass (verified 2026-05-19). Investors cannot load the app until protection is disabled for Production. Preview smoke **skips** partner content test when the SSO wall is present. | **Operator:** [PM_WEEK_DECISIONS.md](./PM_WEEK_DECISIONS.md#p0-1--unblock-production-operator) |
| P0-2 | Engineering | `npm run typecheck` failed on invalid `groupSize` in `lib/demo-accounts.ts`. | **Fixed** (2026-05-19) |
| P0-2b | Landing | Footer/CTA copy said **“Design exploration only — no backend logic”** while member path is server-backed. | **Fixed** — V16 footer: “Summer 2026 prototype … Server-backed when configured” |

## P1 — trust / copy (fix in sprint)

| ID | Surface | Issue | Status |
|----|---------|-------|--------|
| P1-1 | Business tabs | Calendar/analytics/community need explicit **sample preview data** disclaimers on every tab. | **Fix in code** |
| P1-2 | Business demo data | Sample events should anchor on **Grader's Coffee / Wicker Park** narrative. | **Fix in code** |
| P1-3 | Partner onboarding | Handoff to tabbed dashboard should feel complete (no empty flash). | **Fix in code** |
| P1-4 | Eval | `PLAYWRIGHT_BASE_URL` in `.env.local` can override shell URL → stale preview host fails business redirect test. | **Fix in code** |
| P1-5 | Production | `NEXT_PUBLIC_*_EMAIL_HINT` may be unset on Vercel (no grader callouts). | **Operator:** Vercel env |

## P2 — nice-to-have

| ID | Surface | Issue |
|----|---------|-------|
| P2-1 | Landing | Activity section microcopy still says “Design-only exploration”. |
| P2-2 | Lighthouse | Mobile perf ~72 on local `/` (hero images + motion). |
| P2-3 | Partner E2E | No signed-in partner tab tour in Playwright (manual only). |

## Member track (local / automated)

- `npm run test:grader` — run during sign-off block.
- Authority badge, deposit → cohort path — covered by existing E2E.

## Partner track (code review + local)

- `/business/dashboard` unsigned → `/partner/sign-in` — **pass** (`proxy.ts`).
- Five tabs present — **pass** (components exist).
- Onboarding `localStorage` only — documented in `docs/AUTOMATION_AND_EVAL.md`.

## Sign-off

Re-run this matrix after P0-1 operator fix and code deploy. Preview smoke with `VERCEL_AUTOMATION_BYPASS_SECRET` when protection stays enabled.
