# Common Area design system

## Direction
Warm campus common room for Gen Z Chicago. Editorial hierarchy, lime/blue/magenta energy, and low-pressure Crumbs copy.

## Palette
- Ink `#0A0A0A`
- Paper `#FFFFFF`
- Lime `#E9FF6B`
- Blue `#1A5CFF`
- Magenta `#FF2FB8`

## Typography
- Display: bold system sans with tight tracking for headlines.
- Body: readable system sans with generous line height.
- Mono: short labels and status chips.

## Motion
- Prefer transform/opacity.
- Disable looping mascot motion when `prefers-reduced-motion` is set.
- Shader backdrops fall back to static gradients.

## Surfaces
- `ShaderBackdrop` for atmospheric depth.
- `LiquidGlassPanel` for cards and protected intro shells.
- `LiquidWordmark` for season lockups.

## Anti-patterns
- Generic purple SaaS gradients.
- Replacing pixel Crumbs with WebGL mascots.
- localStorage as the only source of truth for onboarding.
