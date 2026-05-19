# Automation and evaluation

How Common Area separates **automated** behavior, **human-in-the-loop** steps, and **preview-only** surfaces—and how to verify each before a demo or grader submission.

**Production:** https://common-area-one.vercel.app  
**Repo:** [ggracelu/common-area](https://github.com/ggracelu/common-area)

## 1. Automation inventory

| Capability | Automation level | Human in the loop | How we verify |
|------------|------------------|-------------------|---------------|
| Cohort assignment | Server heuristic (overlap bucketing) | None at demo time | `npm run test:grader`; overlap card on `/cohort` |
| Deposit paid state | Server action / checkout | Operator clicks deposit; Stripe may return `501` locally | E2E + `node scripts/grader-db-spotcheck.mjs` |
| Activity picks (4 of 6) | Server autosave when Supabase configured | Operator selects tiles | Grader journey spec |
| Member undo / reset | Server actions via UI | Operator confirms browser dialog | `grader-undo-*` in E2E; `grader-undo-all.mjs` **only after** a journey with matching **Done** |
| Partner onboarding | Browser `localStorage` per Clerk user | Operator: **Apply sample answers** / **Reset partner onboarding** | Manual partner matrix; not server-backed |
| Partner calendar / analytics / community | Static demo lib | None | `partner-sample-data-notice` + copy on each tab |
| Cohort chat | Postgres when migrated; else labeled demo | Operator sends test message | `cohort-chat-demo-label` text in E2E |
| AI coding agents (Cursor, Codex) | Dev-time only | **You** review diffs; run eval ladder | `typecheck`, `build`, Playwright; no runtime AI in product |

## 2. Eval ladder (run in order)

```bash
npx supabase db reset
node scripts/provision-partner-accounts.mjs
npm run typecheck
npm run build
npm run test
npm run test:grader
PLAYWRIGHT_BASE_URL=https://common-area-one.vercel.app npm run test:preview
node scripts/grader-db-spotcheck.mjs
```

**Notes:**

- Run `grader-db-spotcheck.mjs` and `grader-undo-all.mjs` only **after** a green `npm run test:grader` (or full happy path). The grader spec ends with **Reset full journey**, so undo-all will fail if run immediately after E2E without re-seeding progress.
- Preview smoke is **5 tests** in `e2e/preview-smoke.spec.ts` (landing, sign-in, dashboard redirect, partner landing, business redirect).

## 3. Environment contracts

### Supabase trio (local grader)

After `npx supabase db reset`, copy **all three** from the **same** project:

```bash
npx supabase status -o env
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` in `.env.local`. A hosted URL with a local secret yields **Local demo cache** on the dashboard.

### `PLAYWRIGHT_BASE_URL` (preview smoke)

- For `npm run test:preview`, set `PLAYWRIGHT_BASE_URL=https://common-area-one.vercel.app` in `.env.local` **or** export it in the shell before the command.
- As of the final-mile sprint, `playwright.config.ts` restores the **shell** value over `.env.local` when both are set during `test:preview`, so a stale preview host in `.env.local` does not override an explicit shell URL.

### Vercel Deployment Protection

If production returns **401**, set `VERCEL_AUTOMATION_BYPASS_SECRET` for preview smoke or disable Deployment Protection for the production environment. See [FINAL_MILE_QA.md](./FINAL_MILE_QA.md).

## 4. Correct output per surface

| Surface | Expected when configured |
|---------|-------------------------|
| Dashboard authority badge | **Saved to your account** (not **Local demo cache**) |
| Deposit handoff | **Paid** after server records deposit |
| Onboarding checklist | Deposit, picks, matching **Done** before Future letter |
| Future / reveal | `cohort-reveal-letter` → **Enter your common room** |
| Chat label | Postgres-backed, demo, or unavailable — label must match reality |
| Partner preview badge | **Partner preview** on business surfaces |
| Partner tabs | `partner-sample-data-notice` on calendar, analytics, community |
| Unsigned `/business/dashboard` | Redirect to `/partner/sign-in` |

## 5. Human-in-the-loop principles (v4)

1. **Runtime product:** No autonomous AI actions for users; assignment and deposits are deterministic server rules with honest demo fallbacks.
2. **QA:** Playwright proves the member happy path; partner path is **human-verified** until a Clerk-backed partner spec exists.
3. **Development:** Humans review agent diffs; migrations, env templates, and E2E are the contract agents cannot skip.
4. **Investor demo:** Operator pre-seeds state; hide **Grader controls** and **Partner testing controls** from the narrative.

## Related docs

- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) — investor walkthrough
- [GRADER_LOGIN.md](./GRADER_LOGIN.md) — test accounts
- [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md) — setup and commands
- [FINAL_MILE_QA.md](./FINAL_MILE_QA.md) — defect log
- [PITCH_READINESS.md](./PITCH_READINESS.md) — scorecard
