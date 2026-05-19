# PM week decisions — final mile (2026-05-19)

QA recommendation for the week. Engineering status updated after typecheck fix; production access remains **operator-owned**.

## Priority stack (this week)

| Priority | Item | Owner | Status |
|----------|------|-------|--------|
| **P0-1** | Unblock production — public URL must load without SSO/401 | **Operator** (Vercel) | **Open** — `curl -I https://common-area-one.vercel.app` returns **401** (Deployment Protection) |
| **P0-2** | Green eval ladder — `npm run typecheck` | **Eng** | **Done** — invalid `groupSize` literals in `lib/demo-accounts.ts` fixed |
| **P0-3** | One timed investor dry-run + second browser for partner | **PM / demo lead** | **Open** — fill [DEMO_SCRIPT.md](./DEMO_SCRIPT.md#dry-run-log) |
| **P1** | Vercel env pass (see checklist below) | **Operator** | **Open** |
| **Defer** | v4 scope items not required for pitch | **PM** | See [V4 scope](#v4-scope-explicit-defer) |

### P0-1 — Unblock production (operator)

1. Vercel → project **common-area** → **Settings** → **Deployment Protection**.
2. For **Production**, either:
   - **Disable** protection for the investor demo window, **or**
   - Keep protection and set `VERCEL_AUTOMATION_BYPASS_SECRET` for Playwright preview smoke only (investors still need public access for live demo).
3. Verify: `curl -sI https://common-area-one.vercel.app/ | head -1` → **`HTTP/2 200`** (not 401).

### P1 — Vercel env pass (operator)

Copy from [`.env.example`](../.env.example) into the **Production** (and Preview if grading there) project:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | **Development** Clerk keys for `+clerk_test` and **`424242`** OTP |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SECRET_KEY` | Aligned prod or preview Supabase trio |
| `NEXT_PUBLIC_GRADER_EMAIL_HINT` | Member grader callout on `/sign-in` |
| `NEXT_PUBLIC_PARTNER_GRADER_EMAIL_HINT` | Grader's Coffee callout when demo panel off |
| `NEXT_PUBLIC_PARTNER_TESTER_EMAIL_HINT` | Crumbs callout when demo panel off |
| `NEXT_PUBLIC_SHOW_DEMO_ACCOUNT_HINTS` | Optional `true` — lists all 5+5 personas on auth pages |
| `GRADER_CLERK_*`, `PARTNER_*_CLERK_*` | Playwright grader + provision scripts |

Run `npm run provision:demo-accounts` locally once before a demo if accounts are missing.

## Sign-off recommendation

| Audience | Ready? | Condition |
|----------|--------|-----------|
| **Course grader** (documented accounts, local + deploy with bypass) | **Yes, with caveats** | Aligned Supabase; correct sign-in routes (`/sign-in` vs `/partner/sign-in`); `grader-undo-all` only after happy path; production accessible |
| **Investor live demo** | **No until P0-1** | Public URL must load without SSO |
| **“Complete v4 product”** | **No** | Partner Postgres persistence, full signup eval, partner automation tests, production chat/billing hardening |

**Bottom line:** Core member story is demo-ready and test-backed; partner preview is honest and walkable. **Prioritize production access and a green eval ladder**, then one recorded investor rehearsal — that closes the week stronger than new features.

## V4 scope (explicit defer)

**In scope for v4 (when scheduled):**

- Partner onboarding persisted to Postgres (not browser-only)
- Partner E2E (signed-in tab tour)
- Stripe webhook confirmed in production
- Optional second-driver live session in pitch script

**Explicitly deferred:**

- Live partner billing / CRM / payouts
- Infinite city marketplace
- Swipe/dating UX

## Eval ladder (run after deploy)

```bash
npm run typecheck
npm run build
npm run test
npm run test:grader    # requires GRADER_CLERK_* in .env.local
npm run test:preview   # PLAYWRIGHT_BASE_URL + optional VERCEL_AUTOMATION_BYPASS_SECRET
```

## Related docs

- [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) — credentials + investor cut + dry-run log
- [FINAL_MILE_QA.md](./FINAL_MILE_QA.md) — defect IDs
- [PITCH_READINESS.md](./PITCH_READINESS.md) — scorecard
- [AUTOMATION_AND_EVAL.md](./AUTOMATION_AND_EVAL.md) — human vs automated eval
