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

    if (!name.value.trim() || name.value.trim().length < 2) {
      showFieldError(name);
      valid = false;
    }
    if (!phone.value.trim() || !validatePhone(phone.value)) {
      showFieldError(phone);
      valid = false;
    }
    if (!email.value.trim() || !validateEmail(email.value)) {
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
