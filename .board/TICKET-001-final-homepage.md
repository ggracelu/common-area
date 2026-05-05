# TICKET-001: Final Homepage

## Owner
- Agent: Frontend/Design agent
- Branch: `feat/final-homepage`
- Worktree: `/Users/gracelu/Desktop/mpcs/whynot-qa`

## Goal
Complete the public landing page with final design system implementation.

## Scope
- `app/page.tsx` - Landing page
- `app/layout.tsx` - Root layout
- `components/landing/` - Landing page components
- `app/globals.css` - Global styles and design tokens
- `public/` - Static assets (images, icons)

## Out of scope
- Do not modify authentication flows
- Do not modify protected routes
- Do not add Stripe integration
- Do not modify Supabase schema
- Do not add activity selection
- Do not add cohort assignment
- Do not add chat
- Do not add bingo

## Dependencies
- None (can be worked in parallel with other tickets)

## Acceptance criteria
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Landing page matches design system (DESIGN_SYSTEM.md)
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Accessibility passes basic checks (keyboard navigation, ARIA labels, color contrast)
- [ ] Crumbs mascot appears appropriately (not overused)
- [ ] Brand voice matches AGENTS.md guidelines

## Handoff notes
The landing page is the public face of Common Area. It should feel warm, editorial, and inviting without being childish. Use the "Common Room Warmth" palette and "Soft Editorial" font pairing from DESIGN_SYSTEM.md.

Key design principles:
- Familiar over flashy
- Editorial over appy
- Playful over precious
- Lived-in over polished
- Cozy over sterile

The next agent will build on this foundation for protected routes and user flows.

## Status
todo
