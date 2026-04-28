# Common Area Design System

## Purpose
Common Area should feel like a campus common room after college: warm, playful, editorial, lived-in, and socially inviting. The design system should support three core feelings:
- community
- authenticity
- connection through play

This is not a glossy startup dashboard aesthetic. It is not mysterious nightlife branding. It is not a generic events marketplace. It should feel like a real place people return to.

## Reference Interpretation
Reference cues to borrow:
- `222.place`: cursor-following photo objects, playful spatial composition, and a feeling of social proof through layered artifacts
- `MRM Brasil`: immersive motion, oversized type, strong pacing, and restrained palettes with selective accent pops
- `Adcker`: editorial structure, oversized all-caps headings, and strong serif/sans contrast

What not to copy:
- 222's retro-mysterious palette
- MRM's agency tone
- Adcker's colder minimalist distance

The synthesis for Common Area should be:
- warmer
- more communal
- more lived-in
- more trustworthy
- more grounded by neighborhood and routine

## Brand Principles
- Familiar over flashy: the interface should feel like a place to return to, not a campaign splash page.
- Editorial over appy: structure content like a magazine spread or poster wall, not a SaaS dashboard.
- Playful over precious: use motion, stickers, and layered objects without becoming childish.
- Lived-in over polished: embrace paper, pins, postcards, tape, doodles, and imperfect framing.
- Cozy over sterile: colors, shadows, and spacing should feel warm and inhabited.
- Clear over chaotic: anti-design influences are allowed, but information hierarchy must remain obvious.

## Visual Personality
- Campus common room
- Neighborhood cafe bulletin board
- Student newspaper doodles
- Scrapped flyers and taped-up notices
- Slight cabaret confidence
- Friendly anti-design edges

## Color Palette Options

### Option A: Common Room Warmth
- `Ink`: `#201c1a`
- `Paper`: `#f6efe6`
- `Cream`: `#fff8f0`
- `Rust`: `#bd623f`
- `Butter`: `#f2cb71`
- `Moss`: `#677255`
- `Sky`: `#bfd4df`
- `Blush`: `#e8c2b8`

Use case:
- Best for Common Area's cozy, lived-in, post-grad campus identity
- Supports Crumbs well
- Warm enough for hospitality and community without feeling nostalgic-forced

### Option B: Night Seminar
- `Ink`: `#171414`
- `Chalk`: `#f3ede7`
- `Slate`: `#4f5963`
- `Brick`: `#9c4d3d`
- `Chartreuse`: `#c5cf5a`
- `Powder`: `#cbd9e6`
- `Sand`: `#d9c4a5`
- `Rose`: `#d89d92`

Use case:
- More dramatic and editorial
- Better if Common Area later leans more nightlife-cultural
- Slightly less cozy, slightly more art-direction forward

## Font Pairing Options

### Option A: Soft Editorial
- Display serif: `"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif`
- Body sans: `"Avenir Next", "Helvetica Neue", "Segoe UI", Arial, sans-serif`
- Mono/meta: `"SFMono-Regular", "SF Mono", "Consolas", monospace`

Why it works:
- Strong serif authority without feeling overly formal
- Warm contrast between display and body
- Good for oversized editorial headings

### Option B: Poster Common Room
- Display serif: `Georgia, "Times New Roman", serif`
- Body sans: `"Gill Sans", "Trebuchet MS", "Helvetica Neue", Arial, sans-serif`
- Mono/meta: `"SFMono-Regular", "SF Mono", "Consolas", monospace`

Why it works:
- More old-poster and zine-adjacent
- Slightly stranger and more anti-design
- Less refined on some systems

## Recommended Direction
Use:
- Palette Option A: Common Room Warmth
- Font Pairing Option A: Soft Editorial

Rationale:
- It gives Common Area enough warmth to feel social and local
- It supports Crumbs' cozy, dry personality
- It stays readable and trustworthy for onboarding, payments, and later structured flows
- It leaves room for playful accent colors, scrapbooking, and photo-object motion without making the product visually noisy

## Typography System
- Hero display: large serif, tight tracking, high contrast, 4.5rem to 7rem depending on breakpoint
- Section title: serif or all-caps sans depending on section tone
- Kicker/eyebrow: uppercase sans, tightly tracked
- Body: clean sans with generous line height
- Meta labels: small uppercase sans
- Data points: bold sans with restrained spacing

Rules:
- Headlines can be dramatic; paragraphs should stay calm
- Use all-caps sparingly and mostly for labels, nav, or large poster moments
- Maintain clear hierarchy with size and weight, not color alone

## Spacing And Layout System
- Use roomy vertical spacing between sections
- Prefer max-width containers around `72rem` to `80rem`
- Allow split layouts with one dense editorial column and one artifact/object column
- Use asymmetry where helpful: offset blocks, layered cards, staggered grids

Suggested scale:
- `space-1`: 4
- `space-2`: 8
- `space-3`: 12
- `space-4`: 16
- `space-5`: 24
- `space-6`: 32
- `space-7`: 48
- `space-8`: 64
- `space-9`: 96

Radius guidance:
- Buttons: fully pill or soft capsule
- Cards: large rounded rectangles
- Polaroids: smaller radius with visible frame edge
- Stickers: variable, slightly irregular

## Motion Principles
- Motion should feel like objects settling into place, not slick UI chrome.
- Prefer a few meaningful gestures over constant animation.
- Use easing that feels weighted and human.
- Keep motion comfortable and optional.

Motion rules:
- Hover should lift or rotate very slightly
- Scroll reveals should feel staggered and composed
- Cursor-follow elements should lag softly, not stick aggressively to the pointer
- Ambient motion should be subtle and low-frequency

Suggested easing:
- standard: `cubic-bezier(0.22, 1, 0.36, 1)`
- soft: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- hover duration: `160ms`
- reveal duration: `420ms`
- ambient duration: `8s` to `16s`

## Component Principles
- Components should feel tactile, layered, and slightly collectible.
- Every reusable primitive should work in both polished and playful contexts.
- Avoid sterile gray borders and default white cards.
- Cards should feel like surfaces, not flat rectangles.

## Reusable UI Patterns

### Buttons
- Pill or capsule shape
- All-caps or small-caps feeling
- Dense, confident label
- Strong contrast for primary
- Soft border for secondary
- Hover: lift `1px` to `2px`, slight shadow growth

### Cards
- Use creamy surfaces instead of pure white where possible
- Large radii
- Layered shadows with a soft paper feel
- Occasional tilted variants for scrapbook moments

### Badges
- Should feel like stamps, labels, or small stickers
- Uppercase and tightly tracked
- Can use cream, butter, or rust tints

### Section Headers
- Eyebrow label above large serif title
- Optional side note or caption
- Strong vertical rhythm

### Photo / Polaroid Modules
- White or cream frame with a thicker bottom margin
- Slight rotation allowed
- Shadow should suggest a physical object
- Optional caption area in small sans or mono
- Cursor-following behavior should be reserved for 1-3 featured elements, not the whole page

### Sticker Elements
- Small punchy labels with accent fills
- Use for side comments, Crumbs notes, or tiny calls to action
- Can overlap cards or image blocks
- Never cover key reading content

## Motion Patterns

### Hover
- Buttons: `translateY(-1px)` and shadow deepen
- Cards: tiny lift and tiny rotate where appropriate
- Stickers: slight nudge or tilt

### Scroll Reveal
- Fade + `translateY(12px)` to `0`
- Stagger children in 50ms to 90ms increments
- Do not use for all content; reserve for section entries and photo objects

### Cursor-Follow Elements
- Use on polaroids, note cards, or floating artifacts
- Position should interpolate softly rather than snap
- Limit movement range so objects feel anchored

### Ambient Page Motion
- Slow drifting gradients
- Occasional soft wobble on decorative shapes
- No constant bouncing or looping mascot animation

## Imagery And Art Direction
- No stock-photos-first approach
- Favor candid, tactile, social documentation
- Think flyer wall, photocopied poster, instant film, cafe tabletop
- If future photography is added:
  - real Chicago places
  - mixed lighting
  - social scenes that feel unforced
  - details like coffee cups, tickets, ceramics, game pieces, hand-written notes

## Mascot Usage Rules
- Crumbs is not a hyperactive mascot
- Crumbs should appear as a lounge-cat witness to community, not as a hype machine
- Crumbs can anchor side notes, empty states, and comfort-copy
- Crumbs should not dominate every screen

Visual rules:
- orange or gray tabby
- loaf, curl, windowsill, couch, flyer stack
- half-lidded or mildly unimpressed expression
- more doodle than polished icon

## Copy And Voice Guidelines
- Warm, dry, grounded
- Low-pressure
- Lightly funny
- Never trying too hard
- Never overly online

Good voice cues:
- “Crumbs saved you a spot.”
- “Showing up counts.”
- “Your couch will forgive you.”
- “You can leave after an hour.”
- “Community is mostly showing up and knowing where the snacks are.”

Avoid:
- hype slang
- startup cliché confidence
- aggressive urgency
- forced intimacy

## Token Plan For Tailwind / CSS Variables

### Core Color Tokens
- `--background`
- `--foreground`
- `--paper`
- `--paper-strong`
- `--panel`
- `--accent`
- `--accent-dark`
- `--accent-soft`
- `--butter`
- `--moss`
- `--sky`
- `--line`
- `--shadow`

### Typography Tokens
- `--font-display`
- `--font-sans`
- `--font-mono`

### Radius Tokens
- `--radius-button`
- `--radius-card`
- `--radius-sticker`

### Motion Tokens
- `--ease-standard`
- `--ease-soft`
- `--duration-fast`
- `--duration-base`
- `--duration-slow`

### Shadow Tokens
- `--shadow-card`
- `--shadow-polaroid`
- `--shadow-button`

## Implementation Notes
- Keep the landing page stable for now; use the design system to evolve shared primitives and future pages gradually.
- Prefer CSS variables for brand tokens so later theme shifts are centralized.
- Add motion progressively, especially cursor-follow artifacts, rather than introducing many animations at once.

## Final Direction Summary
Common Area should look like:
- a neighborhood common room
- a campus bulletin board
- a stylish but comfortable student paper spread

It should not look like:
- a slick SaaS dashboard
- a nightlife brand
- a retro mystery club
- a hyperactive Gen Z meme app

The winning combination is:
- warm cream-and-rust palette
- bold editorial serif with clean sans support
- scrapbook layering
- subtle cursor-follow artifact moments
- quiet, grounded Crumbs humor
