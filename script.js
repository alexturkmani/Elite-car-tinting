/* ========================================
   TINTING BUSINESS - Interactive JS
   ======================================== */

'use strict';

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

// ===== QUOTE FORM =====
(function initQuoteForm() {
  var quoteForm = document.getElementById('quoteRequestForm');
  var quoteSuccess = document.getElementById('quoteSuccess');
  if (!quoteForm) return;

  var demoReset = document.querySelector('[data-demo-reset]');
  if (demoReset) demoReset.addEventListener('click', function () {
    quoteForm.reset();
    quoteForm.hidden = false;
    quoteSuccess.hidden = true;
    var submitButton = document.getElementById('qSubmitBtn');
    submitButton.disabled = false;
    submitButton.textContent = 'Send Quote Request';
    document.getElementById('qName').focus();
  });
  // Prefill service dropdown when arriving from a service card
  document.querySelectorAll('a.service-pickable[data-service]').forEach(function (card) {
    card.addEventListener('click', function () {
      var serviceEl = document.getElementById('qService');
      if (serviceEl) serviceEl.value = card.getAttribute('data-service');
    });
  });

  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('qName');
    var phoneEl = document.getElementById('qPhone');
    var serviceEl = document.getElementById('qService');
    var carEl = document.getElementById('qCar');
    var messageEl = document.getElementById('qMessage');
    var sb = document.getElementById('qSubmitBtn');

    var name = (nameEl && nameEl.value || '').trim();
    var phone = (phoneEl && phoneEl.value || '').trim();
    var validPhone = /^[\d\s\+\-\(\)]{8,}$/.test(phone);

    var valid = true;
    if (name.length < 2) {
      nameEl.classList.add('error');
      if (valid) { nameEl.focus(); valid = false; }
    } else {
      nameEl.classList.remove('error');
    }
    if (!validPhone) {
      phoneEl.classList.add('error');
      if (valid) { phoneEl.focus(); valid = false; }
    } else {
      phoneEl.classList.remove('error');
    }
    if (serviceEl && !serviceEl.value) {
      serviceEl.classList.add('error');
      serviceEl.setAttribute('aria-invalid', 'true');
      if (valid) { serviceEl.focus(); valid = false; }
    } else if (serviceEl) {
      serviceEl.classList.remove('error');
      serviceEl.removeAttribute('aria-invalid');
    }
    if (!valid) return;

    var payload = {
      name: name,
      phone: phone,
      service: serviceEl ? serviceEl.value : '',
      car: carEl ? carEl.value.trim() : '',
      message: messageEl ? messageEl.value.trim() : '',
      botcheck: ''
    };

    if (sb) {
      sb.disabled = true;
      sb.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending\u2026';
    }

    function onFail() {
      if (sb) {
        sb.disabled = false;
        sb.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Send Failed - Try Calling';
      }
    }
    function onOk() {
      quoteForm.hidden = true;
      if (quoteSuccess) {
        quoteSuccess.hidden = false;
        quoteSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    submitForm(
      { _subject: 'New Quote Request - Tinting Business', name: payload.name, phone: payload.phone, service: payload.service, car: payload.car, message: payload.message },
      onOk,
      onFail
    );
  });
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

    // Send via Web3Forms
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending\u2026';

    const nameEl  = form.querySelector('#contactName');
    const phoneEl = form.querySelector('#contactPhone');
    const emailEl = form.querySelector('#contactEmail');
    const msgEl   = form.querySelector('#contactMessage');
    const payload = {
      subject:     'New Contact Enquiry - Tinting Business',
      name:        nameEl  ? nameEl.value.trim()  : '',
      phone:       phoneEl ? phoneEl.value.trim() : '',
      email:       emailEl ? emailEl.value.trim() : '',
      message:     msgEl   ? msgEl.value.trim()   : '',
      botcheck:    ''
    };

    function onOk() {
      form.hidden = true;
      if (formSuccess) {
        formSuccess.hidden = false;
        requestAnimationFrame(function () {
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }
    function onFail() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Send Failed - Try Calling';
    }

    submitForm(
      { _subject: payload.subject, name: payload.name, phone: payload.phone, email: payload.email, message: payload.message },
      onOk,
      onFail
    );
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

// ===== FORMSUBMIT .  form submission service =====
// FormSubmit is a free, no-signup service that emails submissions to your address.
// First submission triggers an activation email .  click the link once to confirm.
// No API key needed.
var FORMSUBMIT_EMAIL = ''; // Configure the buyer's enquiry email before launching.

// ===== CLOUDFLARE WORKER URL =====
// Deploy the worker in /worker and set this to its deployed URL.
// Used for the Google Reviews proxy.
var WORKER_BASE_URL = ''; // ← fill in after `wrangler deploy`

// Shared form-submission helper.
// payload → fields sent to FormSubmit (name, phone, email, message, _subject, etc.)
function submitForm(payload, onOk, onFail) {
  if (!FORMSUBMIT_EMAIL) { onOk(); return; }
  var submitUrl = 'https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL;
  var submitBody = JSON.stringify(Object.assign({ _captcha: 'false', _template: 'table' }, payload));

  var ctrl = ('AbortController' in window) ? new AbortController() : null;
  var timeoutId = setTimeout(function () {
    if (ctrl) ctrl.abort();
    onFail();
  }, 12000);

  fetch(submitUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: submitBody,
    signal: ctrl ? ctrl.signal : undefined
  }).then(function (res) {
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json().catch(function () { return { success: 'false' }; });
  }).then(function (data) {
    if (!data || data.success !== 'true') throw new Error((data && data.message) || 'Form rejected');
    onOk();
  }).catch(function () {
    clearTimeout(timeoutId);
    onFail();
  });
}
// ===== PARALLAX EFFECT (layered hero + site-wide) =====
// - Hero uses 4 layers: bg (0.2x) / mid streaks (0.5x) / car subject (0.7x) /
//   foreground content (1x, untransformed). Subject also tilts with the cursor.
// - Other sections keep a light single-axis parallax via data-parallax.
// - Respects prefers-reduced-motion; disables decorative hero layers on mobile.
(function initParallax() {
  if (document.body.classList.contains('studio-home')) return;
  const mq = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  const reduce = mq('(prefers-reduced-motion: reduce)');
  if (reduce) return;
  const mobile = mq('(max-width: 767px)');
  const coarse = mq('(pointer: coarse)');

  // ---- HERO LAYERED PARALLAX ----
  // Skip JS path when the browser natively supports Scroll-driven Animations
  // (CSS @supports block in styles.css handles it in pure CSS â†’ better perf).
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
