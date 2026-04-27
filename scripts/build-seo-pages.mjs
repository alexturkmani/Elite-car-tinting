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
  {
    slug: 'car-window-tinting-melbourne-cbd',
    type: 'car',
    suburb: 'Melbourne CBD',
    title: 'Car Window Tinting Melbourne CBD | Elite Car Tinting',
    description: 'Premium car window tinting for Melbourne CBD drivers. Ceramic & carbon films, lifetime warranty, mobile service available. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Melbourne CBD',
  },
  {
    slug: 'car-window-tinting-taylors-lakes',
    type: 'car',
    suburb: 'Taylors Lakes',
    title: 'Car Window Tinting Taylors Lakes | Elite Car Tinting',
    description: 'Trusted car window tinting near Taylors Lakes. Top-quality ceramic films, expert installation and a lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Taylors Lakes',
  },
  {
    slug: 'car-window-tinting-niddrie',
    type: 'car',
    suburb: 'Niddrie',
    title: 'Car Window Tinting Niddrie | Elite Car Tinting',
    description: 'Local car window tinting for Niddrie. Premium ceramic & carbon films, expert installers, lifetime warranty. Get a Free Quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Niddrie',
  },
  {
    slug: 'car-window-tinting-flemington',
    type: 'car',
    suburb: 'Flemington',
    title: 'Car Window Tinting Flemington | Elite Car Tinting',
    description: 'Quality car window tinting for Flemington. Ceramic & carbon films, expert installation, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Flemington',
  },
  {
    slug: 'car-window-tinting-ascot-vale',
    type: 'car',
    suburb: 'Ascot Vale',
    title: 'Car Window Tinting Ascot Vale | Elite Car Tinting',
    description: 'Local Ascot Vale car window tinting. Premium films, lifetime warranty, expert installers. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Ascot Vale',
  },
  {
    slug: 'car-window-tinting-brunswick',
    type: 'car',
    suburb: 'Brunswick',
    title: 'Car Window Tinting Brunswick | Elite Car Tinting',
    description: 'Trusted car window tinting for Brunswick. Premium ceramic films, expert installation, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Brunswick',
  },
  {
    slug: 'car-window-tinting-coburg',
    type: 'car',
    suburb: 'Coburg',
    title: 'Car Window Tinting Coburg | Elite Car Tinting',
    description: 'Premium car window tinting near Coburg. Top-quality films, expert installers, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Coburg',
  },
  {
    slug: 'car-window-tinting-glenroy',
    type: 'car',
    suburb: 'Glenroy',
    title: 'Car Window Tinting Glenroy | Elite Car Tinting',
    description: 'Quality car window tinting in Glenroy. Premium ceramic & carbon films, expert installation, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Glenroy',
  },
  {
    slug: 'car-window-tinting-broadmeadows',
    type: 'car',
    suburb: 'Broadmeadows',
    title: 'Car Window Tinting Broadmeadows | Elite Car Tinting',
    description: 'Local car window tinting for Broadmeadows. Premium films, lifetime warranty, expert installers. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Broadmeadows',
  },
  {
    slug: 'car-window-tinting-pascoe-vale',
    type: 'car',
    suburb: 'Pascoe Vale',
    title: 'Car Window Tinting Pascoe Vale | Elite Car Tinting',
    description: 'Trusted car window tinting in Pascoe Vale. Premium ceramic films, expert installation, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Pascoe Vale',
  },
  {
    slug: 'car-window-tinting-parkville',
    type: 'car',
    suburb: 'Parkville',
    title: 'Car Window Tinting Parkville | Elite Car Tinting',
    description: 'Premium car window tinting for Parkville. Ceramic & carbon films, lifetime warranty, expert installers. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Parkville',
  },
  {
    slug: 'car-window-tinting-north-melbourne',
    type: 'car',
    suburb: 'North Melbourne',
    title: 'Car Window Tinting North Melbourne | Elite Car Tinting',
    description: 'Trusted car window tinting in North Melbourne. Premium films, expert installation, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting North Melbourne',
  },

  {
    slug: 'car-window-tinting-tullamarine',
    type: 'car',
    suburb: 'Tullamarine',
    title: 'Car Window Tinting Tullamarine | Elite Car Tinting',
    description: 'Local car window tinting in Tullamarine — that\'s our home shop. Premium ceramic & carbon films, expert installers, lifetime warranty. Free quote from Elite Car Tinting.',
    h1: 'Car Window Tinting Tullamarine',
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
    <a href="tel:+61411017040" class="btn btn-nav">
      <i class="fas fa-phone-alt"></i> Call Us
    </a>
    <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

const FOOTER = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo logo-footer" aria-label="Elite Car Tinting">
          <img src="/images/logo.webp" alt="Elite Car Tinting" class="logo-img" />
        </a>
        <p>Tullamarine's trusted experts in car window tinting, ceramic coating, vinyl wrapping &amp; home window tinting. Premium films, expert installation, lifetime warranty.</p>
        <div class="footer-social">
          <a href="https://www.facebook.com/elitecartinting" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/elitecartinting" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@elitecartinting" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
          <a href="https://g.page/elitecartinting" target="_blank" rel="noopener" aria-label="Google"><i class="fab fa-google"></i></a>
        </div>
      </div>
      <div class="footer-links">
        <h4>Services</h4>
        <ul>
          <li><a href="/automotive-window-tinting/">Automotive Window Tinting</a></li>
          <li><a href="/ceramic-coating/">Ceramic Coating</a></li>
          <li><a href="/car-wrap-blackouts/">Vinyl Wrapping &amp; Blackouts</a></li>
          <li><a href="/headlights-taillights-tint/">Headlights &amp; Taillights Tint</a></li>
          <li><a href="/home-window-tinting-tullamarine/">Home Window Tinting</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Service Areas</h4>
        <ul>
          <li><a href="/car-window-tinting-keilor/">Car Tinting Keilor</a></li>
          <li><a href="/car-window-tinting-essendon/">Car Tinting Essendon</a></li>
          <li><a href="/car-window-tinting-airport-west/">Car Tinting Airport West</a></li>
          <li><a href="/car-window-tinting-strathmore/">Car Tinting Strathmore</a></li>
          <li><a href="/car-window-tinting-sunbury/">Car Tinting Sunbury</a></li>
          <li><a href="/car-window-tinting-moonee-ponds/">Car Tinting Moonee Ponds</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p><i class="fas fa-phone-alt"></i> <a href="tel:+61411017040">0411 017 040</a></p>
        <p><i class="fas fa-envelope"></i> <a href="mailto:contact@elitecartinting.com.au">contact@elitecartinting.com.au</a></p>
        <p><i class="fas fa-map-marker-alt"></i> Unit 9/9 Lindaway Pl, Tullamarine VIC 3043</p>
        <p><i class="fas fa-clock"></i> Mon–Fri 8am–5pm, Sat 10am–2pm</p>
        <a href="/#calculator" class="btn btn-primary btn-sm footer-cta">Get a Quote</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} Elite Car Tinting. All rights reserved.</p>
      <div class="footer-legal">
        <a href="/about-us/">About</a>
        <a href="/contact-us/">Contact</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
  </div>
</footer>

<!-- Static Call Bar -->
<div class="call-bar" id="callBar">
  <div class="container">
    <div class="call-bar-inner">
      <div class="call-bar-info">
        <div class="call-bar-icon"><i class="fas fa-phone-alt"></i></div>
        <div class="call-bar-text">
          <strong>Ready to book? Call us now</strong>
          <span>Same-day appointments available · Tullamarine VIC</span>
        </div>
      </div>
      <a href="tel:+61411017040" class="btn btn-primary btn-call">
        <i class="fas fa-phone-alt"></i> 0411 017 040
      </a>
    </div>
  </div>
</div>`;

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
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas fa-map-marker-alt"></i> ${p.suburb}, VIC</div>
    <h1>${p.h1.replace('Car Window Tinting', '<span class="gradient-text">Car Window Tinting</span>')}</h1>
    <p class="seo-hero-subtitle">Looking for the best car window tinting near ${p.suburb}? Elite Car Tinting has been serving ${p.suburb} drivers with expert installations, premium films, and a lifetime warranty for over a decade. Based minutes away in Tullamarine.</p>
    <div class="seo-hero-trust">
      <div class="trust-item"><i class="fas fa-shield-alt"></i> Lifetime Warranty</div>
      <div class="trust-item"><i class="fas fa-clock"></i> Same-Day Service</div>
      <div class="trust-item"><i class="fas fa-medal"></i> 221+ 5-Star Reviews</div>
    </div>
    <div class="seo-hero-cta">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Our Services</span>
      <h2>Choose Your <span class="gradient-text">Service</span></h2>
      <p>Pick the service you need. We&rsquo;ll then ask about your vehicle, film type and shade so we can build a transparent quote.</p>
    </div>
    <div class="seo-service-grid">
      <a href="/#calculator" class="seo-service-card"><i class="fas fa-car-side"></i><h3>Automotive Window Tinting</h3><p>Premium ceramic, carbon &amp; standard films for cars, SUVs, utes &amp; 4WDs.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=ceramic" class="seo-service-card"><i class="fas fa-shield-alt"></i><h3>Ceramic Coating</h3><p>Long-lasting nano-ceramic paint protection with hydrophobic gloss.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=wrap" class="seo-service-card"><i class="fas fa-paint-roller"></i><h3>Vinyl Wrapping &amp; Blackouts</h3><p>Full or partial wraps and chrome-delete blackouts.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=headlights" class="seo-service-card"><i class="fas fa-lightbulb"></i><h3>Headlights &amp; Taillights Tint</h3><p>Smoked or tinted lighting film with road-legal shades.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=home" class="seo-service-card"><i class="fas fa-home"></i><h3>Home &amp; Commercial Tinting</h3><p>Residential &amp; commercial window film for ${p.suburb} properties.</p><span class="seo-card-arrow">&rarr;</span></a>
    </div>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Why Choose Us</span>
      <h2>Why ${p.suburb} Drivers Choose<br><span class="gradient-text">Elite Car Tinting</span></h2>
      <p>Professional automotive window tinting that delivers heat rejection, UV protection, glare reduction, privacy, and a clean, premium finish.</p>
    </div>
    <div class="seo-feature-grid">
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-shield-alt"></i></div><h4>Lifetime Warranty</h4><p>Every install is backed by a manufacturer-backed lifetime warranty against bubbling, peeling and discolouration.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-temperature-low"></i></div><h4>Up to 99% UV Rejection</h4><p>Premium ceramic films block harmful UV and reject up to 80% of solar heat, keeping your interior cooler.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-medal"></i></div><h4>221+ 5-Star Reviews</h4><p>Verified reviews from happy ${p.suburb} and Melbourne drivers across Google, Facebook and Instagram.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-tools"></i></div><h4>Premium Films</h4><p>SunTek, 3M, Hexis &amp; Avery Dennison — carbon, ceramic and nano-ceramic options for every budget.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-car"></i></div><h4>Every Vehicle Type</h4><p>Sedans, hatches, SUVs, utes, 4WDs, EVs and luxury vehicles — including Tesla, BMW, Mercedes &amp; more.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-map-marker-alt"></i></div><h4>Convenient Location</h4><p>Just minutes from ${p.suburb} via the Tullamarine Freeway. Free off-street parking at our workshop.</p></div>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Our Process</span>
      <h2>Simple, Transparent &amp; Fast</h2>
    </div>
    <div class="seo-steps">
      <div class="seo-step"><div class="seo-step-num">01</div><h4>Free Quote</h4><p>Call us or use our online price calculator for an instant quote.</p></div>
      <div class="seo-step"><div class="seo-step-num">02</div><h4>Choose Your Tint</h4><p>VLT options from 5% to 35% in ceramic, carbon &amp; standard films.</p></div>
      <div class="seo-step"><div class="seo-step-num">03</div><h4>Professional Install</h4><p>Climate-controlled Tullamarine workshop. Most cars completed in 2–4 hours.</p></div>
      <div class="seo-step"><div class="seo-step-num">04</div><h4>Lifetime Warranty</h4><p>Quality check, warranty registration, and you're on your way.</p></div>
    </div>
    <p class="seo-note"><i class="fas fa-info-circle"></i> All installs are <abbr title="Visible Light Transmission">VLT</abbr>-compliant with VicRoads regulations.</p>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">More Services</span>
      <h2>Other Services for ${p.suburb} Customers</h2>
    </div>
    <div class="seo-service-grid">
      <a href="/ceramic-coating/" class="seo-service-card"><i class="fas fa-shield-alt"></i><h3>Ceramic Coating</h3><p>Long-lasting paint protection with a hydrophobic gloss finish.</p><span class="seo-card-arrow">→</span></a>
      <a href="/car-wrap-blackouts/" class="seo-service-card"><i class="fas fa-paint-roller"></i><h3>Vinyl Wrapping &amp; Blackouts</h3><p>Full or partial wraps in any colour or finish.</p><span class="seo-card-arrow">→</span></a>
      <a href="/headlights-taillights-tint/" class="seo-service-card"><i class="fas fa-lightbulb"></i><h3>Headlights &amp; Taillights Tint</h3><p>Smoked, gloss or custom-finish lighting tints.</p><span class="seo-card-arrow">→</span></a>
      <a href="${homeHref}" class="seo-service-card"><i class="fas fa-home"></i><h3>Home Window Tinting</h3><p>Residential &amp; commercial tinting for ${p.suburb} properties.</p><span class="seo-card-arrow">→</span></a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">FAQ</span>
      <h2>Common Questions – ${p.suburb}</h2>
    </div>
    <div class="seo-faq">
      <details><summary>How long does car window tinting take? <i class="fas fa-chevron-down"></i></summary><p>Most full-vehicle installations are completed in 2–4 hours depending on the vehicle and film selection.</p></details>
      <details><summary>Is the tint warranty really for life? <i class="fas fa-chevron-down"></i></summary><p>Yes — every Elite Car Tinting install is covered by a manufacturer-backed lifetime warranty against bubbling, peeling and discolouration.</p></details>
      <details><summary>Do you tint EVs and Teslas? <i class="fas fa-chevron-down"></i></summary><p>Absolutely. We're experienced with Tesla Model 3, Model Y, Model S and all major EV brands.</p></details>
      <details><summary>How far is your workshop from ${p.suburb}? <i class="fas fa-chevron-down"></i></summary><p>Our Tullamarine workshop at Unit 9/9 Lindaway Place is just a short drive from ${p.suburb} — easy access from the Tullamarine Freeway.</p></details>
    </div>
  </div>
</section>`;
}

function renderHomeLocation(p) {
  return `
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas fa-home"></i> Residential &amp; Commercial</div>
    <h1>${p.h1.replace('Window Tinting', '<span class="gradient-text">Window Tinting</span>')}</h1>
    <p class="seo-hero-subtitle">Premium <strong>residential and commercial window tinting in ${p.suburb}</strong>. Reduce heat, glare and harmful UV rays while increasing privacy and energy efficiency — all backed by a lifetime warranty.</p>
    <div class="seo-hero-trust">
      <div class="trust-item"><i class="fas fa-shield-alt"></i> Lifetime Warranty</div>
      <div class="trust-item"><i class="fas fa-leaf"></i> Energy Efficient</div>
      <div class="trust-item"><i class="fas fa-eye-slash"></i> Privacy &amp; Security</div>
    </div>
    <div class="seo-hero-cta">
      <a href="/contact-us/" class="btn btn-primary btn-lg"><i class="fas fa-envelope"></i> Request Free Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Our Services</span>
      <h2>Choose Your <span class="gradient-text">Service</span></h2>
      <p>Pick the service you need. We&rsquo;ll then ask about your vehicle, film type and shade so we can build a transparent quote.</p>
    </div>
    <div class="seo-service-grid">
      <a href="/#calculator" class="seo-service-card"><i class="fas fa-car-side"></i><h3>Automotive Window Tinting</h3><p>Premium ceramic, carbon &amp; standard films for cars, SUVs, utes &amp; 4WDs.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=ceramic" class="seo-service-card"><i class="fas fa-shield-alt"></i><h3>Ceramic Coating</h3><p>Long-lasting nano-ceramic paint protection with hydrophobic gloss.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=wrap" class="seo-service-card"><i class="fas fa-paint-roller"></i><h3>Vinyl Wrapping &amp; Blackouts</h3><p>Full or partial wraps and chrome-delete blackouts.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/#calculator?service=headlights" class="seo-service-card"><i class="fas fa-lightbulb"></i><h3>Headlights &amp; Taillights Tint</h3><p>Smoked or tinted lighting film with road-legal shades.</p><span class="seo-card-arrow">&rarr;</span></a>
      <a href="/contact-us/" class="seo-service-card"><i class="fas fa-home"></i><h3>Home &amp; Commercial Tinting</h3><p>Residential &amp; commercial window film for ${p.suburb} properties.</p><span class="seo-card-arrow">&rarr;</span></a>
    </div>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Benefits</span>
      <h2>Home Window Tinting in <span class="gradient-text">${p.suburb}</span></h2>
      <p>Whether it's heat reduction, privacy or UV protection — film delivers measurable results.</p>
    </div>
    <div class="seo-feature-grid">
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-temperature-low"></i></div><h4>Up to 80% Heat Rejection</h4><p>Keep your home or office cool through Melbourne's hot summers without overworking the air-con.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-sun"></i></div><h4>99% UV Protection</h4><p>Prevent furniture, flooring &amp; artwork from fading. Protect your skin and your investment.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-eye-slash"></i></div><h4>Daytime Privacy</h4><p>One-way reflective films give you privacy from outside without sacrificing natural light.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-bolt"></i></div><h4>Lower Energy Bills</h4><p>Reduced cooling load means smaller power bills — film typically pays for itself in 2–3 years.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-shield-alt"></i></div><h4>Safety &amp; Security Films</h4><p>Hold glass together on impact — protect against break-ins, storms and accidents.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-leaf"></i></div><h4>Reduced Glare</h4><p>Eliminate screen glare on TVs and monitors throughout the home or workspace.</p></div>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Solutions</span>
      <h2>Residential &amp; Commercial Tinting</h2>
      <p>Whether you live in a heritage home in ${p.suburb} or run a glass-fronted retail or office space, we have a film to suit.</p>
    </div>
    <div class="seo-service-grid">
      <div class="seo-service-card"><i class="fas fa-temperature-low"></i><h3>Solar Control Films</h3><p>Maximum heat rejection with a clear or lightly tinted finish.</p></div>
      <div class="seo-service-card"><i class="fas fa-eye-slash"></i><h3>Privacy &amp; Frosted</h3><p>Decorative frost, gradient and one-way reflective options.</p></div>
      <div class="seo-service-card"><i class="fas fa-shield-alt"></i><h3>Security Films</h3><p>Hold glass together on impact — anti-shatter protection.</p></div>
      <div class="seo-service-card"><i class="fas fa-spray-can"></i><h3>Anti-Graffiti</h3><p>Protect shopfront glass — replaceable sacrificial layer.</p></div>
    </div>
    <p class="seo-note"><i class="fas fa-info-circle"></i> All films supplied by <strong>SunTek</strong>, <strong>3M</strong> &amp; <strong>Avery Dennison</strong>.</p>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">How It Works</span>
      <h2>Simple, Stress-Free Installation</h2>
    </div>
    <div class="seo-steps">
      <div class="seo-step"><div class="seo-step-num">01</div><h4>On-Site Quote</h4><p>Free measure and consultation in ${p.suburb}.</p></div>
      <div class="seo-step"><div class="seo-step-num">02</div><h4>Film Selection</h4><p>Choose based on your goals (heat, privacy, security, aesthetics).</p></div>
      <div class="seo-step"><div class="seo-step-num">03</div><h4>Professional Install</h4><p>Trained technicians, minimal disruption to your home or business.</p></div>
      <div class="seo-step"><div class="seo-step-num">04</div><h4>Lifetime Warranty</h4><p>Registered against bubbling, peeling and discolouration.</p></div>
    </div>
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
  const icon = {
    'Headlights & Taillights Tint': 'fa-lightbulb',
    'Ceramic Coating': 'fa-shield-alt',
    'Vinyl Wrapping & Blackouts': 'fa-paint-roller',
    'Automotive Window Tinting': 'fa-car',
  }[p.service];
  return `
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas ${icon}"></i> Premium Service</div>
    <h1><span class="gradient-text">${p.h1}</span></h1>
    <p class="seo-hero-subtitle">${blurb}</p>
    <div class="seo-hero-trust">
      <div class="trust-item"><i class="fas fa-shield-alt"></i> Lifetime Warranty</div>
      <div class="trust-item"><i class="fas fa-medal"></i> 221+ 5-Star Reviews</div>
      <div class="trust-item"><i class="fas fa-tools"></i> Premium Materials</div>
    </div>
    <div class="seo-hero-cta">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Why Elite</span>
      <h2>The <span class="gradient-text">Elite</span> Difference</h2>
    </div>
    <div class="seo-feature-grid">
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-shield-alt"></i></div><h4>Lifetime Warranty</h4><p>Every install backed for the life of the vehicle/property.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-medal"></i></div><h4>221+ 5-Star Reviews</h4><p>Verified reviews on Google, Facebook &amp; Instagram.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-tools"></i></div><h4>Premium Materials</h4><p>SunTek, 3M, Hexis &amp; Avery Dennison — no compromises.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-map-marker-alt"></i></div><h4>Tullamarine Workshop</h4><p>Climate-controlled facility serving all of Melbourne.</p></div>
    </div>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Service Areas</span>
      <h2>Servicing Melbourne &amp; Surrounds</h2>
      <p>Our ${p.service} service is available across Melbourne's north and west.</p>
    </div>
    <div class="seo-areas-grid">
      <a href="/car-window-tinting-essendon/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Essendon</a>
      <a href="/car-window-tinting-keilor/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Keilor</a>
      <a href="/car-window-tinting-sunbury/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Sunbury</a>
      <a href="/car-window-tinting-airport-west/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Airport West</a>
      <a href="/car-window-tinting-moonee-ponds/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Moonee Ponds</a>
      <a href="/car-window-tinting-strathmore/" class="seo-area-tag"><i class="fas fa-map-marker-alt"></i> Strathmore</a>
      <a href="/home-window-tinting-tullamarine/" class="seo-area-tag primary"><i class="fas fa-map-marker-alt"></i> Tullamarine</a>
    </div>
  </div>
</section>`;
}

function renderAbout() {
  return `
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas fa-award"></i> Established 2010+</div>
    <h1>About <span class="gradient-text">Elite Car Tinting</span></h1>
    <p class="seo-hero-subtitle">Melbourne's premier destination for car window tinting, ceramic coating, vinyl wrapping and home window tinting. Based in Tullamarine, we elevate your vehicle's style, comfort, and protection with expert craftsmanship and premium materials.</p>
    <div class="seo-hero-cta">
      <a href="/contact-us/" class="btn btn-primary btn-lg"><i class="fas fa-envelope"></i> Get in Touch</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Our Story</span>
      <h2>Built on <span class="gradient-text">Quality &amp; Trust</span></h2>
      <p>For over a decade we've been the trusted choice for Melbourne drivers seeking professional, no-shortcuts window tinting. From everyday family cars to luxury and exotic vehicles, every install gets the same uncompromising standard.</p>
    </div>
  </div>
</section>

<section class="seo-section seo-section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Our Promise</span>
      <h2>What You Can Expect</h2>
    </div>
    <div class="seo-feature-grid">
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-shield-alt"></i></div><h4>Lifetime Warranty</h4><p>Every install backed by a manufacturer-backed lifetime warranty.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-medal"></i></div><h4>221+ 5-Star Reviews</h4><p>Verified Google reviews from happy Melbourne customers.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-tools"></i></div><h4>Premium Films Only</h4><p>SunTek, 3M, Hexis, Avery Dennison — no generic films.</p></div>
      <div class="seo-feature-card"><div class="seo-feature-icon"><i class="fas fa-handshake"></i></div><h4>Honest Pricing</h4><p>Transparent quotes with no hidden fees or surprise add-ons.</p></div>
    </div>
  </div>
</section>`;
}

function renderContact() {
  return `
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas fa-envelope"></i> Get in Touch</div>
    <h1>Contact <span class="gradient-text">Elite Car Tinting</span></h1>
    <p class="seo-hero-subtitle">Free quotes on car window tinting, ceramic coating, vinyl wrapping &amp; home window tinting. Call us, email us, or visit our Tullamarine workshop.</p>
    <div class="seo-hero-cta">
      <a href="tel:+61411017040" class="btn btn-primary btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
      <a href="mailto:contact@elitecartinting.com.au" class="btn btn-outline btn-lg"><i class="fas fa-envelope"></i> Email Us</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="seo-contact-grid">
      <div class="seo-contact-info">
        <div class="seo-contact-item"><i class="fas fa-map-marker-alt"></i><div><h4>Visit Us</h4><p>Unit 9/9 Lindaway Pl<br>Tullamarine VIC 3043</p></div></div>
        <div class="seo-contact-item"><i class="fas fa-phone-alt"></i><div><h4>Call Us</h4><p><a href="tel:+61411017040">0411 017 040</a></p></div></div>
        <div class="seo-contact-item"><i class="fas fa-envelope"></i><div><h4>Email</h4><p><a href="mailto:contact@elitecartinting.com.au">contact@elitecartinting.com.au</a></p></div></div>
        <div class="seo-contact-item"><i class="fas fa-clock"></i><div><h4>Opening Hours</h4><p>Mon&ndash;Fri: 8:00&nbsp;AM &ndash; 5:00&nbsp;PM<br>Saturday: 10:00&nbsp;AM &ndash; 2:00&nbsp;PM<br>Sunday: Closed</p></div></div>
      </div>
      <div class="seo-contact-map">
        <iframe src="https://www.google.com/maps?q=Unit+9%2F9+Lindaway+Pl%2C+Tullamarine+VIC+3043&output=embed" width="100%" height="100%" style="border:0; min-height: 420px; border-radius: var(--radius-lg);" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Elite Car Tinting Location"></iframe>
      </div>
    </div>
  </div>
</section>`;
}

function renderGallery() {
  return `
<section class="seo-hero">
  <div class="seo-hero-bg"></div>
  <div class="seo-hero-overlay"></div>
  <div class="container seo-hero-content">
    <div class="hero-badge"><i class="fas fa-images"></i> Our Work</div>
    <h1><span class="gradient-text">Gallery</span></h1>
    <p class="seo-hero-subtitle">A selection of our recent car window tinting, ceramic coating and vinyl wrap installations across Melbourne.</p>
    <div class="seo-hero-cta">
      <a href="/#gallery" class="btn btn-primary btn-lg"><i class="fas fa-images"></i> View Full Gallery</a>
      <a href="https://www.instagram.com/elitecartinting" class="btn btn-outline btn-lg" rel="noopener" target="_blank"><i class="fab fa-instagram"></i> Follow on Instagram</a>
    </div>
  </div>
</section>

<section class="seo-section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Latest Work</span>
      <h2>Browse Our <span class="gradient-text">Recent Builds</span></h2>
      <p>Visit the homepage gallery for our complete portfolio, or follow us on Instagram <a href="https://www.instagram.com/elitecartinting" rel="noopener" style="color:var(--accent);">@elitecartinting</a> for our latest installs.</p>
    </div>
    <div class="seo-gallery-grid">
      <div class="seo-gallery-item" style="background-image:url('/images/tint-5.jpg');"></div>
      <div class="seo-gallery-item" style="background-image:url('/images/tint-20.jpg');"></div>
      <div class="seo-gallery-item" style="background-image:url('/images/tint-35.jpg');"></div>
      <div class="seo-gallery-item" style="background-image:url('/images/tint-50.jpg');"></div>
    </div>
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
<body class="seo-page-body">
${NAV}
<main class="seo-page">
${renderBody(p)}

<section class="seo-cta-band">
  <div class="container">
    <div class="section-header">
      <h2>Ready for a <span class="gradient-text">Free Quote?</span></h2>
      <p>Call us today or use our online price calculator. Same-day appointments available.</p>
    </div>
    <div class="seo-hero-cta" style="justify-content:center;">
      <a href="/#calculator" class="btn btn-primary btn-lg"><i class="fas fa-calculator"></i> Get Instant Quote</a>
      <a href="tel:+61411017040" class="btn btn-outline btn-lg"><i class="fas fa-phone-alt"></i> 0411 017 040</a>
    </div>
  </div>
</section>
</main>
${FOOTER}
<script src="/script.js" defer></script>
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
