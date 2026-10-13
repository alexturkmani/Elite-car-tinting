'use strict';
// Demo Tint — shared behaviour: header, menu, quote modal, forms, reveals and counters.
document.documentElement.classList.add('js');

// Set an email here (and activate it once with FormSubmit) to receive enquiries.
// While empty, forms show the success state without sending anything.
const FORMSUBMIT_EMAIL = '';

const header = document.querySelector('.site-header');
const actionBar = document.querySelector('.action-bar');
function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 40);
  if (actionBar) actionBar.classList.toggle('show', y > window.innerHeight * 0.6);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Opening hours: Mon–Fri 8–5, Sat 8–12 (Sydney time).
(function openStatus() {
  const el = document.querySelectorAll('[data-open-status]');
  if (!el.length) return;
  let day, hour;
  try {
    const parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    day = parts.find(p => p.type === 'weekday').value;
    hour = Number(parts.find(p => p.type === 'hour').value) + Number(parts.find(p => p.type === 'minute').value) / 60;
  } catch (e) { return; }
  const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
  const open = (weekday && hour >= 8 && hour < 17) || (day === 'Sat' && hour >= 8 && hour < 12);
  el.forEach(node => {
    node.innerHTML = open ? '<span class="open-dot"></span>Open now' : 'Closed · Request a quote';
  });
})();

// Overlay helpers (menu + quote modal)
let lastFocus = null;
function trap(panel, event) {
  if (event.key !== 'Tab') return;
  const items = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea')].filter(n => n.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
function openPanel(panel, focusSel) {
  lastFocus = document.activeElement;
  panel.classList.add('open');
  panel.removeAttribute('inert');
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  const target = panel.querySelector(focusSel) || panel.querySelector('button, a');
  setTimeout(() => target && target.focus(), 60);
}
function closePanel(panel) {
  panel.classList.remove('open');
  panel.setAttribute('inert', '');
  panel.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.menu-panel.open, .modal.open')) document.body.classList.remove('no-scroll');
  if (lastFocus) lastFocus.focus();
}

const menu = document.getElementById('menu');
const menuBtn = document.querySelector('[data-menu-open]');
if (menu && menuBtn) {
  menuBtn.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'true'); openPanel(menu, '.menu-nav a'); });
  menu.querySelectorAll('[data-menu-close], .menu-nav a').forEach(n => n.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'false'); closePanel(menu); }));
  menu.addEventListener('keydown', e => trap(menu, e));
}

const modal = document.getElementById('quote');
if (modal) {
  document.querySelectorAll('[data-quote]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      if (menu && menu.classList.contains('open')) closePanel(menu);
      const service = trigger.getAttribute('data-quote');
      const select = modal.querySelector('select[name="service"]');
      if (service && select) select.value = service;
      const form = modal.querySelector('form');
      if (form) form.classList.remove('sent');
      openPanel(modal, 'input, select');
    });
  });
  modal.querySelectorAll('[data-modal-close]').forEach(n => n.addEventListener('click', () => closePanel(modal)));
  modal.addEventListener('click', e => { if (e.target === modal) closePanel(modal); });
  modal.addEventListener('keydown', e => trap(modal, e));
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modal && modal.classList.contains('open')) closePanel(modal);
  else if (menu && menu.classList.contains('open')) { menuBtn && menuBtn.setAttribute('aria-expanded', 'false'); closePanel(menu); }
});

// Preselect service on the quote page from ?service=
(function preselect() {
  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  if (!service) return;
  document.querySelectorAll('main select[name="service"]').forEach(s => {
    if ([...s.options].some(o => o.value === service)) s.value = service;
  });
})();

// Forms
document.querySelectorAll('form[data-enquiry]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type="submit"]');
    const done = () => {
      form.classList.add('sent');
      form.reset();
      if (button) { button.disabled = false; button.textContent = button.dataset.label; }
      const ok = form.querySelector('.form-success');
      if (ok) { ok.setAttribute('tabindex', '-1'); ok.focus(); }
    };
    if (button) { button.dataset.label = button.textContent; button.disabled = true; button.textContent = 'Sending…'; }
    if (!FORMSUBMIT_EMAIL) { setTimeout(done, 500); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    data._subject = 'New website enquiry';
    fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    }).then(r => { if (!r.ok) throw new Error(); done(); }).catch(() => {
      if (button) { button.disabled = false; button.textContent = button.dataset.label; }
      alert('Sorry, your enquiry could not be sent. Please call us instead.');
    });
  });
});

// Reveal on scroll. Content is visible without JS and if the observer is unavailable.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach(n => io.observe(n));
} else reveals.forEach(n => n.classList.add('in'));

// Counters: the final value is in the HTML; animate up to it only once visible.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters = document.querySelectorAll('[data-count]');
if (!reduce && 'IntersectionObserver' in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      co.unobserve(entry.target);
      const el = entry.target, end = Number(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      const start = performance.now(), dur = 1600;
      const tick = now => {
        const t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (end * eased).toFixed(dec);
        if (t < 1) requestAnimationFrame(tick); else el.textContent = el.dataset.count;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(n => co.observe(n));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

// Hero: a soft light follows the pointer, like sun moving across tinted glass.
const hero = document.querySelector('.hero');
const heroLight = document.querySelector('.hero-light');
if (hero && heroLight && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  let frame = 0;
  hero.addEventListener('pointermove', e => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      heroLight.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100) + '%');
      heroLight.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
}
