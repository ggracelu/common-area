# Demo audience accounts

Use these **ten Clerk test accounts** to show how different Chicago audiences sign up as members or hosts. They complement the primary **member grader** (`grader@example.com`) documented in [GRADER_LOGIN.md](./GRADER_LOGIN.md).

All demo emails use the `+clerk_test` subaddress. No real email is delivered. If Clerk asks for a verification code, enter **`424242`** (Clerk development instances only).

**Pitch-ready copy-paste tables** (all emails, passwords, and `424242`): [DEMO_SCRIPT.md](./DEMO_SCRIPT.md#demo-credentials-copy-paste).

## Provision in Clerk

From the repo root with `CLERK_SECRET_KEY` in `.env.local`:

```bash
node scripts/provision-demo-accounts.mjs
```

This creates or updates all five member and five business accounts, verifies inboxes, and links `graders-coffee` to Supabase when `SUPABASE_SECRET_KEY` is set.

Grader's Coffee and Crumbs Cafe keep their **existing** passwords from `.env.example` when those env vars are set; the three newer host personas use the shared business demo password below.

## Shared passwords

| Side | Password | Env override |
|------|----------|--------------|
| **Member demos (5)** | `CADemo-Member8!vT2wL6pX` | `DEMO_MEMBER_PASSWORD` |
| **Business demos (3 new hosts)** | `CAPartner-Demo8!vT2wL6pX` | `DEMO_PARTNER_PASSWORD` |
| **Grader's Coffee** | `CAPartner-8Qm!vT2wL6pX` | `PARTNER_GRADER_CLERK_PASSWORD` |
| **Crumbs Cafe** | `CAPartner-Cr7m!vT2wL6pX` | `PARTNER_TESTER_CLERK_PASSWORD` |

## Member personas (`/sign-in`, `/sign-up`)

Shared password: **`CADemo-Member8!vT2wL6pX`** · Verification code if prompted: **`424242`**

| Audience group | Display name | Email | Password |
|----------------|--------------|-------|----------|
| New grad, first year in Chicago | Alex Chen | `alex-newgrad+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Wicker Park creative | Jordan Lee | `jordan-creative+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Logan Square food & culture | Sam Ortiz | `sam-foodie+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Pilsen neighborhood explorer | Priya Nair | `priya-pilsen+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Lakeview social reset | Morgan Blake | `morgan-reset+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |

After sign-in, each account follows the normal member journey (deposit, four picks, assignment, dashboard). Use a fresh account when you want to demo **creating** a new member from scratch with that audience story.

## Business personas (`/partner/sign-in`, `/partner/sign-up`)

Verification code for **every** row: **`424242`**

| Audience group | Business | Email | Password |
|----------------|----------|-------|----------|
| Wicker Park coffee host | Grader's Coffee | `graders-coffee+clerk_test@example.com` | `CAPartner-8Qm!vT2wL6pX` |
| Ukrainian Village cafe & workshop | Crumbs Cafe | `crumbs-cafe+clerk_test@example.com` | `CAPartner-Cr7m!vT2wL6pX` |
| Logan Square ceramics studio | The Kiln Room | `kiln-room+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |
| Wicker Park comedy & listening room | Half Lit Listening Room | `half-lit+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |
| Pilsen bookshop & community room | Margin Notes Bookshop | `margin-notes+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |

On `/business/dashboard`, sign in as any row above and click **Apply sample answers** to prefill host onboarding for that business type.

## UI hints on auth pages

In **development**, `/sign-in`, `/sign-up`, `/partner/sign-in`, and `/partner/sign-up` show a **Demo audience accounts** panel listing all five personas for that side.

On Vercel or for investor demos, set:

```bash
NEXT_PUBLIC_SHOW_DEMO_ACCOUNT_HINTS=true
```

Set to `false` to hide the panel (for example when only the single grader callout should appear).

## Source of truth in code

- Personas and passwords: [`lib/demo-accounts.ts`](../lib/demo-accounts.ts)
- Auth panel: [`components/auth/DemoAccountPanel.tsx`](../components/auth/DemoAccountPanel.tsx)
- Provision script: [`scripts/provision-demo-accounts.mjs`](../scripts/provision-demo-accounts.mjs)
