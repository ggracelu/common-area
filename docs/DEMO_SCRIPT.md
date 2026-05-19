# Common Area — investor demo script

**Audience:** Investor / external pitch (not grader checklist).  
**Production URL:** https://common-area-one.vercel.app  
**Target duration:** ~7 minutes (≤8 with buffer)

## Demo credentials (copy-paste)

Use **Clerk development** keys on the deploy you demo. All business emails below use `+clerk_test@example.com`; Clerk never sends real mail. If sign-in or sign-up asks for an email verification code, enter **`424242`** (always six digits).

Run `npm run provision:demo-accounts` before a live demo to pre-create accounts and verify inboxes (fewer OTP prompts).

### Clerk email verification (`+clerk_test` only)

| When | Code |
|------|------|
| Clerk asks for email verification on any `*+clerk_test@example.com` address (member or business) | **`424242`** |

Does **not** apply to `grader@example.com` (standard test account).

### Primary member grader (full season journey)

| Field | Value |
|-------|-------|
| Sign-in | `/sign-in` |
| Email | `grader@example.com` |
| Password | `CAgr8r-9Qm!vT2wL6pX` |

### Member audience demos (five personas)

Shared password for all five: **`CADemo-Member8!vT2wL6pX`** · Sign-in: `/sign-in` or `/sign-up`

| Audience | Name | Email | Password |
|----------|------|-------|----------|
| New grad, first year in Chicago | Alex Chen | `alex-newgrad+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Wicker Park creative | Jordan Lee | `jordan-creative+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Logan Square food & culture | Sam Ortiz | `sam-foodie+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Pilsen neighborhood explorer | Priya Nair | `priya-pilsen+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |
| Lakeview social reset | Morgan Blake | `morgan-reset+clerk_test@example.com` | `CADemo-Member8!vT2wL6pX` |

If Clerk prompts for verification on these emails, use **`424242`**.

### Business audience demos (five host personas)

Sign-in: `/partner/sign-in` or `/partner/sign-up` · Verification code for all rows: **`424242`**

| Audience | Business | Email | Password |
|----------|----------|-------|----------|
| Wicker Park coffee host | Grader's Coffee | `graders-coffee+clerk_test@example.com` | `CAPartner-8Qm!vT2wL6pX` |
| Ukrainian Village cafe & workshop | Crumbs Cafe | `crumbs-cafe+clerk_test@example.com` | `CAPartner-Cr7m!vT2wL6pX` |
| Logan Square ceramics studio | The Kiln Room | `kiln-room+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |
| Wicker Park comedy & listening room | Half Lit Listening Room | `half-lit+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |
| Pilsen bookshop & community room | Margin Notes Bookshop | `margin-notes+clerk_test@example.com` | `CAPartner-Demo8!vT2wL6pX` |

On `/business/dashboard`, sign in as any business row and use **Apply sample answers** once to prefill host onboarding.

## Pre-demo checklist

- [ ] Production loads without **401** (disable Vercel Deployment Protection for Production or use a network that passes SSO).
- [ ] Clerk **development** keys on the demo deploy (required for `424242` on `+clerk_test` emails).
- [ ] Run `npm run provision:demo-accounts` (or at least `node scripts/provision-partner-accounts.mjs` for Grader's + Crumbs).
- [ ] Member account (`grader@example.com`) has completed deposit, picks, matching, and reveal **or** you will walk signup live (add ~2 min).
- [ ] Partner account (**Grader's Coffee**) has completed onboarding (use **Apply sample answers** once if needed).
- [ ] **Grader controls** and **Partner testing controls** are out of frame or collapsed — investors should not see QA chrome.
- [ ] Second browser or incognito profile ready for partner segment (avoids member session bleed).
- [ ] If Clerk still prompts on a business `+clerk_test` email, enter **`424242`** (see table above).
- [ ] Optional: set `NEXT_PUBLIC_SHOW_DEMO_ACCOUNT_HINTS=true` so auth pages list all personas ([DEMO_ACCOUNTS.md](./DEMO_ACCOUNTS.md)).

## Investor cut (~7 min)

| Step | Time | Route | Speaker notes |
|------|------|-------|----------------|
| **Hook** | 0:30 | `/` | Post-college Chicago loses the campus rhythm. Common Area brings it back through **seasons**, **cohorts**, and **third places**—not swiping or one-off dinners. |
| **Season invite** | 0:45 | `/` (scroll) | Summer 2026: $20 deposit, pick **4 of 6** experiences, land in a cohort of ~15–20 with real overlap. Low pressure, high repeat. |
| **Join** | 2:00 | `/sign-in` → `/bingo` | Walk four picks and submit. Deposit handoff — test path is fine; point at **Paid** and **Saved to your account** if visible. |
| **Belonging** | 2:00 | `/dashboard` → **Future** → `/cohort` | Matching runs server-side. Letter → roster. “Familiar faces, not opaque matching magic.” Show overlap story on cohort home. |
| **Play** | 1:00 | `/cohort/chat`, `/bingo` bonus | Light play: one chat line; one bonus stamp. Read the status banner honestly (Postgres vs demo). |
| **Host side** | 1:30 | `/partner` → `/partner/sign-in` → `/business/dashboard` | “Businesses get repeat cohort nights.” Tour tabs: Dashboard, Calendar, Analytics, Community, Profile. Say **sample preview data** once. |
| **Close** | 0:30 | Community or Profile tab | Repeat encounters at real businesses. Next: prove retention, then live cohort windows for hosts—no partner billing in this slice. |

## Tab tour (partner — 45 sec inside host step)

1. **Dashboard** — headline metrics + upcoming nights at the host room.  
2. **Calendar** — past crawl + upcoming standing night (Grader's Coffee narrative).  
3. **Analytics** — repeat rate, season insight callout.  
4. **Community** — cafe crawl partners + guest profiles who returned.  
5. **Profile** — onboarding answers as the host’s public preview card.

## What to say about preview vs real

- **Member path:** Deposit, picks, assignment, reveal, and roster are **server-backed** when Supabase is configured (badge: **Saved to your account**).
- **Partner path:** Onboarding is **browser-only** for this prototype; calendar/analytics/community are **illustrative sample data**.
- **Out of scope today:** Live partner billing, host-side cohort assignment, CRM payouts.

## Recovery (if something breaks mid-demo)

| Issue | Fix |
|-------|-----|
| **Local demo cache** badge | Do not claim persistence; fix env later. For demo, use a machine with aligned Supabase. |
| Stuck on onboarding checklist | Use pre-seeded grader account; avoid live reset on stage. |
| Partner shows member sign-in | Use `/partner/sign-in`, not `/sign-in`. |
| Clerk verification on business email | Enter **`424242`** for any `+clerk_test@example.com` address. |
| Wrong password on Grader's / Crumbs | Use passwords from the **Business audience demos** table above (not the shared `CAPartner-Demo8!` row). |

## Grader appendix (operators only)

Do not read this section in an investor meeting. Full env setup: [GRADER_LOGIN.md](./GRADER_LOGIN.md), [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md).

**QA controls:** `grader-reset-journey`, `partner-grader-apply-sample-onboarding`, `partner-grader-reset-onboarding`.

**Automated eval:** [AUTOMATION_AND_EVAL.md](./AUTOMATION_AND_EVAL.md).

## Dry-run log

| Date | Duration | Notes |
|------|----------|-------|
| | | |

Fill after one timed rehearsal (~7 min). Use a **second browser or incognito** for the partner segment. Confirm production returns **200** before scheduling (not **401** — see [PM_WEEK_DECISIONS.md](./PM_WEEK_DECISIONS.md)).

**Week priorities:** [PM_WEEK_DECISIONS.md](./PM_WEEK_DECISIONS.md).
