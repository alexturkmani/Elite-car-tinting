# Tinting Business website demo

A reusable static website for a window tinting business. Navy and lavender styling, responsive service pages, a realistic interactive tint preview, film comparison tabs and an enquiry form preview.

Open `index.html` through a local HTTP server, for example `python -m http.server 5173`, then visit `http://localhost:5173`.

Run `node scripts/check-site.mjs` to validate local links, assets and page IDs.

## Personalising for a buyer

1. Replace the Tinting Business wordmark, phone, email, workshop, hours and gallery references with the buyer's details. The Melbourne suburb pages are sample service areas and should be adapted to the buyer's actual location.
2. Review the services, film specifications, pricing promises and warranties against the buyer's products. Add their own installation photos, certificates and verified reviews if applicable.
3. Set `FORMSUBMIT_EMAIL` in `script.js` to the buyer's enquiry email and activate it with FormSubmit. Update the demo notice and success message to describe the live enquiry flow. With no email configured, the form sends and saves nothing.
4. Point canonical, social and sitemap URLs to the buyer's domain. Replace `noindex, follow` with the desired indexing policy only once the content is personalised. Add actual business structured data at that point.

The car is stationary. Only its glass shade and reflection animate. The preview percentages are illustrative and do not specify a film's measured performance.

The review scraper is disabled by default. It requires a buyer's `GOOGLE_PLACE_ID` environment variable and the `ENABLE_REVIEW_SYNC` repository variable before it can run. No original customer reviews are shown in the demo.

This project is deployed through its existing Vercel project when `main` is pushed.

Demo address: https://elite-car-tinting.vercel.app. The original custom domain is detached from this Vercel project.
