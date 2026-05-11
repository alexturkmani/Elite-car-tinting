/**
 * Elite Car Tinting — Cloudflare Worker
 *
 * Routes:
 *   GET  /         → Google Business Profile reviews proxy (cached)
 *   POST /submit   → Form submission relay via Resend email API
 *
 * Secrets (set via `wrangler secret put <NAME>`):
 *   GOOGLE_API_KEY   → Restricted Places API key
 *   GOOGLE_PLACE_ID  → Google Place ID (e.g. ChIJ...)
 *   RESEND_API_KEY   → Resend API key (https://resend.com — free tier: 3 000 emails/month)
 *
 * Optional vars (wrangler.toml [vars] or `wrangler secret put`):
 *   RESEND_FROM      → Verified "from" address, e.g. noreply@elitecartinting.com.au
 *                      Defaults to: noreply@elitecartinting.com.au
 *   FORM_TO_EMAIL    → Destination inbox for form submissions
 *                      Defaults to: contact@elitecartinting.com.au
 *
 * Deploy:
 *   1. npm i -g wrangler
 *   2. wrangler login
 *   3. wrangler secret put GOOGLE_API_KEY
 *   4. wrangler secret put GOOGLE_PLACE_ID
 *   5. wrangler secret put RESEND_API_KEY
 *   6. wrangler deploy
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

    // ── POST /submit  →  form-submission email via Resend ───────────────────
    if (request.method === 'POST' && url.pathname === '/submit') {
      return handleSubmit(request, env, origin);
    }

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

// ─── Form submission handler ──────────────────────────────────────────────────

async function handleSubmit(request, env, origin) {
  if (!env.RESEND_API_KEY) {
    return json({ success: false, error: 'Worker not configured. Set RESEND_API_KEY secret.' }, 500, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body.' }, 400, origin);
  }

  // Sanitise and extract fields
  const name    = String(body.name    || '').trim().slice(0, 200);
  const phone   = String(body.phone   || '').trim().slice(0, 50);
  const email   = String(body.email   || '').trim().slice(0, 200);
  const service = String(body.service || '').trim().slice(0, 200);
  const car     = String(body.car     || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 2000);
  const subject = String(body._subject || 'New Form Submission — Elite Car Tinting').trim().slice(0, 300);

  if (!name && !phone && !email) {
    return json({ success: false, error: 'Submission must include at least name, phone, or email.' }, 422, origin);
  }

  const toEmail = (env.FORM_TO_EMAIL || 'contact@elitecartinting.com.au').trim();
  const fromAddress = (env.RESEND_FROM || 'noreply@elitecartinting.com.au').trim();

  // Build a simple HTML email
  const rows = [
    name    && `<tr><th>Name</th><td>${escHtml(name)}</td></tr>`,
    phone   && `<tr><th>Phone</th><td>${escHtml(phone)}</td></tr>`,
    email   && `<tr><th>Email</th><td>${escHtml(email)}</td></tr>`,
    service && `<tr><th>Service</th><td>${escHtml(service)}</td></tr>`,
    car     && `<tr><th>Vehicle</th><td>${escHtml(car)}</td></tr>`,
    message && `<tr><th>Message</th><td>${escHtml(message).replace(/\n/g, '<br>')}</td></tr>`,
  ].filter(Boolean).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${escHtml(subject)}</title>
<style>body{font-family:Arial,sans-serif;color:#222}table{border-collapse:collapse;width:100%;max-width:600px}th,td{text-align:left;padding:8px 12px;border:1px solid #ddd}th{background:#f5f5f5;width:120px}</style>
</head>
<body>
<h2>${escHtml(subject)}</h2>
<table>${rows}</table>
</body>
</html>`;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  let resendResp;
  try {
    resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toEmail],
        reply_to: validEmail ? email : undefined,
        subject,
        html
      })
    });
  } catch {
    return json({ success: false, error: 'Email service unreachable.' }, 502, origin);
  }

  if (!resendResp.ok) {
    return json({ success: false, error: 'Email service error.' }, 502, origin);
  }

  return json({ success: true }, 200, origin);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
