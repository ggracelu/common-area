# Crumbs the Cat - Mascot Design System

**Version:** 1.0
**Status:** Final
**Last updated:** 2026-05-04

---

## Overview

Crumbs is Common Area's resident lounge cat—a pixelated gray tabby with dorky charm who embodies warmth, laziness, observation, and low-pressure community. Crumbs appears throughout the product as a guide, helper, and occasional source of dry humor.

---

## Brand Personality

### Core Traits
- **Dry**: Crumbs doesn't hype. Crumbs observes.
- **Warm**: Cozy, approachable, lived-in
- **Lazy**: Comfortable with stillness, naps, and slow moments
- **Observant**: Watching community form without interfering
- **Low-pressure**: "Showing up counts" is the highest bar

### What Crumbs Is Not
- Not a hype mascot (no "Let's go team!" energy)
- Not a cute mascot (no "Aww, look at the kitty!" energy)
- Not a corporate mascot (no "We value your feedback!" energy)
- Not a childish mascot (the product is for adults 21-27)

---

## Visual Design

### Base Characteristics
- **Species**: Gray tabby cat
- **Style**: Pixel art (8-bit inspired)
- **Size**: Compact, fits in UI without dominating
- **Colors**: Gray (#cfcfcf), dark gray (#9b9b9b), white (#e7e7e7), black (#0a0a0a)
- **Accent**: Pink nose (#ff3b2e), lime Zzz (#E9FF6B)

### Body Structure
```
┌─────────────────────────────────┐
│  EARS  ───  HEAD  ───  EARS     │
│         (20x14)                 │
│                                 │
│  BODY  ───  BELLY  ───  TAIL   │
│  (28x16)   (10x8)    (7x4)     │
│                                 │
│  PAWS  ───  PAWS               │
│  (7x4)     (7x4)               │
└─────────────────────────────────┘
```

### Tabby Pattern
- Base: Light gray (#cfcfcf)
- Stripes: Dark gray (#9b9b9b, #8e8e8e)
- Pattern: Horizontal stripes with slight variation
- Belly: White/cream (#e7e7e7)

---

## Poses

### Available Poses

| Pose | Description | Use Case |
|------|-------------|----------|
| **sit** | Sitting upright, alert | Default state, greetings |
| **curl** | Curled up, cozy | Empty states, waiting |
| **nap** | Loaf position, sleeping | Loading, background |
| **stretch** | Stretched out | Success, completion |
| **yawn** | Mouth open yawning | Morning, waking up |
| **play** | Crouching, ready | Interactive elements |
| **curious** | Head tilted, alert | Questions, help |
| **sleepy** | Half-closed eyes | Late night, winding down |

### Pose Guidelines

**Default pose**: `sit` - Use for most situations
**Empty states**: `curl` or `nap` - When waiting for content
**Success states**: `stretch` - When something completes
**Interactive**: `play` or `curious` - When user can take action
**Loading**: `nap` with Zzz animation - When processing

---

## Expressions

### Available Expressions

| Expression | Description | Use Case |
|------------|-------------|----------|
| **neutral** | Calm, observant | Default state |
| **happy** | Slight smile, eye shine | Success, welcome |
| **curious** | Head tilted, alert | Questions, help |
| **sleepy** | Squinting eyes | Loading, late night |
| **playful** | Alert, ready | Interactive elements |
| **yawn** | Mouth open | Morning, transitions |

### Expression Guidelines

**Default expression**: `neutral` - Most situations
**Welcome**: `happy` - Sign-up, onboarding complete
**Help**: `curious` - FAQ, support
**Loading**: `sleepy` - Processing, waiting
**Interactive**: `playful` - Buttons, CTAs

---

## Animations

### Available Animations

| Animation | Duration | Use Case |
|-----------|----------|----------|
| **pose cycle** | 4s per pose | Idle states, hero |
| **tail wag (slow)** | 2s loop | Default state |
| **tail wag (fast)** | 0.8s loop | Playful, excited |
| **Zzz float** | 3s loop | Nap, loading |
| **Zzz float (slow)** | 4s loop | Deep sleep, long loading |

### Animation Guidelines

**Default**: Tail wag slow, pose cycle every 4s
**Reduced motion**: All animations disabled
**Loading**: Zzz animation, nap pose
**Interactive**: Tail wag fast, play pose
**Hero**: Full pose cycle, all animations

### Reduced Motion

All animations respect `prefers-reduced-motion`:
- Pose cycling disabled
- Tail wagging disabled
- Zzz animation disabled
- Static pose only

---

## Sizes

### Size Variants

| Size | Width | Height | Use Case |
|------|-------|--------|----------|
| **sm** | 32px | 24px | Icons, badges |
| **md** | 48px | 36px | Buttons, cards |
| **lg** | 64px | 48px | Sections, headers |
| **xl** | 96px | 72px | Hero, featured |

### Size Guidelines

**Icons**: `sm` - Navigation, status indicators
**Buttons**: `md` - CTA buttons, interactive elements
**Sections**: `lg` - Section headers, feature highlights
**Hero**: `xl` - Landing page hero, mascot introduction

---

## Copy Guidelines

### Copy Categories

#### Greeting
- "Crumbs saved you a spot."
- "Showing up counts."
- "Your couch will forgive you."
- "You can leave after an hour."
- "Community is mostly showing up and knowing where the snacks are."

#### Encouragement
- "No swiping. Just show up."
- "Overlap makes recognition happen."
- "A room you can return to."
- "Familiar faces, familiar places."

#### Onboarding
- "Ask a question."
- "Find your cohort."
- "Pick your activities."
- "You're doing great."

#### Empty States
- "Nothing here yet. Crumbs is napping."
- "Crumbs is observing. Check back soon."
- "The room is quiet. Crumbs approves."

#### Error States
- "Crumbs is confused. Try again?"
- "Something went wrong. Crumbs is investigating."
- "Crumbs suggests refreshing the page."

#### Success States
- "Crumbs approves!"
- "You did it! Crumbs is proud."
- "Crumbs saved your spot."

### Copy Voice

**Tone**: Dry, warm, observational
**Length**: Short, punchy (under 15 words)
**Style**: Complete sentences, no fragments
**Punctuation**: Periods, no exclamation points (except success)

### Copy Guidelines

**Default**: Use greeting copy for most situations
**Empty states**: Use empty copy when no content
**Error states**: Use error copy when something fails
**Success states**: Use success copy when something completes
**Onboarding**: Use onboarding copy during setup

---

## Usage Examples

### Basic Usage

```tsx
import { Crumbs } from "@/components/brand/Crumbs";

// Default size, animated
<Crumbs />

// Large size, static
<Crumbs size="lg" animated={false} />

// Specific pose and expression
<Crumbs pose="nap" expression="sleepy" />

// Extra large, custom pose
<Crumbs size="xl" pose="stretch" expression="happy" />
```

### With Copy

```tsx
import { Crumbs, CrumbsLine } from "@/components/brand/Crumbs";

<div>
  <Crumbs size="lg" pose="curious" />
  <p><CrumbsLine context="greeting" /></p>
</div>
```

### Context-Specific

```tsx
// Empty state
<div className="empty-state">
  <Crumbs pose="nap" expression="sleepy" size="lg" />
  <p><CrumbsLine context="empty" /></p>
</div>

// Success state
<div className="success-state">
  <Crumbs pose="stretch" expression="happy" size="xl" />
  <p><CrumbsLine context="success" /></p>
</div>

// Loading state
<div className="loading-state">
  <Crumbs pose="nap" expression="sleepy" animated />
  <p>Loading...</p>
</div>
```

---

## Accessibility

### ARIA Labels

All Crumbs instances include proper ARIA labels:
```tsx
aria-label="Crumbs the Cat, Common Area's resident lounge cat mascot"
role="img"
```

### Keyboard Navigation

Crumbs supports keyboard focus:
- Tab: Navigate to Crumbs
- Enter/Space: Activate (if interactive)
- Focus visible: Blue outline (#1A5CFF)

### Screen Readers

Crumbs is announced as:
- "Crumbs the Cat, Common Area's resident lounge cat mascot"

### Reduced Motion

All animations respect `prefers-reduced-motion`:
- Pose cycling disabled
- Tail wagging disabled
- Zzz animation disabled
- Static pose only

### Color Contrast

All text meets WCAG AA:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

---

## Responsive Design

### Mobile

- **Size**: Use `md` or `lg` for mobile
- **Animation**: Reduced motion by default on mobile
- **Position**: Center or left-aligned
- **Spacing**: 8-16px padding

### Tablet

- **Size**: Use `lg` or `xl` for tablet
- **Animation**: Full animation support
- **Position**: Center or right-aligned
- **Spacing**: 16-24px padding

### Desktop

- **Size**: Use `xl` for desktop hero
- **Animation**: Full animation support
- **Position**: Flexible
- **Spacing**: 24-32px padding

---

## Performance

### Optimization

- **SVG**: Inline SVG, no external requests
- **CSS animations**: GPU-accelerated transforms
- **Lazy loading**: Images lazy-loaded where applicable
- **Reduced motion**: Disabled for performance

### Best Practices

- Use `animated={false}` for non-hero sections
- Use smaller sizes for repeated instances
- Limit pose cycling in performance-critical areas
- Test on low-end devices

---

## Brand Consistency

### Do's

✅ Use Crumbs for empty states
✅ Use Crumbs for success states
✅ Use Crumbs for loading states
✅ Use Crumbs copy for helper text
✅ Keep Crumbs dry and observational
✅ Respect reduced motion preferences

### Don'ts

❌ Use Crumbs for critical errors
❌ Use Crumbs for payment flows
❌ Use Crumbs for legal content
❌ Make Crumbs hype or excited
❌ Overuse Crumbs (max 2-3 per page)
❌ Ignore accessibility guidelines

---

## Future Enhancements

### Planned Features

- [ ] More poses (groom, hunt, hide)
- [ ] More expressions (worried, excited)
- [ ] Seasonal variants (winter, summer)
- [ ] Interactive behaviors (click to pet)
- [ ] Sound effects (meow, purr)
- [ ] 3D version for AR/VR

### Considered Features

- [ ] Crumbs avatar generator
- [ ] Crumbs sticker pack
- [ ] Crumbs merchandise
- [ ] Crumbs social media presence

---

## Maintenance

### Version History

- **v1.0** (2026-05-04): Initial release with 8 poses, 6 expressions, full animation system

### Update Process

1. Update version number
2. Document changes
3. Update examples
4. Test accessibility
5. Deploy to production

### Contact

For questions about Crumbs design or usage, contact the design team.

---

## Resources

### Design Files

- Figma: [Crumbs Design System](https://figma.com/file/crumbs)
- SVG: [Crumbs SVG Library](/assets/crumbs)
- Icons: [Streamline Pixel](https://streamlineicons.com/pixel)

### Documentation

- [Brand Guidelines](/docs/BRAND_GUIDELINES.md)
- [Design System](/docs/DESIGN_SYSTEM.md)
- [Component Library](/docs/COMPONENT_LIBRARY.md)

### Code

- Component: `/components/brand/Crumbs.tsx`
- Styles: `/components/brand/Crumbs.css`
- Types: `/types/crumbs.ts`

---

**Crumbs the Cat** - Making Common Area feel like home, one nap at a time.
