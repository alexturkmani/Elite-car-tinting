/* ========================================
   ELITE CAR TINTING - Interactive JS
   ======================================== */

'use strict';

// ===== PRICING DATA =====
const BASE_PRICES = {
  hatchback: 299,
  sedan: 329,
  suv: 379,
  wagon: 399,
  ute: 349,
  luxury: 449
};

const FILM_PRICES = {
  standard: 0,
  carbon: 100,
  ceramic: 200
};

const FILM_LABELS = {
  standard: 'Standard Tint',
  carbon: 'Carbon Tint',
  ceramic: 'Ceramic Tint'
};

const VEHICLE_LABELS = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV / 4WD',
  wagon: 'Wagon / Van',
  ute: 'Ute / Truck',
  luxury: 'Luxury / Sports'
};

const SHADE_LABELS = {
  '50': '50% VLT – Light',
  '35': '35% VLT – Medium',
  '20': '20% VLT – Dark',
  '5': '5% VLT – Limo Dark'
};

const COVERAGE_LABELS = {
  full: 'Full Vehicle',
  rear: 'Rear Only',
  windscreen: 'Full + Windscreen'
};

// ===== CALCULATOR STATE =====
const calcState = {
  currentStep: 1,
  vehicle: null,
  film: null,
  shade: null,
  coverage: null
};

// ===== NAVBAR =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!navbar || !hamburger || !navLinks) return;

  // Scroll handler
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();

// ===== FLOATING CTA =====
(function initFloatingCta() {
  const floatingCta = document.getElementById('floatingCta');
  if (!floatingCta) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }, { passive: true });
})();

// ===== CALL BAR SCROLL REVEAL =====
(function initCallBar() {
  const callBar = document.getElementById('callBar');
  if (!callBar) return;
  const threshold = 300;
  function onScroll() {
    if (window.scrollY > threshold) {
      callBar.classList.add('visible');
      document.body.classList.add('call-bar-visible');
    } else {
      callBar.classList.remove('visible');
      document.body.classList.remove('call-bar-visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== STATS COUNTER =====
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  function animateCounters() {
    statNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      function update() {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current < target) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(update);
    });
  }

  function checkVisibility() {
    if (animated) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      animated = true;
      animateCounters();
    }
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
})();

// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.service-card, .gallery-item, .review-card, .why-feature, .area-tag, .stat-item, .faq-item'
  );
  if (!revealEls.length) return;

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  // Stagger children in grids
  ['.services-grid', '.reviews-grid', '.gallery-grid'].forEach(function (selector) {
    const grid = document.querySelector(selector);
    if (!grid) return;
    grid.querySelectorAll('.reveal').forEach(function (el, i) {
      el.classList.add('reveal-delay-' + ((i % 4) + 1));
    });
  });

  function checkReveal() {
    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();
})();

// ===== CALCULATOR =====
(function initCalculator() {

  // Helpers
  function showStep(stepNum) {
    document.querySelectorAll('.calc-step').forEach(function (step) {
      step.classList.remove('active');
    });
    const target = document.getElementById('step' + stepNum);
    if (target) {
      target.classList.add('active');
      // Scroll to calculator top
      const calc = document.getElementById('calculator');
      if (calc) {
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = calc.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }
    calcState.currentStep = stepNum;
    updateProgress(stepNum);
  }

  function updateProgress(stepNum) {
    document.querySelectorAll('.progress-step').forEach(function (step) {
      const num = parseInt(step.getAttribute('data-step'), 10);
      step.classList.remove('active', 'completed');
      if (num === stepNum) {
        step.classList.add('active');
      } else if (num < stepNum) {
        step.classList.add('completed');
        // Add checkmark
        const dot = step.querySelector('.progress-dot');
        if (dot && !dot.innerHTML.includes('fa-check')) {
          dot.innerHTML = '<i class="fas fa-check" style="font-size:0.7rem;color:#fff"></i>';
        }
      } else {
        const dot = step.querySelector('.progress-dot');
        if (dot) dot.innerHTML = '';
      }
    });

    // Update progress lines
    const lines = document.querySelectorAll('.progress-line');
    lines.forEach(function (line, i) {
      if (i < stepNum - 1) {
        line.classList.add('completed');
      } else {
        line.classList.remove('completed');
      }
    });
  }

  function formatPrice(price) {
    const abs = price < 0 ? -price : price;
    return '$' + abs.toLocaleString();
  }

  function calculateTotal() {
    const base = BASE_PRICES[calcState.vehicle] || 0;
    const film = FILM_PRICES[calcState.film] || 0;
    const shade = parseInt(
      (document.querySelector('input[name="shade"]:checked') || {}).getAttribute('data-price') || '0', 10
    );
    const coverage = parseInt(
      (document.querySelector('input[name="coverage"]:checked') || {}).getAttribute('data-price') || '0', 10
    );
    return { base, film, shade, coverage, total: base + film + shade + coverage };
  }

  function updateQuote() {
    const prices = calculateTotal();

    // Summary values
    const summaryVehicle = document.getElementById('summaryVehicle');
    const summaryFilm = document.getElementById('summaryFilm');
    const summaryShade = document.getElementById('summaryShade');
    const summaryCoverage = document.getElementById('summaryCoverage');
    const priceBase = document.getElementById('priceBase');
    const priceFilm = document.getElementById('priceFilm');
    const priceCoverage = document.getElementById('priceCoverage');
    const priceShade = document.getElementById('priceShade');
    const priceTotal = document.getElementById('priceTotal');

    if (summaryVehicle) summaryVehicle.textContent = VEHICLE_LABELS[calcState.vehicle] || '–';
    if (summaryFilm) summaryFilm.textContent = FILM_LABELS[calcState.film] || '–';
    if (summaryShade) summaryShade.textContent = SHADE_LABELS[calcState.shade] || '–';
    if (summaryCoverage) summaryCoverage.textContent = COVERAGE_LABELS[calcState.coverage] || '–';

    if (priceBase) priceBase.textContent = formatPrice(prices.base);
    if (priceFilm) priceFilm.textContent = prices.film > 0 ? '+' + formatPrice(prices.film) : formatPrice(0);
    if (priceCoverage) {
      const cv = prices.coverage;
      priceCoverage.textContent = cv < 0 ? '−' + formatPrice(cv) : cv > 0 ? '+' + formatPrice(cv) : formatPrice(0);
    }
    if (priceShade) priceShade.textContent = prices.shade > 0 ? '+' + formatPrice(prices.shade) : formatPrice(0);
    if (priceTotal) priceTotal.textContent = formatPrice(prices.total);
  }

  // Step 1: Vehicle Selection
  const vehicleInputs = document.querySelectorAll('input[name="vehicle"]');
  const toStep2Btn = document.getElementById('toStep2');

  vehicleInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      calcState.vehicle = this.value;
      if (toStep2Btn) toStep2Btn.disabled = false;
    });
  });

  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', function () {
      if (calcState.vehicle) showStep(2);
    });
  }

  // Step 2: Film Selection
  const filmInputs = document.querySelectorAll('input[name="film"]');
  const toStep3Btn = document.getElementById('toStep3');

  filmInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      calcState.film = this.value;
      if (toStep3Btn) toStep3Btn.disabled = false;
    });
  });

  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', function () {
      if (calcState.film) showStep(3);
    });
  }

  const backToStep1 = document.getElementById('backToStep1');
  if (backToStep1) {
    backToStep1.addEventListener('click', function () { showStep(1); });
  }

  // Step 3: Shade + Coverage
  const shadeInputs = document.querySelectorAll('input[name="shade"]');
  const coverageInputs = document.querySelectorAll('input[name="coverage"]');
  const toStep4Btn = document.getElementById('toStep4');

  function checkStep3Complete() {
    if (calcState.shade && calcState.coverage && toStep4Btn) {
      toStep4Btn.disabled = false;
    }
  }

  shadeInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      calcState.shade = this.value;
      checkStep3Complete();
    });
  });

  coverageInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      calcState.coverage = this.value;
      checkStep3Complete();
    });
  });

  // Pre-select most popular shade (35% VLT)
  const defaultShade = document.querySelector('input[name="shade"][value="35"]');
  if (defaultShade) {
    defaultShade.checked = true;
    calcState.shade = '35';
  }
  // Pre-select full coverage
  const defaultCoverage = document.querySelector('input[name="coverage"][value="full"]');
  if (defaultCoverage) {
    defaultCoverage.checked = true;
    calcState.coverage = 'full';
  }

  if (toStep4Btn) {
    toStep4Btn.disabled = false; // defaults are set
    toStep4Btn.addEventListener('click', function () {
      if (calcState.shade && calcState.coverage) {
        updateQuote();
        showStep(4);
      }
    });
  }

  const backToStep2 = document.getElementById('backToStep2');
  if (backToStep2) {
    backToStep2.addEventListener('click', function () { showStep(2); });
  }

  const backToStep3 = document.getElementById('backToStep3');
  if (backToStep3) {
    backToStep3.addEventListener('click', function () { showStep(3); });
  }

  // Reset
  const resetCalc = document.getElementById('resetCalc');
  if (resetCalc) {
    resetCalc.addEventListener('click', function () {
      // Reset state
      calcState.vehicle = null;
      calcState.film = null;
      calcState.shade = '35';
      calcState.coverage = 'full';
      calcState.currentStep = 1;

      // Uncheck all vehicle and film inputs
      vehicleInputs.forEach(function (i) { i.checked = false; });
      filmInputs.forEach(function (i) { i.checked = false; });

      // Re-apply defaults for shade and coverage
      if (defaultShade) defaultShade.checked = true;
      if (defaultCoverage) defaultCoverage.checked = true;

      // Disable next buttons
      if (toStep2Btn) toStep2Btn.disabled = true;
      if (toStep3Btn) toStep3Btn.disabled = true;

      showStep(1);
    });
  }

})();

// ===== FAQ ACCORDION =====
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      const isOpen = answer.classList.contains('open');

      // Close all
      faqItems.forEach(function (other) {
        const otherAnswer = other.querySelector('.faq-answer');
        const otherQuestion = other.querySelector('.faq-question');
        if (otherAnswer && otherQuestion) {
          otherAnswer.classList.remove('open');
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Open clicked if it was closed
      if (!isOpen) {
        answer.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ===== CONTACT FORM =====
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{8,}$/.test(phone);
  }

  function showFieldError(field) {
    field.classList.add('error');
  }

  function clearFieldError(field) {
    field.classList.remove('error');
  }

  // Live validation
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      clearFieldError(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;
    const name = form.querySelector('#contactName');
    const phone = form.querySelector('#contactPhone');
    const email = form.querySelector('#contactEmail');

    if (name && (!name.value.trim() || name.value.trim().length < 2)) {
      showFieldError(name);
      valid = false;
    }
    if (phone && (!phone.value.trim() || !validatePhone(phone.value))) {
      showFieldError(phone);
      valid = false;
    }
    if (email && (!email.value.trim() || !validateEmail(email.value))) {
      showFieldError(email);
      valid = false;
    }

    if (!valid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate form submission (replace with actual API call)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(function () {
      form.hidden = true;
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1500);
  });
})();

// ===== ACTIVE NAV LINK on scroll =====
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (l) { l.style.color = ''; });
          link.style.color = '#ffffff';
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

// ===== GOOGLE REVIEWS (live from Google Business Profile) =====
// PREFERRED: deploy the Cloudflare Worker in /worker and set `proxyUrl` below.
// The worker keeps your API key private and caches responses at the edge.
// See worker/README.md for one-time setup.
//
// FALLBACK: set apiKey + placeId to call Google Places API directly from the
// browser (exposes the key — only use with strict HTTP referrer restrictions).
//
// If neither is configured, the curated fallback reviews remain visible.
const GOOGLE_REVIEWS_CONFIG = {
  // PREFERRED: static file committed by the scheduled scraper (see
  // scripts/scrape-google-reviews.mjs + .github/workflows/scrape-reviews.yml).
  // Refreshed automatically every day – no credentials required.
  staticUrl: './reviews.json?v=' + Date.now(),
  proxyUrl: '',    // e.g. 'https://elite-reviews-proxy.yoursub.workers.dev'
  apiKey: '',      // e.g. 'AIzaSy...' (only if not using a proxy)
  // Google Places "ChIJ…" ID (required by the writereview deep link)
  placeId: 'ChIJ1xfGFjla1moROjdj6Ls47TQ',
  refreshMs: 15 * 60 * 1000, // re-fetch the static JSON every 15 min
  maxReviews: 6
};

(function initGoogleReviews() {
  const grid = document.getElementById('googleReviewsGrid');
  const scoreEl = document.getElementById('googleRatingScore');
  const countEl = document.getElementById('googleRatingCount');
  const starsEl = document.getElementById('googleStars');
  const writeBtn = document.getElementById('googleWriteReview');
  if (!grid) return;

  // "Write a review" — opens the Google Maps listing via stable CID URL.
  // The listing page has a prominent "Write a review" button; CID is the
  // business's numeric ID (decoded from the Maps hex feature ID).
  if (writeBtn) {
    writeBtn.href = 'https://www.google.com/maps?cid=3813766839161534282';
    writeBtn.target = '_blank';
    writeBtn.rel = 'noopener noreferrer';
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) html += '<i class="fas fa-star"></i>';
      else if (i === full && half) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return html;
  }

  function timeAgo(isoOrSeconds) {
    let t;
    if (typeof isoOrSeconds === 'number') t = isoOrSeconds * 1000;
    else t = new Date(isoOrSeconds).getTime();
    if (!t) return '';
    const diff = Math.max(0, Date.now() - t);
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'today';
    if (days < 7) return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    if (days < 30) { const w = Math.floor(days / 7); return w + ' week' + (w > 1 ? 's' : '') + ' ago'; }
    if (days < 365) { const m = Math.floor(days / 30); return m + ' month' + (m > 1 ? 's' : '') + ' ago'; }
    const y = Math.floor(days / 365); return y + ' year' + (y > 1 ? 's' : '') + ' ago';
  }

  function initials(name) {
    if (!name) return 'G';
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
  }

  function avatarColor(name) {
    const palette = ['#EA4335', '#4285F4', '#FBBC05', '#34A853', '#9334E6', '#E8710A'];
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }

  function googleGSvg() {
    return '<svg class="review-google-g" viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
      '</svg>';
  }

  function renderReviews(reviews) {
    grid.innerHTML = reviews.slice(0, GOOGLE_REVIEWS_CONFIG.maxReviews).map(function (r) {
      const name = r.authorName || r.author_name || 'Google User';
      const photo = r.profilePhotoUrl || r.profile_photo_url || '';
      const when = r.publishTime || r.time || r.relativeTime || '';
      const relative = r.relativeTime || (when ? timeAgo(when) : '');
      const text = (r.text || '').replace(/</g, '&lt;');
      const rating = r.rating || 5;
      const avatar = photo
        ? '<img class="reviewer-avatar-img" src="' + photo + '" alt="' + name + '" loading="lazy" referrerpolicy="no-referrer" />'
        : '<div class="reviewer-avatar" style="background:' + avatarColor(name) + '">' + initials(name) + '</div>';
      return (
        '<div class="review-card google-review-card">' +
          '<div class="review-header">' +
            avatar +
            '<div class="reviewer-info">' +
              '<strong>' + name + '</strong>' +
              '<span class="review-meta">' + (relative || '') + '</span>' +
            '</div>' +
            googleGSvg() +
          '</div>' +
          '<div class="review-stars google-stars">' + renderStars(rating) + '</div>' +
          '<p>' + text + '</p>' +
        '</div>'
      );
    }).join('');
  }

  function renderSummary(rating, count) {
    if (scoreEl) scoreEl.textContent = (Math.round(rating * 10) / 10).toFixed(1);
    if (starsEl) starsEl.innerHTML = renderStars(rating);
    if (countEl) countEl.textContent = 'Based on ' + count + ' Google review' + (count === 1 ? '' : 's');
  }

  async function fetchGoogleReviews() {
    const { staticUrl, proxyUrl, apiKey, placeId } = GOOGLE_REVIEWS_CONFIG;

    // PREFERRED: static reviews.json committed by the scheduled scraper
    if (staticUrl) {
      try {
        const res = await fetch(staticUrl, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const reviews = (data.reviews || []).map(function (r) {
            return {
              authorName: r.name || r.authorName,
              profilePhotoUrl: r.photo || r.profilePhotoUrl,
              rating: r.rating || 5,
              text: r.text || '',
              relativeTime: r.relative || r.relativeTime || ''
            };
          });
          return {
            rating: data.rating || 5.0,
            count: data.userRatingCount || reviews.length,
            reviews: reviews
          };
        }
      } catch (_) { /* fall through to proxy/API */ }
    }

    // Cloudflare Worker proxy (server-side cached, key hidden)
    if (proxyUrl) {
      const res = await fetch(proxyUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('Proxy ' + res.status);
      const data = await res.json();
      return {
        rating: data.rating || 4.9,
        count: data.userRatingCount || (data.reviews || []).length,
        reviews: data.reviews || []
      };
    }

    // FALLBACK: direct browser → Google (API key is exposed)
    if (!apiKey || !placeId) return null;
    const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(placeId);
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.publishTime,reviews.authorAttribution'
      }
    });
    if (!res.ok) throw new Error('Places API ' + res.status);
    const data = await res.json();
    const reviews = (data.reviews || []).map(function (r) {
      return {
        authorName: r.authorAttribution && r.authorAttribution.displayName,
        profilePhotoUrl: r.authorAttribution && r.authorAttribution.photoUri,
        rating: r.rating,
        text: (r.text && r.text.text) || '',
        relativeTime: r.relativePublishTimeDescription,
        publishTime: r.publishTime
      };
    });
    return {
      rating: data.rating || 4.9,
      count: data.userRatingCount || reviews.length,
      reviews: reviews
    };
  }

  async function refresh() {
    try {
      const data = await fetchGoogleReviews();
      if (!data) return; // no config → keep curated fallback cards
      renderSummary(data.rating, data.count);
      if (data.reviews.length) renderReviews(data.reviews);
    } catch (err) {
      // Silent fallback – curated reviews remain visible
      console.warn('[GoogleReviews] fetch failed:', err.message);
    }
  }

  refresh();
  if (GOOGLE_REVIEWS_CONFIG.refreshMs > 0) {
    setInterval(refresh, GOOGLE_REVIEWS_CONFIG.refreshMs);
  }
})();

// ===== PARALLAX EFFECT (layered hero + site-wide) =====
// - Hero uses 4 layers: bg (0.2x) / mid streaks (0.5x) / car subject (0.7x) /
//   foreground content (1x, untransformed). Subject also tilts with the cursor.
// - Other sections keep a light single-axis parallax via data-parallax.
// - Respects prefers-reduced-motion; disables decorative hero layers on mobile.
(function initParallax() {
  const mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  const reduce = mq('(prefers-reduced-motion: reduce)');
  if (reduce) return;
  const mobile = mq('(max-width: 767px)');
  const coarse = mq('(pointer: coarse)');

  // ---- HERO LAYERED PARALLAX ----
  // Skip JS path when the browser natively supports Scroll-driven Animations
  // (CSS @supports block in styles.css handles it in pure CSS → better perf).
  const nativeScrollTimeline = typeof CSS !== 'undefined' &&
    CSS.supports && CSS.supports('animation-timeline: scroll()');

  const hero = document.querySelector('.hero');
  const heroBg = !nativeScrollTimeline && hero && hero.querySelector('[data-hero-layer="bg"]');
  const heroMid = !nativeScrollTimeline && hero && hero.querySelector('[data-hero-layer="mid"]');
  const heroSubject = hero && hero.querySelector('[data-hero-layer="subject"]');

  const heroLayers = [
    heroBg && { el: heroBg, speed: 0.2, isSubject: false },
    !mobile && heroMid && { el: heroMid, speed: 0.5, isSubject: false },
    !mobile && heroSubject && { el: heroSubject, speed: 0.7, isSubject: true }
  ].filter(Boolean);

  let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
  let heroTicking = false;
  function heroUpdate() {
    const scrollY = window.scrollY || window.pageYOffset;
    heroLayers.forEach(function (l) {
      const y = -scrollY * l.speed;
      let extra = '';
      if (l.isSubject) {
        tiltX += (targetTiltX - tiltX) * 0.08;
        tiltY += (targetTiltY - tiltY) * 0.08;
        extra = ' translate3d(' + tiltX.toFixed(2) + 'px,' + tiltY.toFixed(2) + 'px,0)';
      }
      l.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)' + extra;
    });
    heroTicking = false;
    if (Math.abs(tiltX - targetTiltX) > 0.1 || Math.abs(tiltY - targetTiltY) > 0.1) {
      requestAnimationFrame(heroUpdate);
    }
  }
  function heroOnScroll() {
    if (!heroTicking) { heroTicking = true; requestAnimationFrame(heroUpdate); }
  }
  if (heroLayers.length) {
    window.addEventListener('scroll', heroOnScroll, { passive: true });
    window.addEventListener('resize', heroOnScroll);
    heroUpdate();

    if (!mobile && !coarse && heroSubject) {
      hero.addEventListener('mousemove', function (e) {
        const rect = hero.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetTiltX = nx * 14;
        targetTiltY = ny * 10;
        heroOnScroll();
      });
      hero.addEventListener('mouseleave', function () {
        targetTiltX = 0; targetTiltY = 0;
        heroOnScroll();
      });
    }
  }

  // ---- SITE-WIDE LIGHT PARALLAX (non-hero sections) ----
  (function sectionParallax() {
    if (mobile) return; // skip entirely on mobile for performance
    const autoTargets = [
      { sel: '.stats-bar', speed: 0.12 },
      { sel: '.comparison-section', speed: 0.08 },
      { sel: '.instagram-section .insta-grid', speed: 0.08 },
      { sel: '.gallery-grid', speed: 0.06 },
      { sel: '.why-us .features-grid', speed: 0.08 },
      { sel: '.services-grid', speed: 0.06 },
      { sel: '.reviews-section .google-rating-header', speed: 0.1 }
    ];
    autoTargets.forEach(function (t) {
      document.querySelectorAll(t.sel).forEach(function (el) {
        if (!el.hasAttribute('data-parallax')) el.setAttribute('data-parallax', String(t.speed));
      });
    });
    // Skip anything inside the hero (handled above)
    const nodes = Array.from(document.querySelectorAll('[data-parallax]'))
      .filter(function (n) { return !hero || !hero.contains(n); });
    if (!nodes.length) return;

    const targets = nodes.map(function (el) {
      const rect = el.getBoundingClientRect();
      return {
        el: el,
        speed: parseFloat(el.getAttribute('data-parallax')) || 0.1,
        start: rect.top + (window.scrollY || window.pageYOffset),
        height: rect.height
      };
    });
    let ticking = false;
    function update() {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportH = window.innerHeight;
      targets.forEach(function (t) {
        const relative = scrollY - t.start;
        if (relative < -viewportH || relative > t.height + viewportH) return;
        t.el.style.transform = 'translate3d(0,' + (relative * t.speed * -1).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    function remeasure() {
      targets.forEach(function (t) {
        t.el.style.transform = '';
        const rect = t.el.getBoundingClientRect();
        t.start = rect.top + (window.scrollY || window.pageYOffset);
        t.height = rect.height;
      });
      update();
    }
    targets.forEach(function (t) { t.el.style.willChange = 'transform'; });
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    update();
  })();
})();

// ===== GEO-AWARE DYNAMIC HEADLINE =====
(function initGeoHeadline() {
  var SUBURBS = ['Essendon','Tullamarine','Keilor','Moonee Ponds','Airport West','Sunbury','Strathmore','Niddrie','Ascot Vale','Flemington','Brunswick','Coburg','Glenroy','Broadmeadows','Pascoe Vale','Taylors Lakes','Parkville','North Melbourne','Melbourne CBD','Melbourne'];
  var heroLoc = document.getElementById('heroLocation');
  var heroSub = document.getElementById('heroSubtitle');
  if (!heroLoc) return;

  function applyLocation(name) {
    if (!name) return;
    heroLoc.textContent = name;
    document.title = 'Top-Rated Car Window Tinting in ' + name + ' & Melbourne | Elite Car Tinting';
    if (heroSub) {
      heroSub.textContent = 'Premium quality films, expert installation, lifetime warranty \u2014 trusted car window tinting for ' + name + ' and all surrounding Melbourne suburbs.';
    }
  }

  // 1) Manual override via ?loc= or stored choice
  try {
    var params = new URLSearchParams(window.location.search);
    var qs = params.get('loc');
    if (qs) {
      var match = SUBURBS.find(function (s) { return s.toLowerCase() === qs.toLowerCase(); });
      if (match) { applyLocation(match); localStorage.setItem('ect_loc', match); return; }
    }
    var stored = localStorage.getItem('ect_loc');
    if (stored && SUBURBS.indexOf(stored) !== -1) { applyLocation(stored); return; }
  } catch (e) {}

  // 2) Silent IP-based geolocation (no permission prompt, no UX friction)
  //    Uses ipapi.co (free, ~1k requests/day per IP, returns city + region).
  //    Falls back silently on any error so the default H1 (Essendon) stays.
  fetch('https://ipapi.co/json/', { headers: { 'Accept': 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      // Only personalise if visitor is in VIC, Australia (avoid showing Sydney users an Essendon-specific H1)
      if (data.country_code !== 'AU') return;
      var candidates = [data.city, data.region, data.community].filter(Boolean);
      for (var i = 0; i < candidates.length; i++) {
        var c = String(candidates[i]);
        var match = SUBURBS.find(function (s) { return s.toLowerCase() === c.toLowerCase(); });
        if (match) {
          applyLocation(match);
          try { localStorage.setItem('ect_loc', match); } catch (e) {}
          return;
        }
      }
    })
    .catch(function () {});
})();


// ===== Calculator: Service Tabs (Window Tint vs other services) =====
(function () {
  var tabs = document.querySelectorAll('.service-tabs .service-tab');
  if (!tabs.length) return;

  var flows = document.querySelectorAll('.service-flow');
  var quoteBox = document.getElementById('serviceFlowQuote');
  var sumService = document.getElementById('flowSummaryService');
  var sumPackage = document.getElementById('flowSummaryPackage');
  var sumPrice = document.getElementById('flowPriceTotal');

  var SERVICE_LABELS = {
    tinting: 'Window Tinting',
    ceramic: 'Ceramic Coating',
    wrap: 'Vinyl Wrap & Blackouts',
    headlights: 'Headlights / Taillights Tint',
    home: 'Home & Commercial Tinting'
  };

  function formatPrice(n) {
    return '$' + Math.round(n).toLocaleString('en-AU');
  }

  function activateService(service) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-service') === service;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    flows.forEach(function (f) {
      f.classList.toggle('active', f.getAttribute('data-flow') === service);
    });
    if (service === 'tinting') {
      if (quoteBox) quoteBox.classList.remove('active');
    } else {
      if (quoteBox) quoteBox.classList.add('active');
      updateFlowQuote(service);
    }
  }

  function updateFlowQuote(service) {
    var flow = document.querySelector('.service-flow[data-flow="' + service + '"]');
    if (!flow) return;
    var checked = flow.querySelector('input[type="radio"]:checked');
    if (!checked) return;
    var price = parseFloat(checked.getAttribute('data-price') || '0');
    var label = checked.getAttribute('data-label') || '';
    if (sumService) sumService.textContent = SERVICE_LABELS[service] || service;
    if (sumPackage) sumPackage.textContent = label;
    if (sumPrice) {
      if (service === 'home') {
        sumPrice.textContent = formatPrice(price) + ' / m\u00b2';
      } else {
        sumPrice.textContent = 'From ' + formatPrice(price);
      }
    }
  }

  // Wire up tab clicks
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateService(tab.getAttribute('data-service'));
    });
  });

  // Wire up package radio changes
  document.querySelectorAll('.service-flow input[type="radio"]').forEach(function (input) {
    input.addEventListener('change', function () {
      var flow = input.closest('.service-flow');
      if (flow) updateFlowQuote(flow.getAttribute('data-flow'));
    });
  });

  // Read ?service= from hash like "#calculator?service=ceramic" or query string
  function readServiceFromUrl() {
    var hash = window.location.hash || '';
    var qIdx = hash.indexOf('?');
    var src = '';
    if (qIdx !== -1) src = hash.substring(qIdx + 1);
    else if (window.location.search) src = window.location.search.replace(/^\?/, '');
    if (!src) return null;
    var params = src.split('&');
    for (var i = 0; i < params.length; i++) {
      var kv = params[i].split('=');
      if (kv[0] === 'service' && kv[1]) return decodeURIComponent(kv[1]);
    }
    return null;
  }

  function applyFromUrl() {
    var s = readServiceFromUrl();
    if (s && SERVICE_LABELS[s]) {
      activateService(s);
      var calc = document.getElementById('calculator');
      if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Initial state
  applyFromUrl();
  window.addEventListener('hashchange', applyFromUrl);

  // Intercept clicks on homepage service-pickable cards that include ?service= in href
  document.querySelectorAll('a.service-pickable[href*="#calculator"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href') || '';
      var qIdx = href.indexOf('?');
      if (qIdx === -1) return; // plain #calculator -> default tinting flow
      var src = href.substring(qIdx + 1);
      var params = src.split('&');
      for (var i = 0; i < params.length; i++) {
        var kv = params[i].split('=');
        if (kv[0] === 'service' && kv[1] && SERVICE_LABELS[kv[1]]) {
          e.preventDefault();
          activateService(kv[1]);
          var calc = document.getElementById('calculator');
          if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // update hash without re-firing scroll
          history.replaceState(null, '', '#calculator?service=' + kv[1]);
          return;
        }
      }
    });
  });
})();
