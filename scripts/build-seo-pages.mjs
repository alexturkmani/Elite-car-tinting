// Generates SEO landing pages matching the legacy WordPress URL slugs so that
// rankings transfer cleanly when the elitecartinting.com.au domain is pointed
// to this GitHub-hosted site. Each page replicates the legacy meta data
// (title, description, H1, canonical) exactly while embedding rich, unique
// content + LocalBusiness schema scoped to the target suburb/service.
//
// Run:  node scripts/build-seo-pages.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://www.elitecartinting.com.au';

// ----- Page definitions (mirrors legacy WordPress sitemap exactly) -----
const PAGES = [
  // Car Window Tinting — location pages
  {
    slug: 'car-window-tinting-keilor',
    type: 'car',
    suburb: 'Keilor',
    title: 'Expert Car Window Tinting near Keilor | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting near Keilor with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Car Window Tinting Keilor',
  },
  {
    slug: 'car-window-tinting-essendon',
    type: 'car',
    suburb: 'Essendon',
    title: 'Best Car Window Tinting near Essendon | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting near Essendon with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Car Window Tinting Essendon',
  },
  {
    slug: 'car-window-tinting-airport-west',
    type: 'car',
    suburb: 'Airport West',
    title: 'Best Car Window Tinting near Airport West | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting in Airport West with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Professional Car Window Tinting Services – Airport West',
  },
  {
    slug: 'car-window-tinting-strathmore',
    type: 'car',
    suburb: 'Strathmore',
    title: 'Car Window Tinting near Strathmore | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting near Strathmore with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Car Window Tinting Strathmore',
  },
  {
    slug: 'car-window-tinting-sunbury',
    type: 'car',
    suburb: 'Sunbury',
    title: 'Best Car Window Tinting near Sunbury | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting near Sunbury with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Car Window Tinting Sunbury',
  },
  {
    slug: 'car-window-tinting-moonee-ponds',
    type: 'car',
    suburb: 'Moonee Ponds',
    title: 'Car Window Tinting near Moonee Ponds | Elite Car Tinting',
    description: 'Elite Car Tinting are experts in Car Window Tinting near Moonee Ponds with top quality films & a lifetime warranty. Contact us for a Free Quote on window tinting.',
    h1: 'Car Window Tinting Moonee Ponds',
  },

  // Home / residential window tinting — location pages
  {
    slug: 'home-window-tinting-airport-west',
    type: 'home',
    suburb: 'Airport West',
    title: 'Window Tinting Airport West | Residential & Commercial | Elite Car Tinting',
    description: 'Contact Elite Car Tinting for residential or commercial window tinting in Airport West. We provide high quality window tinting for homes & businesses across Melbourne.',
    h1: 'Commercial & Residential Window Tinting Services – Airport West',
  },
  {
    slug: 'home-window-tinting-keilor',
    type: 'home',
    suburb: 'Keilor',
    title: 'Best Home Window Tinting Services near Keilor | Elite Car Tinting',
    description: 'For Home Window Tinting in Keilor, Contact Elite Car Tinting. We provide high quality window tinting for homes & vehicles in Melbourne at affordable rates.',
    h1: 'Home Window Tinting – Keilor',
  },
  {
    slug: 'home-window-tinting-essendon',
    type: 'home',
    suburb: 'Essendon',
    title: 'Trusted Home Window Tinting near Essendon | Elite Car Tinting',
    description: 'For Home Window Tinting in Essendon, Contact Elite Car Tinting. We provide high quality window tinting for homes & vehicles in Melbourne at affordable rates.',
    h1: 'Home Window Tinting – Essendon',
  },
  {
    slug: 'home-window-tinting-sunbury',
    type: 'home',
    suburb: 'Sunbury',
    title: 'Trusted Home Window Tinting near Sunbury | Elite Car Tinting',
    description: 'For Home Window Tinting in Sunbury, Contact Elite Car Tinting. We provide high quality window tinting for homes & vehicles in Melbourne at affordable rates.',
    h1: 'Home Window Tinting In Sunbury',
  },
  {
    slug: 'home-window-tinting-tullamarine',
    type: 'home',
    suburb: 'Tullamarine',
    title: 'Home Window Tinting near Tullamarine | Elite Car Tinting',
    description: 'For Home Window Tinting in Tullamarine, Contact Elite Car Tinting. We provide high quality window tinting for homes & vehicles in Melbourne at affordable rates.',
    h1: 'Home Window Tinting – Tullamarine',
  },

  // Service pages
  {
    slug: 'headlights-taillights-tint',
    type: 'service',
    service: 'Headlights & Taillights Tint',
    title: "Car's Style with Headlights & Taillights Tint | Elite Car Tinting",
    description: "Elevate your car's appearance and protect your headlights and taillights with premium headlight and taillight tinting services from Elite Car Tinting. Call us now!",
    h1: 'Headlights & Taillights Tint',
  },
  {
    slug: 'ceramic-coating',
    type: 'service',
    service: 'Ceramic Coating',
    title: 'Ceramic Coating - Tullamarine, Keilor, Essendon, Sunbury, Moonee Ponds',
    description: 'Contact Elite Car Tinting for superior ceramic coating for your vehicle in Melbourne. Servicing Tullamarine, Keilor, Essendon, Sunbury, Airport West, Moonee Ponds.',
    h1: 'Ceramic Coating',
  },
  {
    slug: 'car-wrap-blackouts',
    type: 'service',
    service: 'Vinyl Wrapping & Blackouts',
    title: 'Car Wrap | Vehicle Vinyl Wrapping | Elite Car Tinting',
    description: 'Contact Elite Car Tinting for Vinyl Wrapping your vehicle in Melbourne. Call us for quality Car Wrap in Tullamarine, Essendon, Keilor, Sunbury, Airport West, Moonee Ponds.',
    h1: 'Vinyl Wrapping & Blackouts',
  },
  {
    slug: 'automotive-window-tinting',
    type: 'service',
    service: 'Automotive Window Tinting',
    title: 'Premium Automotive Window Tinting | Elite Car Tinting',
    description: "Upgrade your ride with Elite Car Tinting's premium automotive window tinting services. Enhance privacy, comfort, and style with our range of high-quality tint options.",
    h1: 'Automotive Window Tinting',
  },

  // About
  {
    slug: 'about-us',
    type: 'about',
    title: 'Your Premier Destination for Car Window Tinting | Elite Car Tinting',
    description: "Elevate your vehicle's style, comfort, and protection with Elite Car Tinting. Experience our expertise in window tinting, vehicle wrapping, and home window tinting.",
    h1: 'About',
  },
  // Contact
  {
    slug: 'contact-us',
    type: 'contact',
    title: 'Contact Elite Car Tinting | Tullamarine, Melbourne',
    description: 'Contact Elite Car Tinting in Tullamarine for car window tinting, ceramic coating, vinyl wrapping & home window tinting. Call 0411 017 040 or request a Free Quote.',
    h1: 'Contact Us',
  },
  // Gallery
  {
    slug: 'gallery',
    type: 'gallery',
    title: 'Gallery | Elite Car Tinting Melbourne',
    description: 'Browse our gallery of premium car window tinting, ceramic coating, and vinyl wrap installations performed by Elite Car Tinting in Melbourne.',
    h1: 'Gallery',
  },
];

// ----- Shared HTML helpers -----
const NAV = `
<nav class="navbar" id="navbar">
  <div class="container nav-container">
    <a href="/" class="logo" aria-label="Elite Car Tinting Home">
      <img src="/images/logo.webp" alt="Elite Car Tinting" class="logo-img" />
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="/#services">Services</a></li>
      <li><a href="/#calculator">Get a Quote</a></li>
      <li><a href="/#gallery">Gallery</a></li>
      <li><a href="/#why-us">Why Us</a></li>
      <li><a href="/#reviews">Reviews</a></li>
      <li><a href="/contact-us/">Contact</a></li>
    </ul>
    <a href="tel:+61411017040" class="btn btn-nav"><i class="fas fa-phone-alt"></i> Call Us</a>
  </div>
</nav>`;

const FOOTER = `
<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-col">
      <h4>Elite Car Tinting</h4>
      <p>Tullamarine's trusted experts in car window tinting, ceramic coating, vinyl wrapping & home window tinting. Lifetime warranty on all installs.</p>
      <p><strong>Address:</strong> Unit 9/9 Lindaway Pl, Tullamarine VIC 3043</p>
      <p><strong>Phone:</strong> <a href="tel:+61411017040">0411 017 040</a></p>
      <p><strong>Email:</strong> <a href="mailto:contact@elitecartinting.com.au">contact@elitecartinting.com.au</a></p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="/automotive-window-tinting/">Automotive Window Tinting</a></li>
        <li><a href="/ceramic-coating/">Ceramic Coating</a></li>
        <li><a href="/car-wrap-blackouts/">Vinyl Wrapping & Blackouts</a></li>
        <li><a href="/headlights-taillights-tint/">Headlights & Taillights Tint</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Car Window Tinting</h4>
      <ul>
        <li><a href="/car-window-tinting-keilor/">Keilor</a></li>
        <li><a href="/car-window-tinting-essendon/">Essendon</a></li>
        <li><a href="/car-window-tinting-airport-west/">Airport West</a></li>
        <li><a href="/car-window-tinting-strathmore/">Strathmore</a></li>
        <li><a href="/car-window-tinting-sunbury/">Sunbury</a></li>
        <li><a href="/car-window-tinting-moonee-ponds/">Moonee Ponds</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Home Window Tinting</h4>
      <ul>
        <li><a href="/home-window-tinting-tullamarine/">Tullamarine</a></li>
        <li><a href="/home-window-tinting-airport-west/">Airport West</a></li>
        <li><a href="/home-window-tinting-keilor/">Keilor</a></li>
        <li><a href="/home-window-tinting-essendon/">Essendon</a></li>
        <li><a href="/home-window-tinting-sunbury/">Sunbury</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; ${new Date().getFullYear()} Elite Car Tinting. All rights reserved. | <a href="/about-us/">About</a> | <a href="/contact-us/">Contact</a></p>
  </div>
</footer>`;

const breadcrumbSchema = (slug, name) => `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"${SITE}/"},
    {"@type":"ListItem","position":2,"name":${JSON.stringify(name)},"item":"${SITE}/${slug}/"}
  ]
}
</script>`;

const localBusinessSchema = (page) => {
  const name = page.suburb
    ? `Elite Car Tinting – ${page.suburb}`
    : (page.service ? `Elite Car Tinting – ${page.service}` : 'Elite Car Tinting');
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutoRepair"],
  "name": ${JSON.stringify(name)},
  "image": "${SITE}/images/logo.webp",
  "@id": "${SITE}/#business",
  "url": "${SITE}/${page.slug}/",
  "telephone": "+61411017040",
  "email": "contact@elitecartinting.com.au",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Unit 9/9 Lindaway Place",
    "addressLocality": "Tullamarine",
    "addressRegion": "VIC",
    "postalCode": "3043",
    "addressCountry": "AU"
  },
  "geo": {"@type":"GeoCoordinates","latitude":-37.6915,"longitude":144.8819},
  "openingHoursSpecification": [
    {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"08:00","closes":"17:00"},
    {"@type":"OpeningHoursSpecification","dayOfWeek":"Saturday","opens":"10:00","closes":"14:00"}
  ],
  "sameAs": [
    "https://www.facebook.com/elitecartinting",
    "https://www.instagram.com/elitecartinting",
    "https://www.tiktok.com/@elitecartinting"
  ],
  "aggregateRating": {"@type":"AggregateRating","ratingValue":"5.0","reviewCount":"221","bestRating":"5","worstRating":"1"},
  "areaServed": ${JSON.stringify(page.suburb || 'Melbourne')}
}
</script>`;
};

// ----- Body content templates per page type -----
function renderCarLocation(p) {
  const homeSlugs = new Set(['airport-west','keilor','essendon','sunbury','tullamarine']);
  const suburbSlug = p.suburb.toLowerCase().replace(/\s+/g, '-');
  const homeHref = homeSlugs.has(suburbSlug)
    ? `/home-window-tinting-${suburbSlug}/`
    : `/home-window-tinting-tullamarine/`;
  return `
<section class="page-hero">
  <div class="container">
    <h1>${p.h1}</h1>
    <p class="lead">Looking for the best car window tinting near ${p.suburb}? Elite Car Tinting has been serving ${p.suburb} drivers with expert installations, premium films, and a lifetime warranty for over a decade. Based just minutes from ${p.suburb} in Tullamarine, we're the trusted choice for sedan, hatch, SUV, ute and 4WD owners across Melbourne's north-west.</p>
    <div class="hero-cta">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <h2>Why ${p.suburb} Drivers Choose Elite Car Tinting</h2>
    <p>For residents of ${p.suburb} and surrounding suburbs, Elite Car Tinting offers professional automotive window tinting that delivers heat rejection, UV protection, glare reduction, privacy, and a clean, premium finish. Every installation is performed by experienced technicians using top-tier films from <strong>SunTek</strong>, <strong>3M</strong>, <strong>Hexis</strong> and <strong>Avery Dennison</strong> — all backed by a <strong>lifetime warranty</strong>.</p>
    <ul class="feature-list">
      <li><i class="fas fa-shield-alt"></i> Lifetime warranty on all tint films</li>
      <li><i class="fas fa-temperature-low"></i> Up to 99% UV rejection &amp; superior heat reduction</li>
      <li><i class="fas fa-medal"></i> 221+ verified 5-star Google reviews</li>
      <li><i class="fas fa-tools"></i> Carbon, ceramic and premium nano-ceramic films available</li>
      <li><i class="fas fa-car"></i> All vehicle types — sedans, SUVs, utes, 4WDs, EVs &amp; luxury vehicles</li>
      <li><i class="fas fa-map-marker-alt"></i> Convenient location for ${p.suburb} drivers — minutes away in Tullamarine</li>
    </ul>
  </div>
</section>

<section class="content-section alt">
  <div class="container">
    <h2>Our Window Tinting Process</h2>
    <ol class="steps">
      <li><strong>Free quote</strong> — call us or use our online price calculator</li>
      <li><strong>Choose your shade &amp; film</strong> — VLT options from 5% to 35% in ceramic, carbon &amp; standard</li>
      <li><strong>Professional installation</strong> in our climate-controlled Tullamarine workshop</li>
      <li><strong>Quality check &amp; warranty registration</strong> before pickup</li>
    </ol>
    <p>All installs are <abbr title="Visible Light Transmission">VLT</abbr>-compliant with VicRoads regulations.</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <h2>Other Services Available to ${p.suburb} Customers</h2>
    <div class="service-grid">
      <a href="/ceramic-coating/" class="service-card"><h3>Ceramic Coating</h3><p>Long-lasting paint protection with a hydrophobic gloss finish.</p></a>
      <a href="/car-wrap-blackouts/" class="service-card"><h3>Vinyl Wrapping &amp; Blackouts</h3><p>Full or partial wraps in any colour or finish.</p></a>
      <a href="/headlights-taillights-tint/" class="service-card"><h3>Headlights &amp; Taillights Tint</h3><p>Smoked, gloss or custom-finish lighting tints.</p></a>
      <a href="${homeHref}" class="service-card"><h3>Home Window Tinting</h3><p>Residential &amp; commercial tinting for ${p.suburb} properties.</p></a>
    </div>
  </div>
</section>

<section class="content-section alt">
  <div class="container">
    <h2>Frequently Asked Questions – ${p.suburb}</h2>
    <details><summary>How long does car window tinting take?</summary><p>Most full-vehicle installations are completed in 2–4 hours depending on the vehicle and film selection.</p></details>
    <details><summary>Is the tint warranty really for life?</summary><p>Yes — every Elite Car Tinting install is covered by a manufacturer-backed lifetime warranty against bubbling, peeling and discolouration.</p></details>
    <details><summary>Do you tint EVs and Teslas?</summary><p>Absolutely. We're experienced with Tesla Model 3, Model Y, Model S and all major EV brands.</p></details>
    <details><summary>How far is your workshop from ${p.suburb}?</summary><p>Our Tullamarine workshop at Unit 9/9 Lindaway Place is just a short drive from ${p.suburb} — easy access from the Tullamarine Freeway.</p></details>
  </div>
</section>`;
}

function renderHomeLocation(p) {
  return `
<section class="page-hero">
  <div class="container">
    <h1>${p.h1}</h1>
    <p class="lead">Elite Car Tinting offers premium <strong>residential and commercial window tinting in ${p.suburb}</strong>. Reduce heat, glare and harmful UV rays while increasing privacy and energy efficiency in your home or business — all backed by a lifetime warranty.</p>
    <div class="hero-cta">
      <a href="/contact-us/" class="btn btn-primary btn-lg"><i class="fas fa-envelope"></i> Request a Free Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <h2>Benefits of Home Window Tinting in ${p.suburb}</h2>
    <ul class="feature-list">
      <li><i class="fas fa-temperature-low"></i> Up to 80% heat rejection — keep your home cooler in summer</li>
      <li><i class="fas fa-sun"></i> Up to 99% UV protection — prevent furniture, flooring &amp; artwork from fading</li>
      <li><i class="fas fa-eye-slash"></i> Daytime privacy without sacrificing natural light</li>
      <li><i class="fas fa-bolt"></i> Lower energy bills by reducing air-conditioning load</li>
      <li><i class="fas fa-shield-alt"></i> Safety &amp; security films available to hold glass together on impact</li>
      <li><i class="fas fa-leaf"></i> Reduce glare on TVs and monitors throughout the home</li>
    </ul>
  </div>
</section>

<section class="content-section alt">
  <div class="container">
    <h2>Residential &amp; Commercial Tinting Solutions</h2>
    <p>Whether you live in a heritage home in ${p.suburb} or run a glass-fronted retail or office space, we have a film to suit. Choose from solar control, decorative frosted, one-way reflective, security, and anti-graffiti films from <strong>SunTek</strong>, <strong>3M</strong> and <strong>Avery Dennison</strong>.</p>
    <p>We service homes, offices, shopfronts, schools, gyms, and clinics across ${p.suburb} and the surrounding suburbs.</p>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <h2>How It Works</h2>
    <ol class="steps">
      <li><strong>On-site measure &amp; quote</strong> in ${p.suburb} — free of charge</li>
      <li><strong>Film selection</strong> based on your goals (heat, privacy, security, aesthetics)</li>
      <li><strong>Professional installation</strong> by trained technicians, minimal disruption</li>
      <li><strong>Lifetime warranty</strong> registered against bubbling, peeling &amp; discolouration</li>
    </ol>
  </div>
</section>`;
}

function renderService(p) {
  const blurb = {
    'Headlights & Taillights Tint': "Protect and personalise your vehicle's lighting with our premium headlight and taillight tints. Available in light smoke, medium smoke, dark smoke, gloss, and custom colour finishes — installed by hand for a flawless, long-lasting result.",
    'Ceramic Coating': "Our nano-ceramic coatings bond to your vehicle's paintwork to create a hydrophobic, scratch-resistant, UV-stable layer that lasts years. Reduce washing time, repel contaminants, and maintain a showroom gloss.",
    'Vinyl Wrapping & Blackouts': 'Transform your car with a full vinyl wrap, partial wrap, or chrome-delete blackout package. We use Avery Dennison and 3M cast vinyls in matte, gloss, satin, metallic, and pearlescent finishes.',
    'Automotive Window Tinting': 'Premium automotive window tinting using top-tier ceramic, carbon and standard films. Heat rejection, UV protection, privacy, glare reduction and a clean, premium look — backed by a lifetime warranty.',
  }[p.service];
  return `
<section class="page-hero">
  <div class="container">
    <h1>${p.h1}</h1>
    <p class="lead">${blurb}</p>
    <div class="hero-cta">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="container">
    <h2>Why Elite Car Tinting</h2>
    <ul class="feature-list">
      <li><i class="fas fa-shield-alt"></i> Lifetime warranty on every install</li>
      <li><i class="fas fa-medal"></i> 221+ verified 5-star Google reviews</li>
      <li><i class="fas fa-tools"></i> Premium materials — SunTek, 3M, Hexis, Avery Dennison</li>
      <li><i class="fas fa-map-marker-alt"></i> Convenient Tullamarine workshop serving all of Melbourne</li>
    </ul>
  </div>
</section>

<section class="content-section alt">
  <div class="container">
    <h2>Servicing Melbourne &amp; Surrounds</h2>
    <p>Our ${p.service} service is available to customers in <a href="/car-window-tinting-tullamarine/">Tullamarine</a>, <a href="/car-window-tinting-essendon/">Essendon</a>, <a href="/car-window-tinting-keilor/">Keilor</a>, <a href="/car-window-tinting-sunbury/">Sunbury</a>, <a href="/car-window-tinting-airport-west/">Airport West</a>, <a href="/car-window-tinting-moonee-ponds/">Moonee Ponds</a>, <a href="/car-window-tinting-strathmore/">Strathmore</a> and surrounding Melbourne suburbs.</p>
  </div>
</section>`;
}

function renderAbout() {
  return `
<section class="page-hero">
  <div class="container">
    <h1>About</h1>
    <p class="lead">Elite Car Tinting is Melbourne's premier destination for car window tinting, ceramic coating, vinyl wrapping and home window tinting. Based in Tullamarine, we elevate your vehicle's style, comfort, and protection with expert craftsmanship and premium materials.</p>
  </div>
</section>
<section class="content-section">
  <div class="container">
    <h2>Our Story</h2>
    <p>For over a decade we've been the trusted choice for Melbourne drivers seeking professional, no-shortcuts window tinting. From everyday family cars to luxury and exotic vehicles, every install gets the same uncompromising standard.</p>
    <h2>Our Promise</h2>
    <ul class="feature-list">
      <li><i class="fas fa-shield-alt"></i> Lifetime warranty on every install</li>
      <li><i class="fas fa-medal"></i> 221+ verified 5-star Google reviews</li>
      <li><i class="fas fa-tools"></i> Only premium films — SunTek, 3M, Hexis, Avery Dennison</li>
      <li><i class="fas fa-handshake"></i> Honest pricing with no hidden fees</li>
    </ul>
  </div>
</section>`;
}

function renderContact() {
  return `
<section class="page-hero">
  <div class="container">
    <h1>Contact Us</h1>
    <p class="lead">Get in touch with Elite Car Tinting for a free quote on car window tinting, ceramic coating, vinyl wrapping or home window tinting.</p>
  </div>
</section>
<section class="content-section">
  <div class="container contact-grid">
    <div>
      <h2>Visit Us</h2>
      <p><strong>Address:</strong> Unit 9/9 Lindaway Pl, Tullamarine VIC 3043</p>
      <p><strong>Phone:</strong> <a href="tel:+61411017040">0411 017 040</a></p>
      <p><strong>Email:</strong> <a href="mailto:contact@elitecartinting.com.au">contact@elitecartinting.com.au</a></p>
      <h3>Opening Hours</h3>
      <ul>
        <li>Monday – Friday: 8:00 AM – 5:00 PM</li>
        <li>Saturday: 10:00 AM – 2:00 PM</li>
        <li>Sunday: Closed</li>
      </ul>
    </div>
    <div>
      <iframe src="https://www.google.com/maps?q=Unit+9%2F9+Lindaway+Pl%2C+Tullamarine+VIC+3043&output=embed" width="100%" height="380" style="border:0; border-radius: 12px;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Elite Car Tinting Location"></iframe>
    </div>
  </div>
</section>`;
}

function renderGallery() {
  return `
<section class="page-hero">
  <div class="container">
    <h1>Gallery</h1>
    <p class="lead">A selection of our recent car window tinting, ceramic coating and vinyl wrap installations.</p>
    <a href="/#gallery" class="btn btn-primary btn-lg">View Full Gallery</a>
  </div>
</section>
<section class="content-section">
  <div class="container">
    <p>Browse our complete portfolio on the <a href="/#gallery">homepage gallery</a>, or follow us on Instagram <a href="https://www.instagram.com/elitecartinting" rel="noopener">@elitecartinting</a> for our latest builds.</p>
  </div>
</section>`;
}

function renderBody(p) {
  switch (p.type) {
    case 'car':     return renderCarLocation(p);
    case 'home':    return renderHomeLocation(p);
    case 'service': return renderService(p);
    case 'about':   return renderAbout();
    case 'contact': return renderContact();
    case 'gallery': return renderGallery();
    default:        return '';
  }
}

// ----- Page assembly -----
function buildPage(p) {
  const url = `${SITE}/${p.slug}/`;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title}</title>
  <meta name="description" content="${p.description}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="author" content="Elite Car Tinting" />
  <meta name="geo.region" content="AU-VIC" />
  <meta name="geo.placename" content="${p.suburb || 'Tullamarine'}" />
  <link rel="canonical" href="${url}" />

  <!-- Open Graph -->
  <meta property="og:locale" content="en_AU" />
  <meta property="og:site_name" content="Elite Car Tinting" />
  <meta property="og:title" content="${p.title}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/images/og-image.jpg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title}" />
  <meta name="twitter:description" content="${p.description}" />
  <meta name="twitter:image" content="${SITE}/images/og-image.jpg" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" />

  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/seo-pages.css" />

  ${localBusinessSchema(p)}
  ${breadcrumbSchema(p.slug, p.h1)}
</head>
<body>
${NAV}
<main class="seo-page">
${renderBody(p)}

<section class="cta-band">
  <div class="container">
    <h2>Ready for a Free Quote?</h2>
    <p>Call us today or use our online price calculator. Same-day service available.</p>
    <div class="hero-cta">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>
</main>
${FOOTER}
</body>
</html>
`;
}

// ----- Write files -----
let written = 0;
for (const p of PAGES) {
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'index.html');
  fs.writeFileSync(file, buildPage(p), 'utf8');
  written++;
  console.log(`✓ ${p.slug}/index.html`);
}

// ----- sitemap.xml -----
const today = new Date().toISOString().split('T')[0];
const urls = [
  { loc: SITE + '/', priority: '1.0' },
  ...PAGES.map(p => ({ loc: `${SITE}/${p.slug}/`, priority: p.type === 'about' || p.type === 'contact' || p.type === 'gallery' ? '0.6' : '0.8' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ sitemap.xml');

// ----- robots.txt -----
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
console.log('✓ robots.txt');

console.log(`\nDone — wrote ${written} pages + sitemap + robots.txt`);
