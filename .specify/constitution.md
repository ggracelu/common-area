# Common Area constitution

- Clerk is the only authentication provider.
- Supabase Postgres is the source of truth for onboarding, deposits, picks, cohort membership, and bingo progress.
- Browser clients never perform privileged writes; server actions and route handlers use the Supabase service role.
- Cohort assignment runs server-side from persisted overlap data.
- Stripe deposit completion is trusted only from webhook-confirmed state or explicit demo server actions in local environments.
- Pixel-art Crumbs remains the mascot; WebGL layers are atmospheric chrome only.

See also [AGENTS.md](../AGENTS.md) and [docs/DATA_MODEL.md](../docs/DATA_MODEL.md).
