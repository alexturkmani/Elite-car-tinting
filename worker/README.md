# Elite Reviews Proxy (Cloudflare Worker)

Serverless proxy that fetches Google Business Profile reviews for Elite Car Tinting,
caches them at Cloudflare's edge, and serves them to the website. Keeps the Google
API key server-side and cuts API cost to ~$0/month on the free tier.

## Why a proxy?

| Concern | Direct from browser | Via this worker |
|---|---|---|
| API key exposure | Visible in JS (even if referrer-restricted) | Stored as encrypted secret |
| Cost | Every page visit = 1 API call | 1 call per 10 minutes, globally |
| CORS | Fine (Google allows it) | Fully locked to your domain |
| Offline resilience | Breaks instantly on API outage | Stale cache keeps serving |

## One-time setup

1. **Get a Google Places API key**
   - https://console.cloud.google.com → new project
   - Enable **Places API (New)**
   - Create API key, restrict to **Places API (New)** only (no HTTP referrer restriction needed — the worker calls from its own IP)

2. **Find your Place ID**
   - https://developers.google.com/maps/documentation/places/web-service/place-id
   - Search "Elite Car Tinting Essendon", copy the ID (starts with `ChIJ...`)

3. **Create a Cloudflare account** (free) at https://dash.cloudflare.com

4. **Install Wrangler** and deploy:
   ```bash
   cd worker
   npm install
   npx wrangler login                             # opens browser
   npx wrangler secret put GOOGLE_API_KEY         # paste the key
   npx wrangler secret put GOOGLE_PLACE_ID        # paste the Place ID
   npx wrangler deploy
   ```

   Wrangler will print a URL like:
   ```
   https://elite-reviews-proxy.<your-subdomain>.workers.dev
   ```

5. **Wire up the site** — open [`../script.js`](../script.js) and set:
   ```js
   const GOOGLE_REVIEWS_CONFIG = {
     proxyUrl: 'https://elite-reviews-proxy.<your-subdomain>.workers.dev',
     ...
   };
   ```

That's it. The worker will return fresh reviews to every visitor, refreshing
from Google at most once every 10 minutes.

## Adjusting refresh frequency

Edit `REVIEWS_CACHE_SECONDS` in [`wrangler.toml`](wrangler.toml) and redeploy.
- `300` → refresh every 5 min (more API calls)
- `600` → **default, 10 min**
- `3600` → hourly (cheapest)

## Testing locally

```bash
npx wrangler dev
# then hit http://127.0.0.1:8787/
```

## Cost

Cloudflare Workers free tier: 100,000 requests/day.
Google Places API: with 10-min cache = ~144 upstream calls/day = ~$2.40/month.
Google also gives $200/month free credit — so effectively **$0**.
