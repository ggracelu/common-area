# TICKET-007: QA and Security

## Owner
- Agent: QA/Security agent
- Branch: `qa/agent-handoff`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Create QA gates, security checklists, and CI infrastructure for parallel agent work.

## Scope
- `.board/` - Ticket board folder
- `docs/AGENT_HANDOFF.md` - Multichat workflow documentation
- `docs/QA_CHECKLIST.md` - Manual QA flows
- `docs/SECURITY_CHECKLIST.md` - Security rules and checks
- `.github/workflows/ci.yml` - GitHub Actions CI workflow
- `README.md` - Parallel agent workflow section
- `AGENTS.md` - Agent handoff note

## Out of scope
- Do not implement product features
- Do not modify the landing page
- Do not add Stripe
- Do not add Supabase schema beyond docs
- Do not add activity selection
- Do not add cohort assignment
- Do not add chat
- Do not add bingo

## Dependencies
- None (this ticket creates the coordination substrate for all other tickets)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] All 7 ticket files are created in `.board/`
- [ ] AGENT_HANDOFF.md explains multichat workflow and branch strategy
- [ ] QA_CHECKLIST.md covers all manual QA flows
- [ ] SECURITY_CHECKLIST.md covers all security rules
- [ ] CI workflow runs on pull_request and push to main
- [ ] CI workflow runs lint, typecheck, and build
- [ ] README.md points to handoff docs and board
- [ ] AGENTS.md has agent handoff note

## Handoff notes
This ticket creates the coordination and quality substrate for parallel agent work. It does not implement any product features.

**Key deliverables:**
1. Ticket board with clear ownership, scope, and handoff notes
2. Agent handoff documentation for multichat workflows
3. QA checklist for manual testing
4. Security checklist for security rules
5. CI workflow for automated quality gates
6. Updated README and AGENTS.md

**Branch strategy:**
- Each ticket should use its own feature branch
- Recommended branch names are in each ticket
- Worktrees allow parallel development without conflicts
- Always read the ticket before modifying code

**Quality gates:**
- All agents must run lint, typecheck, and build before committing
- CI will run these checks on every PR
- Manual QA flows should be followed before marking tickets ready for review
- Security checklist should be reviewed for any sensitive changes

**When to stop and ask:**
- If requirements are unclear
- If architectural decisions need approval
- If security implications are uncertain
- If merge conflicts cannot be resolved

This ticket is the foundation for all subsequent parallel agent work.

## Status
doing
