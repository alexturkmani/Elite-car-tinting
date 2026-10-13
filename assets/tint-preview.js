'use strict';
// Physically based tint preview.
// Light reaching the cabin passes through the film, reflects off the interior and passes back out,
// so what you see through tinted glass scales with VLT squared (in linear light), plus a small
// surface reflection from the outside of the glass. The render's untinted glass is treated as
// typical factory glass (~88% VLT), so each film value is applied relative to that.
(function () {
  const FILMS = {
    5:  { name: 'Limo black', look: 'Near-total privacy. The cabin reads as solid black from outside; night visibility is reduced.', front: false, rear: false },
    15: { name: 'Very dark', look: 'Strong privacy with only faint silhouettes visible. Popular on vans and goods vehicles.', front: false, rear: false },
    20: { name: 'Dark', look: 'The darkest legal option for rear windows on NSW passenger cars. Seats and headrests become shadows.', front: false, rear: true },
    35: { name: 'Medium', look: 'The darkest legal option for front side windows in NSW. A clear, even tint that still shows the cabin.', front: true, rear: true },
    50: { name: 'Light', look: 'A subtle shade that cuts glare while keeping the interior clearly visible.', front: true, rear: true },
    70: { name: 'Clear ceramic', look: 'Looks close to factory glass. Choose a ceramic film here for heat and UV rejection without the dark look.', front: true, rear: true }
  };
  const FACTORY_VLT = 0.88;
  const SURFACE_REFLECTANCE = 0.045;
  const TINT_HUE = [0.96, 0.985, 1.02]; // neutral charcoal with a slight cool cast

  const toLin = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const c = i / 255; toLin[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  const toSrgb = v => { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); };

  function loadImage(src) {
    return new Promise((resolve, reject) => { const img = new Image(); img.decoding = 'async'; img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
  }

  async function init(root) {
    const canvas = root.querySelector('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const [car, mask] = await Promise.all([loadImage(root.dataset.car), loadImage(root.dataset.mask)]);
    // Crop the 1536x1024 render to the band that contains the car.
    const CROP_Y = 180, W = 1536, H = 650;
    canvas.width = W; canvas.height = H;
    ctx.drawImage(car, 0, -CROP_Y);
    const base = ctx.getImageData(0, 0, W, H);
    const m = document.createElement('canvas'); m.width = W; m.height = H;
    const mctx = m.getContext('2d', { willReadFrequently: true });
    mctx.drawImage(mask, 0, -CROP_Y);
    const maskData = mctx.getImageData(0, 0, W, H).data;

    // Collect glass pixels once.
    let minX = W, minY = H, maxX = 0, maxY = 0;
    const idx = [];
    for (let i = 0, p = 0; p < W * H; p++, i += 4) {
      if (maskData[i] > 2) {
        idx.push(p);
        const x = p % W, y = (p / W) | 0;
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    const glass = new Uint32Array(idx);
    const weight = new Float32Array(glass.length);
    const lin = new Float32Array(glass.length * 3);
    const env = new Float32Array(glass.length);
    for (let k = 0; k < glass.length; k++) {
      const p = glass[k], i = p * 4;
      weight[k] = maskData[i] / 255;
      lin[k * 3] = toLin[base.data[i]]; lin[k * 3 + 1] = toLin[base.data[i + 1]]; lin[k * 3 + 2] = toLin[base.data[i + 2]];
      // Studio environment reflected in the glass: brighter near the top edge, with a soft diagonal highlight.
      const x = (p % W - minX) / (maxX - minX), y = ((p / W | 0) - minY) / (maxY - minY);
      const band = Math.exp(-Math.pow((x * 0.9 + y * 0.55 - 0.42) / 0.09, 2)) * 0.9;
      env[k] = 0.55 + (1 - y) * 0.45 + band;
    }
    const out = ctx.createImageData(W, H);
    out.data.set(base.data);

    let shown = null, raf = 0;
    function render(vlt) {
      const t = Math.min(1, vlt / 100 / FACTORY_VLT), t2 = t * t;
      const d = out.data;
      for (let k = 0; k < glass.length; k++) {
        const i = glass[k] * 4, w = weight[k], r = SURFACE_REFLECTANCE * env[k];
        for (let c = 0; c < 3; c++) {
          const orig = lin[k * 3 + c];
          const tinted = orig * t2 * (t < 1 ? TINT_HUE[c] : 1) + r * (1 - t2);
          d[i + c] = toSrgb(orig + (tinted - orig) * w);
        }
      }
      ctx.putImageData(out, 0, 0, minX, minY, maxX - minX + 1, maxY - minY + 1);
    }
    function animateTo(target) {
      cancelAnimationFrame(raf);
      const from = shown == null ? target : shown;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const start = performance.now(), dur = reduce ? 0 : 520;
      const step = now => {
        const k = dur ? Math.min(1, (now - start) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
        shown = from + (target - from) * e;
        render(shown);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    const buttons = [...root.querySelectorAll('[data-vlt]')];
    const readout = root.querySelector('[data-readout]');
    const nameEl = root.querySelector('[data-film-name]');
    const lookEl = root.querySelector('[data-film-look]');
    const frontEl = root.querySelector('[data-legal-front]');
    const rearEl = root.querySelector('[data-legal-rear]');
    const legal = (el, ok) => { if (!el) return; el.className = 'legal ' + (ok ? 'yes' : 'no'); el.textContent = ok ? 'Legal' : 'Not legal'; };

    // Swatches show the colour each film gives the interior at mid-grey.
    buttons.forEach(b => {
      const v = Number(b.dataset.vlt), t = Math.min(1, v / 100 / FACTORY_VLT);
      const g = Math.round(toSrgb(0.45 * t * t + SURFACE_REFLECTANCE * 0.8 * (1 - t * t)));
      const sw = b.querySelector('.swatch'); if (sw) sw.style.background = `rgb(${g},${g},${Math.min(255, g + 4)})`;
    });

    function select(v) {
      const f = FILMS[v];
      buttons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.vlt) === v)));
      if (readout) readout.textContent = v + '%';
      if (nameEl) nameEl.textContent = v + '% VLT · ' + f.name;
      if (lookEl) lookEl.textContent = f.look;
      legal(frontEl, f.front); legal(rearEl, f.rear);
      animateTo(v);
    }
    buttons.forEach(b => b.addEventListener('click', () => select(Number(b.dataset.vlt))));
    root.addEventListener('keydown', e => {
      const i = buttons.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % buttons.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + buttons.length) % buttons.length;
      if (n !== null) { e.preventDefault(); buttons[n].focus(); buttons[n].click(); }
    });
    select(Number((buttons.find(b => b.getAttribute('aria-pressed') === 'true') || buttons[0]).dataset.vlt));
    root.classList.add('ready');
  }

  document.querySelectorAll('[data-tint-preview]').forEach(root => {
    const go = () => init(root).catch(() => root.classList.add('failed'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '400px' });
      io.observe(root);
    } else go();
  });
})();
