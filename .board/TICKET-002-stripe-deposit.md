# TICKET-002: Stripe Deposit

## Owner
- Agent: Payments/Backend agent
- Branch: `feat/stripe-deposit`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Implement the $20 seasonal deposit flow with Stripe test mode and webhook confirmation.

## Scope
- `app/api/stripe/checkout/` - Checkout session creation
- `app/api/stripe/webhook/` - Stripe webhook handler
- `app/dashboard/deposit/` - Deposit flow pages
- `lib/stripe/` - Stripe client and utilities
- `lib/supabase/` - Deposit record operations
- `supabase/migrations/` - Deposit table schema (if not already created)
- `.env.example` - Add required Stripe env vars

## Out of scope
- Do not modify the landing page
- Do not add activity selection
- Do not add cohort assignment
- Do not add chat
- Do not add bingo
- Do not use production Stripe keys (test mode only)

## Dependencies
- TICKET-001 (homepage should be complete for navigation context)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Stripe checkout session creates successfully
- [ ] Deposit record is created in Supabase with `pending` status
- [ ] Stripe webhook confirms payment and updates deposit to `paid` status
- [ ] Payment state is never trusted from URL params
- [ ] Webhook signature verification is implemented
- [ ] Error states are handled gracefully
- [ ] User can return to app after successful payment

## Handoff notes
**CRITICAL SECURITY RULES:**
- Never trust client-reported payment completion
- Only webhook-confirmed payment events can move a deposit into a paid state
- Stripe secret keys must be server-only (no NEXT_PUBLIC_ prefix)
- Webhook secret must be server-only
- Payment state must be mirrored in Supabase

**Required env vars:**
- `STRIPE_SECRET_KEY` (server-only)
- `STRIPE_WEBHOOK_SECRET` (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-safe)

**Webhook events to handle:**
- `checkout.session.completed` - Mark deposit as paid
- `checkout.session.async_payment_failed` - Mark deposit as failed

The next agent will use the deposit status to gate activity selection.

## Status
todo
