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

`assets/tint-preview.js` renders each 3M shade on a canvas. Light seen through tinted glass passes through the film twice, so interior visibility scales with VLT squared in linear light, plus a small surface reflection. 3M publishes VLT for film on 6mm, 73% VLT automotive glass, so the render's clear glass is treated as that glass.

The preview has tabs for 3M Ceramic IR, Crystalline and Color Stable. Every shade shows 3M's published VLT, total solar energy rejected, infrared rejected, UV rejected and glare reduced. The film data lives in `FILM_SERIES` in `scripts/build-site.mjs`. Sources: 3M Australia Ceramic IR brochure, 3M Crystalline brochure, 3M Color Stable technical data sheet (Rev B, Oct 2021).

A draggable before/after handle compares untinted glass with the selected film. It sweeps across the car once when the section scrolls into view.

The glass mask (`images/tint-coupe-glass.png`) was traced from `images/tint-coupe.webp` with the side mirror cut out.

## Placeholders

The logo, business name, addresses, hours, team, reviews and voucher terms are shown in [square brackets] until the client supplies them.
