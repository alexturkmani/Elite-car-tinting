# Demo Tint website

A static demo website for a window tinting and vehicle protection business serving Sydney and the Central Coast. The layout follows a dark, cinematic tint-studio style (full-bleed hero, neon script accents, glass header pills, stats, film selector, reviews and a three-column footer), rebuilt as lightweight static HTML with no page builder.

## Build and check

Every page is generated from `scripts/build-site.mjs`, which holds the shared header, menu, quote modal, footer and all page content.

```
node scripts/build-site.mjs   # writes every index.html, sitemap.xml and robots.txt
node scripts/check-site.mjs   # validates local links, assets, unique IDs and structured data
python -m http.server 5173    # preview at http://localhost:5173
```

Edit the build script rather than the generated HTML.

## Structure

- `assets/site.css`: design system and all layout styles
- `assets/site.js`: header, menu overlay, quote modal, forms, scroll reveals, counters, open-now status
- `assets/tint-preview.js`: physically based window tint preview (see DESIGN.md)
- `images/tint-coupe.webp` + `images/tint-coupe-glass.png`: car render and its glass mask for the preview
- `images/photos/`: section photography from Unsplash (free licence)
- `vercel.json`: clean URLs and redirects from the old page addresses

## Personalising for a buyer

1. Set `BRAND`, `PHONE`, `EMAIL` and `LOCATIONS` at the top of `scripts/build-site.mjs`, and replace the suburb list in `AREAS`.
2. Replace the stats, team placeholders, example reviews and accreditation badges with the buyer's verified details. Connect real Google reviews.
3. Swap stock photos for the buyer's own installation photos.
4. Set `FORMSUBMIT_EMAIL` in `assets/site.js` to receive enquiries. While empty, forms show the success state and send nothing.
5. Point `SITE` to the buyer's domain and remove `noindex` once content is final.

Deployed through the existing Vercel project when `main` is pushed: https://tinting-business-demo.vercel.app
