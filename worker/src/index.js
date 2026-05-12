/**
 * Elite Car Tinting — Cloudflare Worker
 *
 * Routes:
 *   GET  /  → Google Business Profile reviews proxy (cached)
 *
 * Secrets (set via `wrangler secret put <NAME>`):
 *   GOOGLE_API_KEY   → Restricted Places API key
 *   GOOGLE_PLACE_ID  → Google Place ID (e.g. ChIJ...)
 *
 * Deploy:
 *   1. npm i -g wrangler
 *   2. wrangler login
 *   3. wrangler secret put GOOGLE_API_KEY
 *   4. wrangler secret put GOOGLE_PLACE_ID
 *   5. wrangler deploy
 *
 * Then update WORKER_BASE_URL in script.js to the deployed worker URL.
 */

// ─── Shared helpers ──────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  'https://www.elitecartinting.com.au',
  'https://elitecartinting.com.au',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'null' // file:// previews during local dev
];

const FIELD_MASK = [
  'displayName',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews.rating',
  'reviews.text',
  'reviews.relativePublishTimeDescription',
  'reviews.publishTime',
  'reviews.authorAttribution'
].join(',');

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    // ── OPTIONS preflight ────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ── GET /  →  Google Reviews proxy ──────────────────────────────────────
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(origin) });
    }

    if (!env.GOOGLE_API_KEY || !env.GOOGLE_PLACE_ID) {
      return json({ error: 'Worker not configured. Set GOOGLE_API_KEY and GOOGLE_PLACE_ID secrets.' }, 500, origin);
    }

    const cacheTtl = Number(env.REVIEWS_CACHE_SECONDS || 600); // 10 min default
    const cache = caches.default;
    const cacheKey = new Request(new URL('/reviews?v=1', request.url).toString(), request);

    // Serve from cache if fresh
    let cached = await cache.match(cacheKey);
    if (cached) {
      const headers = new Headers(cached.headers);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));
      headers.set('X-Cache', 'HIT');
      return new Response(cached.body, { status: cached.status, headers });
    }

    // Fetch from Google
    const googleUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(env.GOOGLE_PLACE_ID)}`;
    let gResp;
    try {
      gResp = await fetch(googleUrl, {
        headers: {
          'X-Goog-Api-Key': env.GOOGLE_API_KEY,
          'X-Goog-FieldMask': FIELD_MASK
        }
      });
    } catch {
      return json({ error: 'Upstream fetch failed' }, 502, origin);
    }

    if (!gResp.ok) {
      return json({ error: 'Google API error', status: gResp.status }, 502, origin);
    }

    const data = await gResp.json();

    const payload = {
      name: data.displayName?.text || 'Elite Car Tinting',
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri || null,
      reviews: (data.reviews || []).map((r) => ({
        authorName: r.authorAttribution?.displayName || 'Google User',
        profilePhotoUrl: r.authorAttribution?.photoUri || null,
        rating: r.rating ?? 5,
        text: r.text?.text || '',
        relativeTime: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || null
      })),
      fetchedAt: new Date().toISOString(),
      cacheTtl
    };

    const body = JSON.stringify(payload);
    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${cacheTtl}, s-maxage=${cacheTtl}`,
      'X-Cache': 'MISS',
      ...corsHeaders(origin)
    });

    const response = new Response(body, { status: 200, headers });
    // Store a clone in the edge cache (strip CORS so it's origin-agnostic)
    const cacheableHeaders = new Headers(headers);
    ['Access-Control-Allow-Origin', 'Vary'].forEach((h) => cacheableHeaders.delete(h));
    ctx.waitUntil(cache.put(cacheKey, new Response(body, { status: 200, headers: cacheableHeaders })));

    return response;
  }
};

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin)
    }
  });
}

