# Agent Handoff Guide

This guide explains how to work with multiple agents in parallel on the Common Area codebase.

## Multichat Workflow

When working with multiple agents simultaneously, each agent should:

1. **Read the ticket first** - Always start by reading the relevant ticket in `.board/`
2. **Create a worktree** - Use git worktrees to avoid conflicts
3. **Use the recommended branch** - Each ticket specifies a branch name
4. **Keep changes scoped** - Only modify files within the ticket's scope
5. **Run quality gates** - Always run lint, typecheck, and build before committing
6. **Summarize touched files** - Before handoff, list all files you modified

## Branch and Worktree Strategy

### Creating a Worktree

For each ticket, create a separate worktree to avoid conflicts:

```bash
# From the main repo directory
git worktree add ../whynot-qa-ticket-001 feat/final-homepage
git worktree add ../whynot-qa-ticket-002 feat/stripe-deposit
git worktree add ../whynot-qa-ticket-003 feat/activity-selection
# ... and so on
```

### Recommended Branch Names

Each ticket specifies its recommended branch:

- TICKET-001: `feat/final-homepage`
- TICKET-002: `feat/stripe-deposit`
- TICKET-003: `feat/activity-selection`
- TICKET-004: `feat/cohort-assignment`
- TICKET-005: `feat/cohort-chat`
- TICKET-006: `feat/bingo-prompts`
- TICKET-007: `qa/agent-handoff`

### Working in a Worktree

```bash
# Navigate to the worktree
cd ../whynot-qa-ticket-001

# Make your changes
# ...

# Run quality gates
npm run lint
npm run typecheck
npm run build

# Commit and push
git add .
git commit -m "Implement final homepage with design system"
git push -u origin feat/final-homepage
```

### Cleaning Up Worktrees

After merging a PR, you can remove the worktree:

```bash
# From the main repo directory
git worktree remove ../whynot-qa-ticket-001
```

## File Ownership

To avoid merge conflicts, each agent should only modify files within their ticket's scope:

| Ticket | Agent | Files to Modify |
|--------|-------|-----------------|
| TICKET-001 | Frontend/Design | `app/page.tsx`, `app/layout.tsx`, `components/landing/`, `app/globals.css`, `public/` |
| TICKET-002 | Payments/Backend | `app/api/stripe/`, `app/dashboard/deposit/`, `lib/stripe/`, `lib/supabase/` (deposit-related) |
| TICKET-003 | Frontend/Backend | `app/dashboard/selection/`, `components/selection/`, `lib/supabase/activities.ts`, `lib/supabase/selections.ts` |
| TICKET-004 | Backend/Algorithm | `lib/assignment/`, `lib/supabase/cohorts.ts`, `app/api/assignment/`, `app/dashboard/assignment/` |
| TICKET-005 | Realtime/Frontend | `app/dashboard/cohort/[id]/chat/`, `components/chat/`, `lib/supabase/chat.ts`, `lib/supabase/realtime.ts` |
| TICKET-006 | Frontend/Content | `app/dashboard/cohort/[id]/bingo/`, `components/bingo/`, `lib/supabase/bingo.ts` |
| TICKET-007 | QA/Security | `.board/`, `docs/AGENT_HANDOFF.md`, `docs/QA_CHECKLIST.md`, `docs/SECURITY_CHECKLIST.md`, `.github/workflows/` |

**Shared files that may need coordination:**
- `lib/supabase/` - Different agents may add new files here
- `supabase/migrations/` - Different agents may add migrations
- `app/dashboard/` - Different agents may add new routes
- `components/` - Different agents may add new components

If you need to modify a shared file, coordinate with the other agent first.

## Avoiding Merge Conflicts

### Best Practices

1. **Keep changes scoped** - Only modify files within your ticket's scope
2. **Add new files instead of modifying existing ones** - When possible, create new files rather than modifying shared files
3. **Use feature flags sparingly** - Only use feature flags if absolutely necessary
4. **Coordinate early** - If you anticipate a conflict, coordinate with the other agent before starting work
5. **Rebase before pushing** - Always rebase your branch before pushing to ensure you have the latest changes

### Handling Conflicts

If you encounter a merge conflict:

1. **Identify the conflict** - Use `git status` to see which files have conflicts
2. **Understand the conflict** - Read both sides of the conflict to understand what each agent was trying to do
3. **Resolve the conflict** - Edit the file to resolve the conflict, keeping both changes if possible
4. **Test the resolution** - Run `npm run lint`, `npm run typecheck`, and `npm run build` to ensure the resolution is correct
5. **Commit the resolution** - Use `git add` and `git commit` to commit the resolution
6. **Communicate** - Let the other agent know about the conflict and how you resolved it

## Writing PR Summaries

When creating a PR, include a clear summary that helps reviewers understand:

1. **What you did** - A brief description of the changes
2. **Why you did it** - The motivation behind the changes
3. **How you tested it** - The testing you performed
4. **Files touched** - A list of all files you modified

### PR Summary Template

```markdown
## Summary
[Brief description of what you did]

## Motivation
[Why you made these changes]

## Testing
- [ ] Manual testing performed
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes

## Files Touched
- `path/to/file1.ts`
- `path/to/file2.ts`
- ...

## Notes
[Any additional notes for reviewers]
```

## When to Stop and Ask

Stop and ask the human if:

1. **Requirements are unclear** - You don't understand what the ticket is asking for
2. **Architectural decisions need approval** - You need to make a significant architectural decision
3. **Security implications are uncertain** - You're unsure about the security implications of your changes
4. **Merge conflicts cannot be resolved** - You cannot resolve a merge conflict without breaking something
5. **Dependencies are missing** - You need a dependency that isn't specified in the ticket
6. **Scope is ambiguous** - You're unsure about what's in scope vs. out of scope
7. **Acceptance criteria are unclear** - You don't understand what constitutes "done"

## Quality Gates

Before committing any changes, always run:

```bash
npm run lint
npm run typecheck
npm run build
```

These commands are also run by CI on every PR, so it's better to catch issues locally.

### Lint

```bash
npm run lint
```

Checks for code style issues and potential bugs.

### Typecheck

```bash
npm run typecheck
```

Checks for TypeScript type errors.

### Build

```bash
npm run build
```

Builds the production bundle and checks for build-time errors.

## Commit and Push Commands

### Committing Changes

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Implement feature X"

# Or use a multi-line commit message
git commit -m "Implement feature X

- Add component A
- Fix bug B
- Update documentation C"
```

### Pushing Changes

```bash
# Push to the remote branch
git push -u origin feat/your-branch-name

# Or if the branch already exists
git push
```

### Creating a PR

After pushing, create a PR using the GitHub CLI:

```bash
gh pr create --title "Implement feature X" --body "See PR summary template above"
```

Or create the PR manually on GitHub.

## Handoff Checklist

Before handing off to another agent, ensure:

- [ ] You've read the ticket thoroughly
- [ ] You've kept changes scoped to the ticket's scope
- [ ] You've run `npm run lint` and it passes
- [ ] You've run `npm run typecheck` and it passes
- [ ] You've run `npm run build` and it passes
- [ ] You've summarized all files you touched
- [ ] You've documented any important decisions or trade-offs
- [ ] You've noted any dependencies or prerequisites for the next agent
- [ ] You've pushed your changes to the remote branch
- [ ] You've created a PR with a clear summary

## Additional Resources

- [AGENTS.md](../AGENTS.md) - Agent handbook and coding conventions
- [docs/PRODUCT_PLAN.md](PRODUCT_PLAN.md) - Product plan and requirements
- [docs/ARCHITECTURE.md](ARCHITECTURE.md) - Architecture and system design
- [docs/DATA_MODEL.md](DATA_MODEL.md) - Data model and business rules
- [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Design system and visual guidelines
- [docs/QA_CHECKLIST.md](QA_CHECKLIST.md) - Manual QA flows
- [docs/SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) - Security rules and checks
- [.board/](../.board/) - Ticket board with all tickets
