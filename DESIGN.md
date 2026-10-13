# Demo Tint visual system

Midnight navy (`#01080c`) canvas with radial teal glows (`#072233`), white heavy grotesk headings (Schibsted Grotesk), Manrope body text and neon script accents (Yellowtail) in warm orange and cyan glow. Buttons are outlined or solid white with a trailing arrow. The header is a logo plus a frosted pill group (location, phone with live open status, menu).

## Fixes over the reference layout

- Content is visible without waiting for entrance animations; reveals only enhance it.
- Counters render their real values in HTML instead of starting at zero.
- No floating rating badge covering headings and footer buttons; mobile gets a slim call/quote bar instead.
- Stat icons sit in their own tiles instead of behind the numbers, and each stat has its own copy.
- Film selector buttons are a consistent size, with a shade swatch and NSW legality shown for each.
- Gallery images load properly, no duplicated contact fields, no off-palette link colours.

## Tint preview

`assets/tint-preview.js` renders the window shade on a canvas instead of laying a flat dark overlay on the glass. When you look into a car, light passes through the film twice (in, then back out after reflecting off the interior), so interior visibility scales with VLT² in linear light. A small exterior surface reflection is added. The render's clear glass is treated as ~88% factory glass. The result: 70% looks close to factory glass, 35% shows the cabin clearly but darker, 20% shows silhouettes, and 5% reads as black with reflections.

The glass mask (`images/tint-coupe-glass.png`) was traced from `images/tint-coupe.webp` with the side mirror cut out.

NSW limits shown in the selector: passenger car front side windows 35% VLT or lighter; rear side and rear windows 20% or lighter.
