// Builds every page of the Demo Tint website from shared partials.
// Run: node scripts/build-site.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = 'https://tinting-business-demo.vercel.app';
const BRAND = 'Demo Tint';
const PHONE = '1300 000 000';
const PHONE_HREF = 'tel:1300000000';
const EMAIL = 'hello@demotint.com.au';
const VERSION = '20261017';

const LOCATIONS = [
  { name: 'Sydney', address: '[Street address]', locality: '[Suburb] NSW', hours: '[Opening hours]' },
  { name: 'Central Coast', address: '[Street address]', locality: '[Suburb] NSW', hours: '[Opening hours]' }
];

// ---------- Icons ----------
const I = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h3.5l1.6 4.6-2.2 1.5a12 12 0 0 0 6 6l1.5-2.2L20 14.5V18a2 2 0 0 1-2.1 2A16 16 0 0 1 3 5.1 2 2 0 0 1 5 3z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6"/></svg>',
  google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14" r="6"/><path d="M8.5 9.2L6 3h4l2 4 2-4h4l-2.5 6.2"/><path d="M12 11.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.6-3.4 8.3-8 9-4.6-.7-8-4.4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z"/><path d="M19 15c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3z"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16H3.5v-4l2-5.5A2 2 0 0 1 7.4 5h9.2a2 2 0 0 1 1.9 1.5l2 5.5v4H19"/><path d="M3.5 12h17"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M9.5 16.5h5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5l8-2v18M12 8l8 2v11M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/></svg>',
  pin2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19l7-7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A20 20 0 0 0 14.3 4c-2.3 0-3.8 1.4-3.8 4v2.5H8v3h2.5V21z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- 3M automotive film data ----------
// Source: 3M product brochures / technical data sheets. All figures are for film applied to
// 6mm, 73% VLT automotive green glass, so VLT is the combined glass + film value.
const FILM_SERIES = [
  {
    id: 'ir', name: '3M Ceramic IR', blurb: 'Nano-ceramic film with a neutral colour. Strong infrared rejection across every shade.',
    shades: [
      { code: 'IR 5', vlt: 5, tser: 66, irr: 95, uv: 99.9, glare: 93 },
      { code: 'IR 15', vlt: 16, tser: 63, irr: 90, uv: 99.9, glare: 78 },
      { code: 'IR 25', vlt: 25, tser: 61, irr: 90, uv: 99.9, glare: 65 },
      { code: 'IR 30', vlt: 30, tser: 60, irr: 88, uv: 99.9, glare: 59 },
      { code: 'IR 35', vlt: 37, tser: 58, irr: 85, uv: 99.8, glare: 49 },
      { code: 'IR 50', vlt: 50, tser: 54, irr: 83, uv: 99.8, glare: 32 },
      { code: 'IR 70', vlt: 64, tser: 51, irr: 78, uv: 99.6, glare: 12 },
    ],
  },
  {
    id: 'cr', name: '3M Crystalline', blurb: 'Multilayer optical film. The most heat rejection of any 3M film, even in the lightest shades.',
    shades: [
      { code: 'CR 20', vlt: 17, tser: 64, irr: 99, uv: 99.9, glare: 77 },
      { code: 'CR 40', vlt: 33, tser: 62, irr: 99, uv: 99.9, glare: 55 },
      { code: 'CR 50', vlt: 42, tser: 59, irr: 98, uv: 99.9, glare: 43 },
      { code: 'CR 60', vlt: 51, tser: 57, irr: 98, uv: 99.9, glare: 30 },
      { code: 'CR 70', vlt: 58, tser: 55, irr: 97, uv: 99.9, glare: 21 },
      { code: 'CR 80', vlt: 62, tser: 52, irr: 96, uv: 99.8, glare: 15 },
      { code: 'CR 90', vlt: 72, tser: 46, irr: 95, uv: 99.9, glare: 1 },
    ],
  },
  {
    id: 'cs', name: '3M Color Stable', blurb: 'Neutral black film with a lifetime warranty against colour change. Will not turn purple.',
    shades: [
      { code: 'CS 5', vlt: 7, tser: 64, irr: 70, uv: 99, glare: 94 },
      { code: 'CS 20', vlt: 15, tser: 60, irr: 58, uv: 99, glare: 79 },
      { code: 'CS 35', vlt: 32, tser: 55, irr: 39, uv: 98, glare: 56 },
      { code: 'CS 50', vlt: 43, tser: 51, irr: 27, uv: 98, glare: 42 },
    ],
  },
];
const DEFAULT_SHADE = 'IR 35';
const range = (s, k) => [Math.min(...s.shades.map(x => x[k])), Math.max(...s.shades.map(x => x[k]))];

// ---------- Navigation ----------
const NAV = [
  ['/', 'Home'],
  ['/about/', 'About'],
  ['/products/', 'Products'],
  ['/window-tinting-services/', 'Services'],
  ['/commercial-window-tinting/', 'Commercial'],
  ['/vouchers/', 'Vouchers'],
  ['/contact/', 'Contact'],
];

const SERVICES = [
  ['car', 'Car window tinting'],
  ['home', 'Home window tinting'],
  ['commercial', 'Commercial window tinting'],
  ['ppf', 'Paint protection film'],
  ['other', 'Something else'],
];

const badge3m = (cls = '') => `<span class="badge-3m ${cls}"><img src="/images/brands/3m.svg" alt="3M" width="300" height="158"></span>`;
const logo = () => `<span class="logo-ph">[BRAND LOGO]</span>`;

function header(current) {
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="shell header-row">
    <a class="logo" href="/" aria-label="Home">${logo()}</a>
    <div class="header-right">
      <div class="header-pills">
        <a class="pill loc" href="/contact/#locations"><span class="pill-icon">${I.pin}</span><span><b>Sydney &amp; Central Coast</b><small>Two workshops</small></span></a>
        <a class="pill phone" href="${PHONE_HREF}" aria-label="Call ${PHONE}"><span class="pill-icon">${I.phone}</span><span class="pill-text"><b>${PHONE}</b><small data-open-status>Mon–Sat</small></span></a>
      </div>
      <button class="menu-btn" type="button" data-menu-open aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="menu-panel" id="menu" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden="true" inert>
  <button class="menu-close" type="button" data-menu-close aria-label="Close menu">&times;</button>
  <nav class="menu-nav" aria-label="Main">
    ${NAV.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('\n    ')}
  </nav>
  <div class="menu-aside">
    <div><h3>Call</h3><a href="${PHONE_HREF}">${PHONE}</a></div>
    <div><h3>Email</h3><a href="mailto:${EMAIL}">${EMAIL}</a></div>
    <div><h3>Workshops</h3><p>${LOCATIONS.map(l => l.name).join(' &amp; ')}</p></div>
    <div class="btn-row"><a class="btn" href="/quote/" data-quote>Get a quote</a><a class="btn btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
  </div>
</div>`;
}

function quoteForm(id) {
  const shadeOptions = FILM_SERIES.map(s => `<optgroup label="${s.name}">${s.shades.map(x => `<option>${s.name} ${x.code} (${x.vlt}% VLT)</option>`).join('')}</optgroup>`).join('');
  return `<form class="form" data-enquiry novalidate>
  <fieldset>
    <legend>Vehicle or property</legend>
    <div class="field full"><label for="${id}-service">Service</label><select id="${id}-service" name="service" required>${SERVICES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
    <div class="field"><label for="${id}-make">Vehicle make</label><input id="${id}-make" name="make" placeholder="e.g. Toyota" autocomplete="off"></div>
    <div class="field"><label for="${id}-model">Vehicle model</label><input id="${id}-model" name="model" placeholder="e.g. RAV4" autocomplete="off"></div>
    <div class="field"><label for="${id}-year">Year</label><input id="${id}-year" name="year" inputmode="numeric" pattern="[0-9]{4}" placeholder="e.g. 2022"></div>
    <div class="field"><label for="${id}-shade">Film and shade</label><select id="${id}-shade" name="shade"><option value="">Not sure yet</option>${shadeOptions}</select></div>
    <div class="field"><label for="${id}-removal">Remove old tint?</label><select id="${id}-removal" name="removal"><option>No</option><option>Yes</option><option>Not sure</option></select></div>
    <div class="field"><label for="${id}-location">Workshop</label><select id="${id}-location" name="location">${LOCATIONS.map(l => `<option>${l.name}</option>`).join('')}</select></div>
    <div class="field full"><label for="${id}-notes">Anything else?</label><textarea id="${id}-notes" name="notes" placeholder="Which windows, timing, or the address for home and commercial jobs"></textarea></div>
  </fieldset>
  <fieldset>
    <legend>Your details</legend>
    <div class="field full"><label for="${id}-name">Name</label><input id="${id}-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="${id}-phone">Phone</label><input id="${id}-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel"></div>
    <div class="field"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" required autocomplete="email"></div>
  </fieldset>
  <div class="form-foot"><p>Demo form. Nothing is sent until an email address is set up.</p><button class="btn btn-solid" type="submit">Send</button></div>
  <div class="form-success" role="status"><div class="ok-icon">${I.check}</div><h3>Thanks</h3><p class="muted">We've got your details and will reply with a price.</p></div>
</form>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell footer-grid">
    <div>
      <h2>Contact</h2>
      <ul class="footer-list">
        <li><a href="${PHONE_HREF}">${PHONE}</a></li>
        <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
        ${LOCATIONS.map(l => `<li>${l.name}<br><span class="footer-sub">${l.address}</span></li>`).join('\n        ')}
      </ul>
      <div class="socials"><a href="#" aria-label="Facebook">${I.fb}</a><a href="#" aria-label="Instagram">${I.ig}</a><a href="#" aria-label="Google">${I.google}</a></div>
      <div class="btn-row"><a class="btn btn-sm" href="/quote/" data-quote>Get a quote</a><a class="btn btn-sm btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
    </div>
    <div class="footer-brand">
      <a class="logo" href="/" aria-label="Home">${logo()}</a>
      <p class="muted">Window tinting for cars, homes and businesses.</p>
      <div class="footer-3m">${badge3m()}<span>Installer of 3M window film</span></div>
    </div>
    <div>
      <h2>Pages</h2>
      <ul class="footer-list">
        ${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('\n        ')}
        <li><a href="/privacy-policy/">Privacy policy</a></li>
      </ul>
    </div>
  </div>
  <div class="shell footer-base"><span>&copy; <span data-year>2026</span> [Business name]. 3M is a trademark of 3M Company.</span><span>Demo site</span></div>
</footer>
<div class="action-bar"><a class="btn" href="${PHONE_HREF}">Call</a><a class="btn btn-solid" href="/quote/" data-quote>Get a quote</a></div>
<div class="modal" id="quote" role="dialog" aria-modal="true" aria-labelledby="quote-title" aria-hidden="true" inert>
  <div class="modal-box">
    <button class="menu-close" type="button" data-modal-close aria-label="Close quote form">&times;</button>
    <div class="modal-head"><h2 id="quote-title">Get a quote</h2><p>Tell us what you need. We reply with a fixed price.</p></div>
    ${quoteForm('mq')}
  </div>
</div>`;
}

function page({ slug, title, description, body, current, schema, preload }) {
  const url = SITE + slug;
  const ld = schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : '';
  const html = `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/images/og-image.jpg">
<meta name="theme-color" content="#01080c">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Schibsted+Grotesk:wght@500;600;700;800;900&family=Yellowtail&display=swap">
${preload ? `<link rel="preload" as="image" href="${preload}">` : ''}
<link rel="stylesheet" href="/assets/site.css?v=${VERSION}">
${ld}
</head>
<body>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/site.js?v=${VERSION}" defer></script>
${body.includes('data-tint-preview') ? `<script src="/assets/tint-preview.js?v=${VERSION}" defer></script>` : ''}
</body>
</html>
`;
  const dir = path.join(ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return slug;
}

// ---------- Reusable sections ----------
const pageHero = ({ script, title, text, img, crumbs }) => `<section class="page-hero">
  <div class="page-hero-media"><img src="${img}" alt="" fetchpriority="high"></div>
  <div class="shell">
    ${script ? `<span class="script warm">${script}</span>` : ''}
    <h1 class="h-xl">${title}</h1>
    <p>${text}</p>
    ${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${crumbs}</span></nav>` : ''}
  </div>
</section>`;

const specCells = s => [['vlt', 'Visible light in'], ['tser', 'Solar energy rejected'], ['irr', 'Infrared rejected'], ['uv', 'UV rejected'], ['glare', 'Glare reduced']].map(([k, l]) => `<div><h4>${l}</h4><p data-spec="${k}">${s[k]}%</p><div class="spec-bar" aria-hidden="true"><i style="width:${s[k]}%"></i></div></div>`).join('');

const tintSelector = (id = 'shades') => {
  const first = FILM_SERIES[0].shades.find(x => x.code === DEFAULT_SHADE);
  return `<section class="section glow-c selector" id="${id}">
  <div class="shell">
    <div class="section-head center reveal">
      <span class="script center-script">Shade preview</span>
      <h2 class="h-lg">Compare 3M film shades</h2>
      <p class="copy">Pick a 3M range and a shade, then drag the line across the car to compare it with untinted glass. Every figure is from 3M's data sheets.</p>
    </div>
    <div class="reveal" data-tint-preview data-car="/images/tint-coupe.webp" data-mask="/images/tint-coupe-glass.png" data-blurbs='${esc(JSON.stringify(Object.fromEntries(FILM_SERIES.map(x => [x.id, x.blurb]))))}'>
      <div class="series-tabs" role="tablist" aria-label="3M film range">
        ${FILM_SERIES.map((s, k) => `<button type="button" role="tab" class="series-tab" data-series="${s.id}" aria-selected="${k === 0}">${s.name.replace('3M ', '')}</button>`).join('')}
      </div>
      <p class="series-blurb" data-series-blurb>${FILM_SERIES[0].blurb}</p>
      <div class="selector-stage">
        <img class="car-fallback" src="/images/tint-coupe.webp" alt="" loading="lazy">
        <canvas class="car-canvas" role="img" aria-label="Car showing the selected window tint shade"></canvas>
        <div class="vlt-readout" aria-hidden="true"><b data-readout>${first.vlt}%</b><span data-readout-code>${first.code}</span></div>
      </div>
      <div class="selector-ui">
        ${FILM_SERIES.map((s, k) => `<div class="film-btns" role="group" aria-label="${s.name} shades" data-series-group="${s.id}"${k ? ' hidden' : ''}>
          ${s.shades.map(x => `<button class="film-btn" type="button" data-shade='${JSON.stringify(x)}' aria-pressed="${x.code === DEFAULT_SHADE}"><span class="swatch" aria-hidden="true"></span><b>${x.code}</b><small>${x.vlt}% VLT</small></button>`).join('\n          ')}
        </div>`).join('\n        ')}
        <div class="spec-grid" aria-live="polite">${specCells(first)}</div>
        <p class="fine">Figures are 3M's published data for film on 6mm automotive glass (73% VLT), so VLT is the glass and film together. Your windows may differ slightly, so we show you samples on your car first.</p>
      </div>
    </div>
  </div>
</section>`;
};

const ctaBand = (title = 'Get a fixed-price quote', text = 'Send us your vehicle and the shade you like. We reply the same business day.') => `<section class="section tight">
  <div class="shell">
    <div class="cta-band reveal">
      <div><h2 class="h-md">${title}</h2><p class="muted">${text}</p></div>
      <div class="btn-row"><a class="btn" href="${PHONE_HREF}">Call ${PHONE}</a><a class="btn btn-solid" href="/quote/" data-quote>Get a quote</a></div>
    </div>
  </div>
</section>`;

const reviewsSection = () => `<section class="section reviews">
  <div class="reviews-bg"><img src="/images/photos/car-brick.webp" alt="" loading="lazy"></div>
  <div class="shell">
    <div class="section-head center reveal">
      <span class="script center-script">Testimonials</span>
      <h2 class="h-lg">Recent reviews</h2>
      <div class="review-summary"><span class="g-badge">${I.google}</span><span><b>[Google rating]</b><small>Pulled from your Google Business Profile</small></span></div>
    </div>
    <div class="review-grid">
      ${[1, 2, 3].map(k => `<div class="review review-ph reveal d${k}"><span class="stars" aria-hidden="true">★★★★★</span><p>[Customer review from Google]</p><footer><span class="avatar" aria-hidden="true"></span><span><b>[Customer name]</b><small>[Service]</small></span></footer></div>`).join('\n      ')}
    </div>
  </div>
</section>`;

const strip = () => `<section class="section tight" aria-label="Recent work">
  <div class="shell">
    <div class="strip">
      ${[['glass-reflection', 'Car tint'], ['window-sunset', 'Front windows'], ['suv-road', 'SUV'], ['detailing', 'Paint protection'], ['interior-mirror', 'Interior view']].map(([f, c]) => `<figure class="photo reveal"><img src="/images/photos/${f}.webp" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>`;

const checks = (items, cls = '') => `<ul class="checks ${cls}">${items.map(i => `<li>${I.check}${i}</li>`).join('')}</ul>`;

const business = {
  '@context': 'https://schema.org',
  '@type': 'AutoBodyShop',
  name: BRAND,
  url: SITE + '/',
  telephone: PHONE,
  email: EMAIL,
  areaServed: ['Sydney', 'Central Coast NSW'],
};

// ---------- Pages ----------
const AREAS = [
  ['parramatta', 'Parramatta', 'Sydney'], ['castle-hill', 'Castle Hill', 'Sydney'], ['penrith', 'Penrith', 'Sydney'],
  ['blacktown', 'Blacktown', 'Sydney'], ['sydney-cbd', 'Sydney CBD', 'Sydney'], ['gosford', 'Gosford', 'Central Coast'],
  ['erina', 'Erina', 'Central Coast'], ['tuggerah', 'Tuggerah', 'Central Coast'], ['wyong', 'Wyong', 'Central Coast'],
];
const built = [];
const ir = FILM_SERIES[0];

// Home
built.push(page({
  slug: '/',
  current: '/',
  title: `Window Tinting Sydney & Central Coast | 3M Film | ${BRAND}`,
  description: '3M window tinting for cars, homes and businesses in Sydney and the Central Coast. Compare 3M film shades and get a fixed-price quote.',
  preload: '/images/elite-studio.webp',
  schema: business,
  body: `<section class="hero">
  <div class="hero-light" aria-hidden="true"></div>
  <div class="hero-media"><img src="/images/elite-studio.webp" alt="Grey coupe with dark tinted windows" fetchpriority="high"></div>
  <div class="shell hero-inner">
    <div class="hero-copy">
      <span class="script warm">Sydney &amp; Central Coast</span>
      <h2 class="h-xl">3M window tinting</h2>
      <p class="lead">Car, home and commercial tinting with 3M film. Fixed prices, and most cars are done the same day.</p>
      <div class="btn-row"><a class="btn" href="/quote/" data-quote>Get a quote</a><a class="btn btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
    </div>
  </div>
  <div class="shell trust-bar">
    <div class="trust-grid">
      <div class="trust trust-3m">${badge3m()}<span><b>3M window film</b><span>Three 3M ranges</span></span></div>
      <div class="trust"><span class="trust-icon tile tile-orange">${I.shield}</span><span><b>Lifetime warranty</b><span>3M limited warranty</span></span></div>
      <div class="trust"><span class="trust-icon tile tile-amber">${I.sun}</span><span><b>99.9% UV blocked</b><span>3M Ceramic IR</span></span></div>
      <div class="trust"><span class="trust-icon tile tile-blue">${I.pin}</span><span><b>Two workshops</b><span>Sydney &amp; Central Coast</span></span></div>
    </div>
  </div>
</section>

<section class="section tight intro center">
  <div class="shell reveal">
    <h1 class="h-lg">Window tinting in Sydney and the Central Coast</h1>
    <p class="lead" style="max-width:820px">We tint cars, homes and commercial buildings with <strong>3M film</strong>. You get a <strong>fixed price</strong> up front, and we show you film samples on your own glass before we start.</p>
    <div class="rule"></div>
    ${checks(['Fixed-price quotes', '3M film on every job', 'Lifetime film warranty'])}
  </div>
</section>

<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal">
      <div class="duo">
        <div class="photo"><img src="/images/photos/studio-mercedes.webp" alt="Dark sedan in a workshop" loading="lazy"></div>
        <div class="photo"><img src="/images/photos/gclass-rear.webp" alt="Black 4WD with tinted rear windows" loading="lazy"></div>
      </div>
    </div>
    <div class="split-copy reveal d1">
      <span class="script">Our film</span>
      <h2 class="h-lg">Why we use 3M</h2>
      ${badge3m('badge-lg')}
      <p class="copy">3M's car films contain no metal, so they don't affect your phone, GPS or toll tag. They hold their colour and come with 3M's limited lifetime warranty.</p>
      <p class="copy">We carry three 3M ranges. Color Stable gives a neutral black look. Ceramic IR adds more heat rejection. Crystalline rejects the most heat, even in very light shades.</p>
      <div class="btn-row"><a class="btn" href="/products/">Compare the ranges</a></div>
    </div>
  </div>
</section>

<section class="section glow-bl">
  <div class="shell">
    <div class="stats-head section-head reveal">
      <div><span class="script">3M Ceramic IR</span><h2 class="h-lg">What the film does</h2></div>
      <p class="copy">3M's published figures for its Ceramic IR range, at the darkest shade.</p>
    </div>
    <div class="stats">
      <div class="stat reveal"><div class="stat-icon">${I.sun}</div><div class="stat-num"><span data-count="66">66</span><small>%</small></div><h3>Solar energy rejected</h3><p>Less heat gets into the car, so the air-con works less.</p></div>
      <div class="stat reveal d1"><div class="stat-icon">${I.spark}</div><div class="stat-num"><span data-count="95">95</span><small>%</small></div><h3>Infrared rejected</h3><p>Infrared is the heat you feel on your skin through the glass.</p></div>
      <div class="stat reveal d2"><div class="stat-icon">${I.shield}</div><div class="stat-num"><span data-count="99.9">99.9</span><small>%</small></div><h3>UV rejected</h3><p>Protects your skin and stops the interior fading.</p></div>
      <div class="stat reveal d3"><div class="stat-icon">${I.eye}</div><div class="stat-num"><span data-count="93">93</span><small>%</small></div><h3>Glare reduced</h3><p>Easier driving into low sun and headlights.</p></div>
    </div>
  </div>
</section>

<section class="section tight process">
  <div class="shell">
    <div class="process-top reveal"><b>How it works</b></div>
    <div class="steps">
      <div class="step reveal"><h3>Get a quote</h3><p>Tell us your car or windows. We send a fixed price, usually the same day.</p></div>
      <div class="step reveal d1"><h3>Pick a shade</h3><p>We put film samples on your glass so you can see the real result.</p></div>
      <div class="step reveal d2"><h3>Fitting</h3><p>Film is cut to your windows and fitted in a clean, enclosed bay.</p></div>
      <div class="step reveal d3"><h3>Aftercare</h3><p>Keep windows up for 3 to 5 days. We give you the warranty paperwork.</p></div>
    </div>
  </div>
</section>

<section class="section glow-l">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-wide"><img src="/images/photos/suv-workshop.webp" alt="Large SUV in the workshop" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Every vehicle</span>
      <h2 class="h-lg">Cars, 4WDs, vans and trucks</h2>
      <p class="copy">Small hatchbacks, family SUVs, work utes, vans, trucks and caravans. If it has windows, we can tint it. Goods vehicles have different rules for the rear windows, and we'll tell you what applies.</p>
      <div class="btn-row"><a class="btn" href="/window-tinting-services/">Services</a></div>
    </div>
  </div>
</section>

<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">Services</span><h2 class="h-lg">What we do</h2></div>
    <div class="cards">
      <a class="card reveal" href="/window-tinting-services/#automotive"><div class="card-media"><img src="/images/photos/window-sunset.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Car tinting</h3><p>3M Color Stable, Ceramic IR and Crystalline films.</p><span class="card-link">More</span></div></a>
      <a class="card reveal d1" href="/window-tinting-services/#residential"><div class="card-media"><img src="/images/photos/house-modern.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Home tinting</h3><p>Cut heat and glare in hot rooms and stop floors fading.</p><span class="card-link">More</span></div></a>
      <a class="card reveal d2" href="/commercial-window-tinting/"><div class="card-media"><img src="/images/photos/office-glass.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Commercial tinting</h3><p>Offices, shops and strata buildings. Solar, privacy and safety film.</p><span class="card-link">More</span></div></a>
      <a class="card reveal d3" href="/window-tinting-services/#protection"><div class="card-media"><img src="/images/photos/detailing.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Paint protection</h3><p>Clear film over the paint to stop stone chips and scratches.</p><span class="card-link">More</span></div></a>
    </div>
  </div>
</section>

${tintSelector()}
${reviewsSection()}
${strip()}
${ctaBand()}`
}));

// Services
built.push(page({
  slug: '/window-tinting-services/',
  current: '/window-tinting-services/',
  title: `Window Tinting Services Sydney & Central Coast | ${BRAND}`,
  description: 'Car, home and commercial window tinting and paint protection film in Sydney and the Central Coast, using 3M film.',
  schema: business,
  body: `${pageHero({ script: 'Services', title: 'What we do', text: 'Car, home and commercial window tinting, plus paint protection film.', img: '/images/photos/studio-mercedes.webp', crumbs: 'Services' })}
<section class="section glow-r" id="automotive">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/window-sunset.webp" alt="Tinted front side window" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Cars</span>
      <h2 class="h-md">Car window tinting</h2>
      <p class="copy">We fit 3M Color Stable, Ceramic IR and Crystalline film. All three block at least 98% of UV. The ceramic and Crystalline ranges also cut a lot of the heat you feel through the glass.</p>
      ${checks(['Film cut to your exact windows', 'Most cars done in 2 to 4 hours', '3M limited lifetime warranty'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=car" data-quote="car">Get a quote</a><a class="btn" href="/#shades">Compare shades</a></div>
    </div>
  </div>
</section>
<section class="section glow-l" id="residential">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/home-interior.webp" alt="Bedroom with large windows" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Homes</span>
      <h2 class="h-md">Home window tinting</h2>
      <p class="copy">Film for west-facing rooms that get too hot, TVs with glare, and floors or furniture that are fading. Clear films keep the view. Frosted films add privacy to bathrooms and street-facing windows.</p>
      ${checks(['Clear, tinted and frosted films', 'Most homes done in a day', 'We clean up as we go'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=home" data-quote="home">Get a quote</a></div>
    </div>
  </div>
</section>
<section class="section glow-r" id="protection">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/detailing.webp" alt="Car being washed before paint protection film" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Paint</span>
      <h2 class="h-md">Paint protection film</h2>
      <p class="copy">A clear film over the paint that takes stone chips, scratches and bird droppings instead of your paint. Choose the front of the car, the high-impact areas, or the whole body.</p>
      ${checks(['Gloss or satin finish', 'Front, partial or full body', 'Headlight protection'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=ppf" data-quote="ppf">Get a quote</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head center reveal"><h2 class="h-md">Common questions</h2></div>
    <div class="faq reveal">
      <details><summary>How dark can I go in NSW?</summary><p>On a passenger car, the front side windows must let through at least 35% of visible light, and the rear side and rear windows at least 20%. The windscreen can only have a strip across the top. Vans and utes can have different rules for the rear, so ask us about your vehicle.</p></details>
      <details><summary>How long does it take?</summary><p>Most cars take 2 to 4 hours. Removing old tint adds time. We'll tell you when you book.</p></details>
      <details><summary>When can I wind the windows down?</summary><p>Wait 3 to 5 days so the film can dry. A little haze or a few water spots in that time is normal and clears on its own.</p></details>
      <details><summary>Will it affect my phone, GPS or toll tag?</summary><p>No. 3M's automotive films contain no metal.</p></details>
      <details><summary>What does the warranty cover?</summary><p>3M's limited lifetime warranty covers the film against peeling, bubbling, cracking and colour change. Ask us for the full terms.</p></details>
    </div>
  </div>
</section>
${ctaBand()}`
}));

// Products
built.push(page({
  slug: '/products/',
  current: '/products/',
  title: `3M Window Film | Ceramic IR, Crystalline & Color Stable | ${BRAND}`,
  description: 'Compare 3M Ceramic IR, Crystalline and Color Stable automotive window films: VLT, solar energy rejection, infrared, UV and glare for every shade.',
  body: `${pageHero({ script: 'Products', title: '3M window film', text: 'Three 3M ranges. Every figure on this page is from 3M\'s own data sheets.', img: '/images/photos/glass-reflection.webp', crumbs: 'Products' })}
<section class="section glow-r">
  <div class="shell">
    <div class="range">
      ${FILM_SERIES.map((s, k) => { const v = range(s, 'vlt'), t = range(s, 'tser'), r = range(s, 'irr'); return `<article class="film-card reveal d${k + 1}">${badge3m()}<h3>${s.name.replace('3M ', '')}</h3><p class="muted">${s.blurb}</p><dl><dt>Shades</dt><dd>${s.shades.length}</dd><dt>VLT</dt><dd>${v[0]}% to ${v[1]}%</dd><dt>Solar energy rejected</dt><dd>up to ${t[1]}%</dd><dt>Infrared rejected</dt><dd>up to ${r[1]}%</dd><dt>UV rejected</dt><dd>up to ${Math.max(...s.shades.map(x => x.uv))}%</dd></dl></article>`; }).join('\n      ')}
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><h2 class="h-md">Every shade, side by side</h2><p class="copy">3M data for film on 6mm automotive glass (73% VLT).</p></div>
    ${FILM_SERIES.map(s => `<div class="spec-table-wrap reveal"><table class="spec-table"><caption>${s.name}</caption><thead><tr><th scope="col">Shade</th><th scope="col">VLT</th><th scope="col">Solar energy rejected</th><th scope="col">Infrared rejected</th><th scope="col">UV rejected</th><th scope="col">Glare reduced</th></tr></thead><tbody>${s.shades.map(x => `<tr><th scope="row">${x.code}</th><td>${x.vlt}%</td><td>${x.tser}%</td><td>${x.irr}%</td><td>${x.uv}%</td><td>${x.glare}%</td></tr>`).join('')}</tbody></table></div>`).join('\n    ')}
    <p class="fine">Sources: 3M Automotive Window Film Ceramic IR Series brochure (3M Australia), Crystalline Series brochure, and Color Stable Series technical data sheet (Rev B, Oct 2021).</p>
  </div>
</section>
${tintSelector('shades')}
${ctaBand('Not sure which film?', 'Tell us what matters most (heat, privacy or looks) and we\'ll recommend a film and shade.')}`
}));

// About
built.push(page({
  slug: '/about/',
  current: '/about/',
  title: `About Us | ${BRAND}`,
  description: 'Window tinting with 3M film, from workshops in Sydney and on the Central Coast.',
  body: `${pageHero({ script: 'About', title: 'About us', text: '[Short line about the business, e.g. when it started and who runs it.]', img: '/images/elite-studio.webp', crumbs: 'About' })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/studio-mercedes.webp" alt="Sedan in the workshop" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Our story</span>
      <h2 class="h-lg">[Business name]</h2>
      <p class="copy">[Two or three sentences in the owner's words: how the business started, how long you've been tinting, and what you care about on every job.]</p>
      <p class="copy">We work from two workshops, one in Sydney and one on the Central Coast, and fit 3M film on every job.</p>
      <div class="btn-row"><a class="btn" href="/products/">Our film</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">The team</span><h2 class="h-lg">Who you'll deal with</h2></div>
    <div class="team">
      ${[1, 2, 3, 4].map(k => `<div class="member reveal${k > 1 ? ' d' + (k - 1) : ''}"><div class="portrait">[Photo]</div><b>[Name]</b><small>[Role]</small></div>`).join('\n      ')}
    </div>
  </div>
</section>
${reviewsSection()}
${ctaBand()}`
}));

// Commercial
built.push(page({
  slug: '/commercial-window-tinting/',
  current: '/commercial-window-tinting/',
  title: `Commercial Window Tinting Sydney & Central Coast | ${BRAND}`,
  description: 'Solar control, privacy, safety and anti-graffiti film for offices, shops and strata buildings in Sydney and the Central Coast.',
  body: `${pageHero({ script: 'Commercial', title: 'Commercial window tinting', text: 'Film for offices, shops, strata buildings and schools.', img: '/images/photos/office-glass.webp', crumbs: 'Commercial' })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/office-glass.webp" alt="Glass office building" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Buildings</span>
      <h2 class="h-md">Cooler rooms without new glass</h2>
      <p class="copy">Large windows let in a lot of heat. Solar film reflects much of it before it gets inside, so rooms near the glass stay comfortable, screens are easier to read, and the air-con runs less.</p>
      ${checks(['Free site visit and written quote', 'After-hours fitting', 'Work scheduled around tenants'], 'stack')}
      <div class="btn-row"><a class="btn btn-solid" href="/quote/?service=commercial" data-quote="commercial">Book a site visit</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><h2 class="h-lg">Film types</h2></div>
    <div class="cards three">
      ${[['Solar control', 'Less heat and glare, while keeping daylight.'], ['Privacy and frosting', 'Frosted or patterned film for meeting rooms, clinics and bathrooms.'], ['Safety and security', 'Holds broken glass together and slows down break-ins.'], ['Anti-graffiti', 'A layer that takes scratches and tags, then gets replaced.'], ['Signage', 'Cut vinyl logos, opening hours and glass door markings.'], ['Strata and schools', 'Large jobs planned around residents, students and staff.']].map(([h, p], k) => `<div class="card plain reveal${k % 3 ? ' d' + (k % 3) : ''}"><h3>${h}</h3><p>${p}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand('Planning a commercial job?', 'Book a site visit and we\'ll quote each window.')}`
}));

// Contact
built.push(page({
  slug: '/contact/',
  current: '/contact/',
  title: `Contact | ${BRAND}`,
  description: 'Contact us for window tinting in Sydney and on the Central Coast.',
  schema: business,
  body: `${pageHero({ script: 'Contact', title: 'Contact us', text: 'Call, email or send the form. We reply with a fixed price.', img: '/images/photos/car-brick.webp', crumbs: 'Contact' })}
<section class="section glow-r">
  <div class="shell split" style="align-items:start">
    <div class="reveal">
      <div class="locations" id="locations">
        ${LOCATIONS.map(l => `<div class="location"><h3>${l.name}</h3><dl><dt>Address</dt><dd>${l.address}<br>${l.locality}</dd><dt>Phone</dt><dd><a href="${PHONE_HREF}">${PHONE}</a></dd><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd><dt>Hours</dt><dd>${l.hours}</dd></dl><h4 class="areas-title">Areas</h4><div class="areas">${AREAS.filter(a => a[2] === l.name).map(([s, n]) => `<a href="/window-tinting-${s}/">${n}</a>`).join('')}</div></div>`).join('\n        ')}
      </div>
    </div>
    <div class="form-panel reveal d1">
      <h2 class="h-md" style="margin-bottom:22px">Send an enquiry</h2>
      ${quoteForm('cf')}
    </div>
  </div>
</section>`
}));

// Quote
built.push(page({
  slug: '/quote/',
  current: '/quote/',
  title: `Get a Quote | ${BRAND}`,
  description: 'Get a fixed-price quote for window tinting or paint protection.',
  body: `${pageHero({ script: 'Quote', title: 'Get a quote', text: 'Tell us about your car or building and we\'ll send a fixed price.', img: '/images/elite-studio.webp', crumbs: 'Quote' })}
<section class="section tight glow-c">
  <div class="shell" style="max-width:860px">
    <div class="form-panel reveal">${quoteForm('qp')}</div>
  </div>
</section>`
}));

// Vouchers
built.push(page({
  slug: '/vouchers/',
  current: '/vouchers/',
  title: `Gift Vouchers | ${BRAND}`,
  description: 'Gift vouchers for window tinting and paint protection.',
  body: `${pageHero({ script: 'Vouchers', title: 'Gift vouchers', text: 'Use on any service at either workshop.', img: '/images/photos/gclass-rear.webp', crumbs: 'Vouchers' })}
<section class="section glow-c">
  <div class="shell">
    <div class="vouchers">
      ${[100, 250, 500].map((v, k) => `<div class="voucher reveal${k ? ' d' + k : ''}"><span class="logo-ph">[BRAND LOGO]</span><div><b>$${v}</b><br><small>Gift voucher</small></div></div>`).join('\n      ')}
    </div>
    <div class="center reveal" style="margin-top:40px"><p class="copy" style="margin:0 auto 22px">Other amounts are available. Vouchers are valid for [X] years.</p><div class="btn-row"><a class="btn btn-solid" href="/quote/?service=other" data-quote="other">Buy a voucher</a></div></div>
  </div>
</section>`
}));

// Privacy
built.push(page({
  slug: '/privacy-policy/',
  current: '',
  title: `Privacy Policy | ${BRAND}`,
  description: 'How we collect and use your personal information.',
  body: `${pageHero({ script: '', title: 'Privacy policy', text: 'Placeholder. Replace with the business\'s own policy before launch.', img: '/images/photos/glass-reflection.webp', crumbs: 'Privacy policy' })}
<section class="section tight"><div class="shell" style="max-width:820px">
  <p class="copy">We use the details you send through our forms (name, phone, email and vehicle or property details) to reply to your enquiry and do the work you book. We don't sell your information. To see, change or delete what we hold about you, email ${EMAIL}.</p>
</div></section>`
}));

// Location pages
for (const [slug, name, region] of AREAS) {
  built.push(page({
    slug: `/window-tinting-${slug}/`,
    current: '',
    title: `Window Tinting ${name} | 3M Film | ${BRAND}`,
    description: `Car, home and commercial window tinting near ${name} with 3M film. Fixed-price quotes from our ${region} workshop.`,
    schema: { ...business, areaServed: name },
    body: `${pageHero({ script: region, title: `Window tinting ${name}`, text: `Car, home and commercial tinting for ${name}, from our ${region} workshop.`, img: region === 'Sydney' ? '/images/photos/studio-mercedes.webp' : '/images/photos/house-modern.webp', crumbs: `Window tinting ${name}` })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/window-sunset.webp" alt="Tinted car window" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <h2 class="h-md">Tinting near ${name}</h2>
      <p class="copy">Our ${region} workshop tints cars, homes and commercial buildings around ${name} with 3M film. Most cars are ready the same day.</p>
      ${checks(['3M film', 'Fixed-price quotes', '3M limited lifetime warranty'], 'stack')}
      <div class="btn-row"><a class="btn btn-solid" href="/quote/" data-quote>Get a quote</a><a class="btn" href="/window-tinting-services/">Services</a></div>
    </div>
  </div>
</section>
${tintSelector('shades')}
${ctaBand(`Window tinting in ${name}`)}`
  }));
}

// Sitemap + robots
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built.map(s => `  <url><loc>${SITE}${s}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${built.length} pages.`);
