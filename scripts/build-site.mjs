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
const VERSION = '20261013';

const LOCATIONS = [
  { name: 'Sydney', address: 'Unit 1, 10 Example Street', locality: 'Sydney West NSW', hours: 'Mon–Fri 8am–5pm · Sat 8am–12pm' },
  { name: 'Central Coast', address: 'Unit 2, 20 Sample Road', locality: 'Central Coast NSW', hours: 'Mon–Fri 8am–5pm · Sat 8am–12pm' }
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

const seal = `<svg class="seal" viewBox="0 0 160 180" aria-hidden="true"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7f9"/><stop offset=".5" stop-color="#9aa6ad"/><stop offset="1" stop-color="#e3e8eb"/></linearGradient></defs><path d="M80 4l70 22v60c0 44-30 76-70 90C40 162 10 130 10 86V26z" fill="url(#sg)"/><path d="M80 16l58 18v52c0 37-25 64-58 77-33-13-58-40-58-77V34z" fill="#0b1820"/><text x="80" y="72" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-weight="800" font-size="20" fill="#fff">PREMIUM</text><text x="80" y="96" text-anchor="middle" font-family="Schibsted Grotesk, Arial" font-weight="800" font-size="20" fill="#fff">FILM</text><text x="80" y="120" text-anchor="middle" font-family="Manrope, Arial" font-weight="700" font-size="10" letter-spacing="2" fill="#ff8a2a">LIFETIME WARRANTY</text><path d="M52 134h56" stroke="#3ec6ff" stroke-width="1.5"/></svg>`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
  ['ceramic', 'Ceramic coating'],
  ['other', 'Something else'],
];

const logo = (tag = 'Sydney · Central Coast') => `<span class="logo-word">${BRAND}</span><span class="logo-tag">${tag}</span>`;

function header(current) {
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="shell header-row">
    <a class="logo" href="/" aria-label="${BRAND} home">${logo()}</a>
    <div class="header-pills">
      <a class="pill loc" href="/contact/#locations"><span class="pill-icon">${I.pin}</span><span><b>Sydney &amp; Central Coast</b><small>2 workshops · mobile service</small></span></a>
      <a class="pill phone" href="${PHONE_HREF}" aria-label="Call ${PHONE}"><span class="pill-icon">${I.phone}</span><span class="pill-text"><b>${PHONE}</b><small data-open-status>Mon–Sat</small></span></a>
      <button class="menu-btn" type="button" data-menu-open aria-expanded="false" aria-controls="menu"><span class="pill-icon">${I.menu}</span><span class="label">Menu</span></button>
    </div>
  </div>
</header>
<div class="menu-panel" id="menu" role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden="true" inert>
  <button class="menu-close" type="button" data-menu-close aria-label="Close menu">&times;</button>
  <nav class="menu-nav" aria-label="Main">
    ${NAV.map(([href, label], n) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}><span>0${n + 1}</span>${label}</a>`).join('\n    ')}
  </nav>
  <div class="menu-aside">
    <div><h3>Call us</h3><a href="${PHONE_HREF}">${PHONE}</a></div>
    <div><h3>Email</h3><a href="mailto:${EMAIL}">${EMAIL}</a></div>
    <div><h3>Workshops</h3><p>${LOCATIONS.map(l => l.name).join(' &amp; ')}</p></div>
    <div class="btn-row"><a class="btn" href="/quote/" data-quote>Get quote</a><a class="btn btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
    <div class="socials" style="justify-content:flex-start;margin:0"><a href="#" aria-label="Facebook">${I.fb}</a><a href="#" aria-label="Instagram">${I.ig}</a><a href="#" aria-label="Google reviews">${I.google}</a></div>
  </div>
</div>`;
}

function quoteForm(id, { compact = false } = {}) {
  return `<form class="form" data-enquiry novalidate>
  <fieldset>
    <legend>Vehicle or property</legend>
    <div class="field full"><label for="${id}-service">Service</label><select id="${id}-service" name="service" required>${SERVICES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
    <div class="field"><label for="${id}-make">Vehicle make</label><input id="${id}-make" name="make" placeholder="e.g. Toyota" autocomplete="off"></div>
    <div class="field"><label for="${id}-model">Vehicle model</label><input id="${id}-model" name="model" placeholder="e.g. RAV4" autocomplete="off"></div>
    <div class="field"><label for="${id}-year">Year of manufacture</label><input id="${id}-year" name="year" inputmode="numeric" pattern="[0-9]{4}" placeholder="e.g. 2022"></div>
    <div class="field"><label for="${id}-shade">Preferred shade</label><select id="${id}-shade" name="shade"><option value="">Not sure, please advise</option><option>70% clear ceramic</option><option>50% light</option><option>35% medium</option><option>20% dark</option><option>15% very dark</option><option>5% limo</option></select></div>
    <div class="field"><label for="${id}-removal">Old tint removal needed?</label><select id="${id}-removal" name="removal"><option>No</option><option>Yes</option><option>Not sure</option></select></div>
    <div class="field"><label for="${id}-location">Nearest workshop</label><select id="${id}-location" name="location">${LOCATIONS.map(l => `<option>${l.name}</option>`).join('')}<option>Mobile service</option></select></div>
    ${compact ? '' : `<div class="field full"><label for="${id}-notes">Tell us what you need</label><textarea id="${id}-notes" name="notes" placeholder="Windows to tint, film preference, timing, address for home or commercial jobs"></textarea></div>`}
  </fieldset>
  <fieldset>
    <legend>Your details</legend>
    <div class="field full"><label for="${id}-name">Name</label><input id="${id}-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="${id}-phone">Phone</label><input id="${id}-phone" name="phone" type="tel" required autocomplete="tel" inputmode="tel"></div>
    <div class="field"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" required autocomplete="email"></div>
  </fieldset>
  <div class="form-foot"><p>We reply with a fixed price, usually the same business day. Demo form: nothing is sent until an email address is configured.</p><button class="btn btn-solid" type="submit">Get my quote</button></div>
  <div class="form-success" role="status"><div class="ok-icon">${I.check}</div><h3>Thank you!</h3><p class="muted">Your quote request has been received. We'll be in touch shortly with a price for your new tint.</p></div>
</form>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell footer-grid">
    <div>
      <h2>Contacts</h2>
      <ul class="footer-list">
        <li><a href="${PHONE_HREF}">${PHONE}</a></li>
        <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
        ${LOCATIONS.map(l => `<li>${l.name}<br><span style="color:var(--muted);font-weight:600">${l.address}</span></li>`).join('\n        ')}
      </ul>
      <div class="socials"><a href="#" aria-label="Facebook">${I.fb}</a><a href="#" aria-label="Instagram">${I.ig}</a><a href="#" aria-label="Google reviews">${I.google}</a></div>
      <div class="btn-row"><a class="btn btn-sm" href="/quote/" data-quote>Get a quote</a><a class="btn btn-sm btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
    </div>
    <div class="footer-brand">
      <a class="logo" href="/" aria-label="${BRAND} home">${logo()}</a>
      <div class="accreds">
        <div class="accred">${I.shield}<span><b>Accredited installer</b><small>Industry association member</small></span></div>
        <div class="accred">${I.leaf}<span><b>Energy rated films</b><small>WERS-rated home films</small></span></div>
      </div>
    </div>
    <div>
      <h2>Quick links</h2>
      <ul class="footer-list">
        ${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('\n        ')}
        <li><a href="/privacy-policy/">Privacy policy</a></li>
      </ul>
    </div>
  </div>
  <div class="shell footer-base"><span>&copy; <span data-year>2026</span> ${BRAND}. Window tinting &amp; vehicle protection across Sydney and the Central Coast.</span><span>Demo website · content and details are placeholders</span></div>
</footer>
<div class="action-bar"><a class="btn" href="${PHONE_HREF}">Call now</a><a class="btn btn-solid" href="/quote/" data-quote>Free quote</a></div>
<div class="modal" id="quote" role="dialog" aria-modal="true" aria-labelledby="quote-title" aria-hidden="true" inert>
  <div class="modal-box">
    <button class="menu-close" type="button" data-modal-close aria-label="Close quote form">&times;</button>
    <div class="modal-head"><span class="script warm" style="font-size:28px">Quick quote</span><h2 id="quote-title">Get a fast quote to your inbox</h2><p><span class="stars" aria-hidden="true">★★★★★</span> Fixed pricing, no obligation.</p></div>
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
    <span class="script warm">${script}</span>
    <h1 class="h-xl">${title}</h1>
    <p>${text}</p>
    ${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${crumbs}</span></nav>` : ''}
  </div>
</section>`;

const tintSelector = (id = 'shades') => `<section class="section glow-c selector" id="${id}">
  <div class="shell">
    <div class="section-head center reveal">
      <span class="script" style="margin-inline:auto;width:fit-content">See the difference</span>
      <h2 class="h-lg">Select your film</h2>
      <p class="copy">Each shade is rendered from how light really passes through tinted glass, so the darkness you see here is a close match to the finished car. Legal limits shown are for NSW passenger cars.</p>
    </div>
    <div class="reveal" data-tint-preview data-car="/images/tint-coupe.webp" data-mask="/images/tint-coupe-glass.png">
      <div class="selector-stage">
        <img class="car-fallback" src="/images/tint-coupe.webp" alt="" loading="lazy">
        <canvas class="car-canvas" role="img" aria-label="White coupe showing the selected window tint shade"></canvas>
        <div class="vlt-readout" aria-hidden="true"><b data-readout>35%</b><span>Visible light</span></div>
      </div>
      <div class="selector-ui">
        <h3>Select film</h3>
        <div class="film-btns" role="group" aria-label="Tint shade">
          ${[[5, 'Limo'], [15, 'Very dark'], [20, 'Dark'], [35, 'Medium'], [50, 'Light'], [70, 'Clear']].map(([v, l]) => `<button class="film-btn" type="button" data-vlt="${v}" aria-pressed="${v === 35}"><span class="swatch" aria-hidden="true"></span><b>${v}%</b><small>${l}</small></button>`).join('\n          ')}
        </div>
        <div class="film-info" aria-live="polite">
          <div><h4 data-film-name>35% VLT · Medium</h4><p data-film-look>The darkest legal option for front side windows in NSW.</p></div>
          <div><h4>Front side windows</h4><p><span class="legal yes" data-legal-front>Legal</span></p></div>
          <div><h4>Rear side &amp; rear windows</h4><p><span class="legal yes" data-legal-rear>Legal</span></p></div>
        </div>
        <p class="fine">VLT (visible light transmission) is measured through the glass and film together. NSW passenger cars: front side windows 35% or lighter, rear side and rear windows 20% or lighter. Goods vehicles and some other vehicles have different rules. Screens vary, so we'll show you real film samples on your car before we start.</p>
      </div>
    </div>
  </div>
</section>`;

const ctaBand = (title = 'Ready for a cooler, more private drive?', text = 'Tell us your vehicle and the look you want. We\'ll come back with a fixed price.') => `<section class="section tight">
  <div class="shell">
    <div class="cta-band reveal">
      <div><span class="script warm" style="font-size:30px">Let's get started</span><h2 class="h-md">${title}</h2><p class="muted">${text}</p></div>
      <div class="btn-row"><a class="btn" href="${PHONE_HREF}">Call ${PHONE}</a><a class="btn btn-solid" href="/quote/" data-quote>Get a quote</a></div>
    </div>
  </div>
</section>`;

const REVIEWS = [
  ['Sarah M.', 'Car tinting · Sydney', 'Booked online, dropped the car off in the morning and it was ready after lunch. The 20% on the rear looks factory-perfect and the car is so much cooler.'],
  ['James T.', 'Home tinting · Central Coast', 'Our west-facing living room was unusable in summer. They talked us through the options, fitted it in a day and the glare is gone without darkening the room.'],
  ['Priya K.', 'Paint protection · Sydney', 'Really professional from quote to pickup. Clean edges, no bubbles, and they explained exactly how to look after the film. Highly recommend.'],
];
const reviewsSection = () => `<section class="section reviews">
  <div class="reviews-bg"><img src="/images/photos/car-brick.webp" alt="" loading="lazy"></div>
  <div class="shell">
    <div class="section-head center reveal">
      <span class="script" style="margin-inline:auto;width:fit-content">Testimonials</span>
      <h2 class="h-lg">Recent reviews</h2>
      <div class="review-summary"><span class="g-badge">${I.google}</span><span><b>5.0 <span class="stars" aria-hidden="true">★★★★★</span></b><small>Google reviews sync here at launch</small></span></div>
    </div>
    <div class="review-grid">
      ${REVIEWS.map(([n, s, t], k) => `<blockquote class="review reveal d${k + 1}"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><p>${t}</p><footer><span class="avatar" aria-hidden="true">${n[0]}</span><span><b>${n}</b><small>${s}</small></span></footer></blockquote>`).join('\n      ')}
    </div>
    <p class="demo-note">Example reviews for the demo. The live site shows your verified Google reviews.</p>
  </div>
</section>`;

const strip = () => `<section class="section tight" aria-label="Recent work">
  <div class="shell">
    <div class="strip">
      ${[['glass-reflection', 'Ceramic tint'], ['window-sunset', 'Front sides 35%'], ['suv-road', 'SUV privacy'], ['detailing', 'Paint protection'], ['interior-mirror', 'Heat rejection']].map(([f, c]) => `<figure class="photo reveal"><img src="/images/photos/${f}.webp" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join('\n      ')}
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
  description: 'Demo website for a window tinting and vehicle protection business.',
};

// ---------- Pages ----------
const AREAS = [
  ['parramatta', 'Parramatta', 'Sydney'], ['castle-hill', 'Castle Hill', 'Sydney'], ['penrith', 'Penrith', 'Sydney'],
  ['blacktown', 'Blacktown', 'Sydney'], ['sydney-cbd', 'Sydney CBD', 'Sydney'], ['gosford', 'Gosford', 'Central Coast'],
  ['erina', 'Erina', 'Central Coast'], ['tuggerah', 'Tuggerah', 'Central Coast'], ['wyong', 'Wyong', 'Central Coast'],
];
const built = [];

// Home
built.push(page({
  slug: '/',
  current: '/',
  title: `Window Tinting Sydney & Central Coast | Car, Home & Commercial | ${BRAND}`,
  description: 'Premium car, home and commercial window tinting plus paint protection across Sydney and the Central Coast. Accurate shade previews, lifetime warranty and fast quotes.',
  preload: '/images/elite-studio.webp',
  schema: business,
  body: `<section class="hero">
  <div class="hero-media"><img src="/images/elite-studio.webp" alt="Dark grey performance coupe with tinted windows in a studio" fetchpriority="high"></div>
  <div class="shell hero-inner">
    <div class="hero-copy">
      <span class="script warm">Keeping Sydney cool</span>
      <h2 class="h-xl">Premium tint &amp;<br>sleek protection</h2>
      <p class="lead">Car, home and commercial window tinting with films that block heat, glare and 99% of UV. Fitted by specialists in Sydney and on the Central Coast.</p>
      <div class="btn-row"><a class="btn" href="/quote/" data-quote>Quick quote</a><a class="btn btn-solid" href="/quote/?service=car" data-quote="car">Book now</a></div>
    </div>
  </div>
  <a class="hero-shade-link" href="#shades"><span class="shade-chips" aria-hidden="true"><i style="background:#c9cdd0"></i><i style="background:#7d8287"></i><i style="background:#3f4448"></i><i style="background:#16191b"></i></span><span><b>Compare shades</b><small>See 5% to 70% on a real car</small></span></a>
  <div class="shell trust-bar">
    <div class="trust-grid">
      <div class="trust"><span class="trust-icon">${I.google}</span><span><b>5.0 / 5.0</b><span>Google rating</span></span></div>
      <div class="trust"><span class="trust-icon">${I.medal}</span><span><b>15+ years</b><span>Tinting experience</span></span></div>
      <div class="trust"><span class="trust-icon">${I.shield}</span><span><b>Lifetime warranty</b><span>Workmanship guarantee</span></span></div>
      <div class="trust"><span class="trust-icon">${I.spark}</span><span><b>Premium films</b><span>Ceramic &amp; carbon, no fading</span></span></div>
    </div>
  </div>
</section>

<section class="section tight intro center">
  <div class="shell reveal">
    <h1 class="h-lg">Window Tinting Sydney &amp; Central Coast</h1>
    <span class="script">Cool by design</span>
    <p class="lead" style="max-width:900px">Our commitment to excellence shows in the films we choose: <strong>premium products</strong>, matched to <strong>every budget</strong>, without ever compromising on <strong>quality</strong>.</p>
    <div class="rule"></div>
    ${checks(['Expert recommendations', 'Precision installation', 'Quality assurance'])}
  </div>
</section>

<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal">
      <div class="duo">
        <div class="photo"><img src="/images/photos/studio-mercedes.webp" alt="Dark sedan in a detailing studio after tinting" loading="lazy"></div>
        <div class="photo"><img src="/images/photos/gclass-rear.webp" alt="Black four-wheel drive with dark rear tint" loading="lazy"></div>
      </div>
      ${seal}
    </div>
    <div class="split-copy center reveal d1">
      <span class="script">Driven by quality</span>
      <h2 class="h-lg">Shifting the shades of excellence</h2>
      <p class="copy">${BRAND} delivers window tinting across Sydney and the Central Coast with premium films and outstanding service for vehicles, homes and <a href="/commercial-window-tinting/" style="color:var(--neon-2)">businesses</a>. With more than 15 years of experience, we deliver the quality we believe in, at prices that suit every budget, with warranties that last a lifetime.</p>
      <div class="btn-row"><a class="btn" href="/products/">Our products</a></div>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">${('<span>Making the world a <em>cooler</em> place.</span>').repeat(4)}</div></div>

<section class="section glow-bl">
  <div class="shell">
    <div class="stats-head section-head reveal">
      <div><span class="script">Why choose us</span><h2 class="h-lg">The proof is<br>in the numbers</h2></div>
    </div>
    <div class="stats">
      <div class="stat reveal"><div class="stat-icon">${I.shield}</div><div class="stat-num"><span data-count="15">15</span><small>+</small></div><h3>Years experience</h3><p>Installers trained on every make, from city hatchbacks to European prestige.</p></div>
      <div class="stat reveal d1"><div class="stat-icon">${I.car}</div><div class="stat-num"><span data-count="20">20</span><small>k+</small></div><h3>Vehicles tinted</h3><p>Cars, utes, vans, trucks and caravans tinted in our workshops.</p></div>
      <div class="stat reveal d2"><div class="stat-icon">${I.google}</div><div class="stat-num"><span data-count="600">600</span><small>+</small></div><h3>Five-star reviews</h3><p>Customers rate the finish, the cleanliness and the turnaround.</p></div>
      <div class="stat reveal d3"><div class="stat-icon">${I.star}</div><div class="stat-num"><span data-count="5.0">5.0</span><small>/5</small></div><h3>Service rating</h3><p>Same-day turnaround on most cars, with a lifetime workmanship warranty.</p></div>
    </div>
    <div class="stats-foot"><a class="btn" href="/about/">About us</a></div>
  </div>
</section>

<section class="section tight process">
  <div class="shell">
    <div class="process-top reveal"><span class="pill-icon">${I.play}</span><b>How we work</b></div>
    <div class="steps">
      <div class="step reveal"><h3>Quote in minutes</h3><p>Send your vehicle or windows and we reply with a fixed price, usually the same day.</p></div>
      <div class="step reveal d1"><h3>Choose your film</h3><p>See real film samples on your glass and get honest advice on legal shades.</p></div>
      <div class="step reveal d2"><h3>Precision fit</h3><p>Computer-cut patterns, dust-controlled bays and edge-to-edge coverage.</p></div>
      <div class="step reveal d3"><h3>Drive away covered</h3><p>Aftercare guide and a lifetime warranty against peeling, bubbling and fading.</p></div>
    </div>
  </div>
</section>

<section class="section glow-l">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-wide"><img src="/images/photos/suv-workshop.webp" alt="Large SUV in the tinting workshop" loading="lazy"></div></div>
    <div class="split-copy center reveal d1">
      <span class="script">Every vehicle</span>
      <h2 class="h-lg">Big or small,<br>we tint them all</h2>
      <p class="copy">We cater to every client and vehicle type. Compact cars, family SUVs, work utes, vans, trucks and caravans all get the same careful fit. Drive into our workshop with any vehicle and leave with a tint that reflects the sun and your style.</p>
      <div class="btn-row"><a class="btn" href="/window-tinting-services/">Services</a></div>
    </div>
  </div>
</section>

<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">What we do</span><h2 class="h-lg">Tint &amp; protection services</h2></div>
    <div class="cards">
      <a class="card reveal" href="/window-tinting-services/#automotive"><div class="card-media"><img src="/images/photos/window-sunset.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Car window tinting</h3><p>Carbon and ceramic films that cut heat, glare and UV, within NSW legal limits.</p><span class="card-link">Learn more</span></div></a>
      <a class="card reveal d1" href="/window-tinting-services/#residential"><div class="card-media"><img src="/images/photos/house-modern.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Home window tinting</h3><p>Cooler rooms, less glare and furniture protection without losing your view.</p><span class="card-link">Learn more</span></div></a>
      <a class="card reveal d2" href="/commercial-window-tinting/"><div class="card-media"><img src="/images/photos/office-glass.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Commercial tinting</h3><p>Solar control, privacy frosting and safety film for offices, shops and strata.</p><span class="card-link">Learn more</span></div></a>
      <a class="card reveal d3" href="/window-tinting-services/#protection"><div class="card-media"><img src="/images/photos/detailing.webp" alt="" loading="lazy"></div><div class="card-body"><h3>Paint protection</h3><p>Self-healing paint protection film and ceramic coating to keep paint like new.</p><span class="card-link">Learn more</span></div></a>
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
  description: 'Car, home and commercial window tinting, paint protection film and ceramic coating. Premium films, precision installation and a lifetime warranty.',
  schema: business,
  body: `${pageHero({ script: 'Window tinting specialists', title: 'Tinting services', text: '15+ years delivering the service we would expect ourselves, with premium films at honest prices.', img: '/images/photos/studio-mercedes.webp', crumbs: 'Services' })}
<section class="section tight center">
  <div class="shell reveal">
    <span class="script" style="margin-inline:auto;width:fit-content">Quality, precision, style</span>
    <p class="lead" style="max-width:860px;margin-inline:auto">At ${BRAND} we know quality, precision and style matter when it comes to window tinting. From our Sydney and Central Coast workshops, our team delivers top-notch tinting for cars, homes and businesses.</p>
  </div>
</section>
<section class="section glow-r" id="automotive">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/window-sunset.webp" alt="Tinted front side window at sunset" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Keeping customers cool</span>
      <h2 class="h-md">Automotive window tinting</h2>
      <p class="copy">Drive in comfort and style. Our films keep the cabin cool, reduce glare and block 99% of harmful UV, protecting you and your interior. They add privacy and security, and every shade we fit on a registered car is within NSW legal limits.</p>
      ${checks(['Carbon and ceramic films', 'Computer-cut patterns for a factory look', 'Most cars done in a single day'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=car" data-quote="car">Get a quote</a><a class="btn" href="/#shades">Compare shades</a></div>
    </div>
  </div>
</section>
<section class="section glow-l" id="residential">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/home-interior.webp" alt="Bright bedroom with floor-to-ceiling windows" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Comfort at home</span>
      <h2 class="h-md">Residential window tinting</h2>
      <p class="copy">Take the heat out of west-facing rooms, stop furniture and floors fading and cut glare on screens, all while keeping your view. Choose from near-invisible spectrally selective films, daytime privacy films and decorative frosting.</p>
      ${checks(['Up to 80% of solar heat rejected', 'Energy-rated films', 'Clean, same-day installs'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=home" data-quote="home">Get a quote</a></div>
    </div>
  </div>
</section>
<section class="section glow-r" id="protection">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/detailing.webp" alt="Car being prepared for paint protection film" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Protect the paint</span>
      <h2 class="h-md">Paint protection film &amp; ceramic coating</h2>
      <p class="copy">Clear, self-healing paint protection film guards against stone chips, scratches and bird droppings. Pair it with a ceramic coating for deep gloss and easy washing. Choose front-end, high-impact zones or full-body coverage.</p>
      ${checks(['Self-healing gloss or satin film', 'Ceramic coating packages', 'Headlight and taillight film'], 'stack')}
      <div class="btn-row"><a class="btn" href="/quote/?service=ppf" data-quote="ppf">Get a quote</a></div>
    </div>
  </div>
</section>
<section class="section glow-l">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/suv-workshop.webp" alt="SUV in the workshop" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Keeping things simple</span>
      <h2 class="h-md">A simple process</h2>
      <p class="copy">Our team helps you choose the right film, then fits it with precision and backs it with a lifetime warranty.</p>
      ${checks(['Expert recommendations', 'Precision installation', 'Quality assurance'], 'stack')}
      <div class="btn-row"><a class="btn btn-solid" href="/quote/" data-quote>Book now</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head center reveal"><span class="script" style="margin-inline:auto;width:fit-content">Good to know</span><h2 class="h-md">Frequently asked questions</h2></div>
    <div class="faq reveal">
      <details><summary>How dark can I legally go in NSW?</summary><p>For passenger cars, front side windows must be 35% VLT or lighter and rear side and rear windows 20% or lighter. The windscreen can only have a tinted band across the top. Goods vehicles have different rear-window rules, so ask us about vans and utes.</p></details>
      <details><summary>How long does a car take?</summary><p>Most sedans, hatches and SUVs are finished in two to four hours. Old tint removal adds time, and we'll tell you exactly how long when you book.</p></details>
      <details><summary>When can I wind my windows down?</summary><p>Leave windows up for three to five days while the adhesive cures. A slight haze or small water pockets during curing are normal and clear on their own.</p></details>
      <details><summary>Will tint affect my phone, GPS or toll tag?</summary><p>Our carbon and ceramic films contain no metal, so they don't interfere with phone signal, GPS, keyless entry or e-tags.</p></details>
      <details><summary>What does the warranty cover?</summary><p>Our lifetime workmanship warranty covers peeling, bubbling, cracking and fading for as long as you own the vehicle or property.</p></details>
    </div>
  </div>
</section>
${ctaBand()}`
}));

// Products
const FILMS = [
  { name: 'Carbon series', tag: 'Best value', vlt: '5–70%', heat: 45, uv: '99%', points: ['Deep, true-black look', 'Will not fade or turn purple', 'No signal interference'] },
  { name: 'Ceramic series', tag: 'Most popular', vlt: '5–70%', heat: 65, uv: '99%', featured: true, points: ['Nano-ceramic heat rejection', 'Crystal-clear from inside', 'Lifetime warranty'] },
  { name: 'Ceramic IR', tag: 'Maximum comfort', vlt: '5–70%', heat: 80, uv: '99%', points: ['Highest infrared rejection', 'Ideal for clear 70% fronts', 'Feels cooler on your skin'] },
];
built.push(page({
  slug: '/products/',
  current: '/products/',
  title: `Window Film Products | Carbon & Ceramic Tint | ${BRAND}`,
  description: 'Compare carbon, ceramic and ceramic IR window films. Heat rejection, UV protection and shade options explained, with an accurate shade preview.',
  body: `${pageHero({ script: 'Best products since day one', title: 'Our products', text: 'Premium films from leading manufacturers, chosen for clarity, colour stability and heat rejection.', img: '/images/photos/glass-reflection.webp', crumbs: 'Products' })}
<section class="section glow-r">
  <div class="shell">
    <div class="section-head reveal"><span class="script">Carbon &amp; ceramic films</span><h2 class="h-lg">The ${BRAND} range</h2><p class="copy">Every film comes in shades from 5% to 70% VLT. Higher heat rejection means a cooler cabin at the same darkness, which is why ceramic films are worth it if you want a lighter, legal look.</p></div>
    <div class="range">
      ${FILMS.map((f, k) => `<article class="film-card reveal d${k + 1}${f.featured ? ' featured' : ''}"><span class="tag" style="font:700 11px/1 var(--head);letter-spacing:.12em;text-transform:uppercase;color:var(--neon)">${f.tag}</span><h3>${f.name}</h3><dl><dt>Shades</dt><dd>${f.vlt} VLT</dd><dt>UV blocked</dt><dd>${f.uv}</dd><dt>Heat rejection</dt><dd>Up to ${f.heat}%</dd></dl><div class="meter" aria-hidden="true"><i style="width:${f.heat}%"></i></div><ul>${f.points.map(p => `<li>${p}</li>`).join('')}</ul></article>`).join('\n      ')}
    </div>
    <p class="fine">Heat rejection is total solar energy rejected at the darkest shade, as typically published by film manufacturers. Exact figures depend on the film, shade and your glass. Your installer will confirm the specification for your vehicle.</p>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">Premium tinting</span><h2 class="h-lg">Benefits of automotive window film</h2></div>
    <div class="benefits">
      ${[[I.spark, 'Enhanced appearance', 'An even, factory-matched finish that adds class to any vehicle.'], [I.sun, 'Greater comfort', 'Rejects daytime heat for a cooler cabin and more efficient air-con.'], [I.eye, 'Better visibility', 'Cuts glare from sun and headlights, making driving easier on your eyes.'], [I.lock, 'More privacy', 'Keep belongings out of sight with shades from 5% to 70% VLT.'], [I.home, 'Reduced fading', 'Protects leather, fabric and dash plastics from sun damage.'], [I.star, 'Lasting colour', 'Colour-stable films that never fade or turn purple.'], [I.shield, 'Increased safety', 'Blocks 99% of UV, a leading cause of skin cancer, and holds shattered glass together.'], [I.medal, 'Lifetime warranty', 'Covered against peeling, bubbling and fading for as long as you own the car.']].map(([ic, h, p], k) => `<div class="benefit reveal${k % 4 ? ' d' + (k % 4) : ''}"><h3>${ic}${h}</h3><p>${p}</p></div>`).join('\n      ')}
    </div>
    <div class="btn-row" style="margin-top:40px"><a class="btn" href="/quote/" data-quote>2 minute quote</a></div>
  </div>
</section>
${tintSelector('shades')}
${ctaBand()}`
}));

// About
built.push(page({
  slug: '/about/',
  current: '/about/',
  title: `About Us | ${BRAND} Sydney & Central Coast`,
  description: `Meet the ${BRAND} team. Window tinting and vehicle protection specialists with workshops in Sydney and on the Central Coast.`,
  body: `${pageHero({ script: 'Since day one', title: 'About us', text: '15+ years delivering the service we would expect ourselves, with premium products at honest prices.', img: '/images/elite-studio.webp', crumbs: 'About' })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/studio-mercedes.webp" alt="Sedan in the ${BRAND} studio" loading="lazy"></div></div>
    <div class="split-copy center reveal d1">
      <span class="script">Driven by quality</span>
      <h2 class="h-lg">Setting new standards</h2>
      <p class="copy">At ${BRAND} we deliver one of the fastest and most cost-effective ways to lift your vehicle's looks and comfort, and we make sure every film is applied with precision and care. High-quality materials and proven techniques give a sleek finish that lasts, making tint a choice that is both stylish and smart.</p>
      <div class="btn-row"><a class="btn" href="/products/">Our products</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">50+ years combined</span><h2 class="h-lg">Meet our team</h2><p class="copy">Placeholder profiles: swap in team photos and names before launch.</p></div>
    <div class="team">
      ${[['Alex', 'Owner'], ['Sam', 'Office manager'], ['Jordan', 'Workshop manager'], ['Taylor', 'Lead technician'], ['Casey', 'PPF specialist']].map(([n, r], k) => `<div class="member reveal${k % 4 ? ' d' + (k % 4) : ''}"><div class="portrait" aria-hidden="true">${n[0]}</div><b>${n}</b><small>${r}</small></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section glow-l">
  <div class="shell split flip">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/suv-workshop.webp" alt="SUV in the workshop" loading="lazy"></div></div>
    <div class="split-copy center reveal d1">
      <span class="script">Say hello!</span>
      <h2 class="h-lg">Everyone is welcome</h2>
      <p class="copy">Our services are tailored for everyone, from compact cars to RVs and trucks. Bring your vehicle to one of our workshops, or book our mobile service, and drive away with a tint that suits your style and shields you from the sun.</p>
      <div class="btn-row"><a class="btn" href="/quote/" data-quote>2 minute quote</a></div>
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
  description: 'Solar control, privacy frosting, safety and anti-graffiti films for offices, retail, strata and schools across Sydney and the Central Coast.',
  body: `${pageHero({ script: 'Work cooler', title: 'Commercial window tinting', text: 'Cut energy costs, control glare and add privacy with minimal disruption to your business.', img: '/images/photos/office-glass.webp', crumbs: 'Commercial' })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/office-glass.webp" alt="Glass office building facade" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Built for business</span>
      <h2 class="h-md">Comfortable spaces, lower bills</h2>
      <p class="copy">Glass is often the biggest source of heat gain in a commercial building. Solar control film rejects heat before it enters, evens out hot spots, reduces glare on screens and lowers air-conditioning demand, all without replacing a single pane.</p>
      ${checks(['After-hours installation available', 'Site assessment and written quote', 'Energy-rated film options'], 'stack')}
      <div class="btn-row"><a class="btn btn-solid" href="/quote/?service=commercial" data-quote="commercial">Request a site visit</a></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="shell">
    <div class="section-head reveal"><span class="script">Applications</span><h2 class="h-lg">Films for every building</h2></div>
    <div class="cards three">
      ${[['Solar control', 'Reject heat and glare in offices, retail and showrooms while keeping natural light.'], ['Privacy & frosting', 'Frosted, gradient and custom-cut films for meeting rooms, clinics and partitions.'], ['Safety & security', 'Hold broken glass together to meet safety requirements and slow down break-ins.'], ['Anti-graffiti', 'Sacrificial film that takes scratches and tags, then simply gets replaced.'], ['Branding & decals', 'Cut vinyl logos, opening hours and manifestation strips for glass doors.'], ['Strata & schools', 'Large-scale projects scheduled around residents, students and staff.']].map(([h, p], k) => `<div class="card plain reveal${k % 3 ? ' d' + (k % 3) : ''}"><h3>${h}</h3><p>${p}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>
${ctaBand('Planning a commercial project?', 'Book a free site assessment and we\'ll recommend the right film for each elevation.')}`
}));

// Contact
built.push(page({
  slug: '/contact/',
  current: '/contact/',
  title: `Contact Us | ${BRAND} Sydney & Central Coast`,
  description: `Contact ${BRAND} for window tinting and paint protection in Sydney and on the Central Coast. Call, email or send an enquiry.`,
  schema: business,
  body: `${pageHero({ script: 'Keeping you cool', title: 'Contact us', text: 'Call, email or send an enquiry. We reply with a fixed price, usually the same business day.', img: '/images/photos/car-brick.webp', crumbs: 'Contact' })}
<section class="section glow-r">
  <div class="shell split" style="align-items:start">
    <div class="reveal">
      <span class="script">Contact details</span>
      <div class="locations" id="locations" style="grid-template-columns:1fr;margin-top:16px">
        ${LOCATIONS.map(l => `<div class="location"><h3>${l.name} workshop</h3><dl><dt>Address</dt><dd>${l.address}<br>${l.locality}</dd><dt>Phone</dt><dd><a href="${PHONE_HREF}">${PHONE}</a></dd><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd><dt>Hours</dt><dd>${l.hours}</dd></dl><h4 class="muted" style="font:600 12px/1 var(--head);letter-spacing:.14em;text-transform:uppercase">Areas we service</h4><div class="areas">${AREAS.filter(a => a[2] === l.name).map(([s, n]) => `<a href="/window-tinting-${s}/">${n}</a>`).join('')}</div></div>`).join('\n        ')}
      </div>
    </div>
    <div class="form-panel reveal d1">
      <span class="script">Send an enquiry</span>
      <div style="height:16px"></div>
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
  description: 'Get a fast, fixed-price quote for car, home or commercial window tinting and paint protection.',
  body: `${pageHero({ script: 'Quick quote', title: 'Get a fast quote', text: 'Tell us about your vehicle or property and we\'ll send a fixed price to your inbox.', img: '/images/elite-studio.webp', crumbs: 'Quote' })}
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
  description: `Give the gift of a cooler drive. ${BRAND} gift vouchers for window tinting, paint protection and ceramic coating.`,
  body: `${pageHero({ script: 'The coolest gift', title: 'Gift vouchers', text: 'Perfect for birthdays, new cars and anyone who hates a hot steering wheel.', img: '/images/photos/gclass-rear.webp', crumbs: 'Vouchers' })}
<section class="section glow-c">
  <div class="shell">
    <div class="vouchers">
      ${[100, 250, 500].map((v, k) => `<div class="voucher reveal${k ? ' d' + k : ''}"><span class="logo-word">${BRAND}</span><div><b>$${v}</b><br><small>Gift voucher · valid 3 years</small></div></div>`).join('\n      ')}
    </div>
    <div class="center reveal" style="margin-top:40px"><p class="copy" style="margin-bottom:22px">Vouchers can be used on any service at either workshop. Custom amounts available.</p><div class="btn-row"><a class="btn btn-solid" href="/quote/?service=other" data-quote="other">Buy a voucher</a></div></div>
  </div>
</section>`
}));

// Privacy
built.push(page({
  slug: '/privacy-policy/',
  current: '',
  title: `Privacy Policy | ${BRAND}`,
  description: `How ${BRAND} collects and uses your personal information.`,
  body: `${pageHero({ script: 'Your data', title: 'Privacy policy', text: 'Template policy for the demo. Replace with the business\'s reviewed policy before launch.', img: '/images/photos/glass-reflection.webp', crumbs: 'Privacy policy' })}
<section class="section tight"><div class="shell" style="max-width:820px">
  <p class="copy">We collect the details you provide in our enquiry forms (name, phone, email and vehicle or property information) only to respond to your enquiry and provide our services. We do not sell or share your information with third parties except where needed to deliver a service you request or where required by law. You can ask us to access, correct or delete your information at any time by contacting ${EMAIL}.</p>
</div></section>`
}));

// Location pages
for (const [slug, name, region] of AREAS) {
  built.push(page({
    slug: `/window-tinting-${slug}/`,
    current: '',
    title: `Window Tinting ${name} | Car, Home & Commercial | ${BRAND}`,
    description: `Car, home and commercial window tinting near ${name}. Premium ceramic and carbon films, NSW-legal shades and a lifetime warranty from ${BRAND}.`,
    schema: { ...business, areaServed: name },
    body: `${pageHero({ script: `Serving ${name}`, title: `Window tinting ${name}`, text: `Premium car, home and commercial tinting for ${name} from our ${region} workshop, with mobile service available.`, img: region === 'Sydney' ? '/images/photos/studio-mercedes.webp' : '/images/photos/house-modern.webp', crumbs: `Window tinting ${name}` })}
<section class="section glow-r">
  <div class="shell split">
    <div class="split-media reveal"><div class="photo ratio-43"><img src="/images/photos/window-sunset.webp" alt="Tinted car window" loading="lazy"></div></div>
    <div class="split-copy reveal d1">
      <span class="script">Local specialists</span>
      <h2 class="h-md">Tinting for ${name} drivers and homes</h2>
      <p class="copy">${name} summers are hard on cars and homes. Our ${region} team fits carbon and ceramic films that cut heat, glare and UV, with every vehicle shade kept within NSW legal limits. Most cars are ready the same day.</p>
      ${checks(['Lifetime workmanship warranty', 'NSW-legal shades, explained clearly', 'Mobile service around ' + name], 'stack')}
      <div class="btn-row"><a class="btn btn-solid" href="/quote/" data-quote>Get a quote</a><a class="btn" href="/window-tinting-services/">All services</a></div>
    </div>
  </div>
</section>
${tintSelector('shades')}
${ctaBand(`Window tinting in ${name}, done properly`)}`
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
