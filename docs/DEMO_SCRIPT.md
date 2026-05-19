# Common Area — investor demo script

**Audience:** Investor / external pitch (not grader checklist).  
**Production URL:** https://common-area-one.vercel.app  
**Target duration:** ~7 minutes (≤8 with buffer)

## Pre-demo checklist

- [ ] Production loads without **401** (disable Vercel Deployment Protection for Production or use a network that passes SSO).
- [ ] Member account (`grader@example.com`) has completed deposit, picks, matching, and reveal **or** you will walk signup live (add ~2 min).
- [ ] Partner account (**Grader's Coffee**) has completed onboarding (use **Apply sample answers** once if needed).
- [ ] **Grader controls** and **Partner testing controls** are out of frame or collapsed — investors should not see QA chrome.
- [ ] Second browser or incognito profile ready for partner segment (avoids member session bleed).
- [ ] If Clerk prompts on `+clerk_test` partner email, enter **`424242`**.

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
| Clerk verification | `424242` for `+clerk_test` emails. |

## Grader appendix (operators only)

Do not read this section in an investor meeting.

| Flow | Sign-in | Account |
|------|---------|---------|
| Member | `/sign-in` | `grader@example.com` |
| Partner grader | `/partner/sign-in` | `graders-coffee+clerk_test@example.com` |
| Partner tester | `/partner/sign-in` | `crumbs-cafe+clerk_test@example.com` |

Passwords and env setup: [GRADER_LOGIN.md](./GRADER_LOGIN.md), [GRADER_WALKTHROUGH.md](./GRADER_WALKTHROUGH.md).

**QA controls:** `grader-reset-journey`, `partner-grader-apply-sample-onboarding`, `partner-grader-reset-onboarding`.

**Automated eval:** [AUTOMATION_AND_EVAL.md](./AUTOMATION_AND_EVAL.md).

## Dry-run log

| Date | Duration | Notes |
|------|----------|-------|
| | | |

Fill after one timed rehearsal.
