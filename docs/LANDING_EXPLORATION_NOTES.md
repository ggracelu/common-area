# Landing Exploration Notes

This repo supports a **split preview** workflow:

- **Main site**: `http://localhost:3000` (real landing page via `app/page.tsx`)
- **Exploration gallery**: `http://localhost:3001` (design lab via `scripts/gallery-proxy.mjs`)
- **Standalone explorations**: `/explorations/[slug]` (each opens as its own mini-site)

These explorations are **design-only**. They must not add backend flows (Supabase, Stripe, selection/assignment, chat, bingo).

## New directions (advanced explorations)

### `common-room-radio`
- **What it’s testing**: A warm, analog “campus radio station” wrapper for the Common Area promise.
- **Typography**: Chunky, loud headline sans + mono station metadata + warm readable body sans.
- **Motion/interaction**: ON AIR pulse, radio ticker, floating album sleeves, hover lift on artifact cards.
- **Imagery**: Vinyl/turntable, bulletin board posters, candid laughter.

### `crumbs-cafe`
- **What it’s testing**: Café-as-common-room, with Crumbs as low-pressure host (not a hype mascot).
- **Typography**: Warm serif display + friendly sans body + handwritten-feeling labels (system-safe).
- **Motion/interaction**: CSS “steam” drift, lazy floating note, soft reveal cards, polaroid tilt.
- **Imagery**: Cozy café table + pastry, sleeping cat, pottery/city texture.

### `campus-after-dark`
- **What it’s testing**: A nightlife-adjacent tone that’s **dramatic but not clubby** (cabaret/poster energy).
- **Typography**: High-contrast serif display + condensed-ish label rhythm + crisp sans body.
- **Motion/interaction**: Spotlight drift, marquee strip, fan-out hover on image stack.
- **Imagery**: Stage/mic, warm flash/candid laughter, tactile “after dark” artifacts.

### `field-guide`
- **What it’s testing**: City-as-campus via a guidebook + map metaphor (routes, pins, stamps, notes).
- **Typography**: Bookish serif headings + utilitarian sans body + mono coordinates/meta.
- **Motion/interaction**: Route line draw, subtle pin bob, “discovered” reveals.
- **Imagery**: Street mural / neighborhood texture, pottery, coffee table, stage.

### `house-party-bulletin`
- **What it’s testing**: Maximal bulletin board / anti-design collage while keeping hierarchy readable.
- **Typography**: Loud all-caps display + serif pull quote moments + casual rounded body.
- **Motion/interaction**: Sticker wiggle, flyer stack lift, loud marquee announcements.
- **Imagery**: Bulletin board flyers + candid social proof.

## Notes on fonts
- Each direction intentionally uses **distinct system-safe font stacks** (no external font files added).
- The baseline site still uses the design system’s recommended pairing in `app/globals.css`.

## Notes on imagery
- Explorations use **direct `images.unsplash.com` URLs** with `img` tags, `loading="lazy"`, and meaningful `alt` text.
- Inline captions include “Photo via Unsplash” where appropriate.

