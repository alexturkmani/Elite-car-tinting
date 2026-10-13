'use strict';
// 3M film shade preview with a before/after slider.
// Light reaching the cabin passes through the film, reflects off the interior and passes back out,
// so what you see through tinted glass scales with VLT squared (in linear light), plus a small
// surface reflection. 3M's VLT figures are for film on 73% VLT automotive glass, so the render's
// untinted glass is treated as that glass and each shade is applied relative to it.
(function () {
  const GLASS_VLT = 73;
  const SURFACE_REFLECTANCE = 0.045;
  const TINT_HUE = [0.96, 0.985, 1.02];

  const toLin = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const c = i / 255; toLin[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  const toSrgb = v => { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); };
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadImage(src) {
    return new Promise((resolve, reject) => { const img = new Image(); img.decoding = 'async'; img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
  }

  async function init(root) {
    const stage = root.querySelector('.car-frame') || root.querySelector('.selector-stage');
    const canvas = root.querySelector('.car-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const [car, mask] = await Promise.all([loadImage(root.dataset.car), loadImage(root.dataset.mask)]);
    const CROP_Y = 180, W = 1536, H = 650;
    canvas.width = W; canvas.height = H;
    ctx.drawImage(car, 0, -CROP_Y);
    const base = ctx.getImageData(0, 0, W, H);

    // "Before" layer: the same car with untinted glass, clipped to the left of the handle.
    const layer = document.createElement('div');
    layer.className = 'compare-layer';
    const before = document.createElement('canvas');
    before.width = W; before.height = H;
    before.getContext('2d').putImageData(base, 0, 0);
    before.setAttribute('aria-hidden', 'true');
    layer.appendChild(before);
    stage.appendChild(layer);
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'compare-handle';
    handle.setAttribute('aria-label', 'Drag to compare untinted glass with the selected film');
    handle.innerHTML = '<span aria-hidden="true">&#8596;</span>';
    stage.appendChild(handle);
    const tags = document.createElement('div');
    tags.className = 'compare-tags';
    tags.setAttribute('aria-hidden', 'true');
    tags.innerHTML = '<span>No film</span><span data-after-tag></span>';
    stage.appendChild(tags);
    const afterTag = tags.querySelector('[data-after-tag]');

    const m = document.createElement('canvas'); m.width = W; m.height = H;
    const mctx = m.getContext('2d', { willReadFrequently: true });
    mctx.drawImage(mask, 0, -CROP_Y);
    const maskData = mctx.getImageData(0, 0, W, H).data;

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
      const x = (p % W - minX) / (maxX - minX), y = ((p / W | 0) - minY) / (maxY - minY);
      const band = Math.exp(-Math.pow((x * 0.9 + y * 0.55 - 0.42) / 0.09, 2)) * 0.9;
      env[k] = 0.55 + (1 - y) * 0.45 + band;
    }
    const out = ctx.createImageData(W, H);
    out.data.set(base.data);

    let shown = null, raf = 0;
    function render(vlt) {
      const t = Math.min(1, vlt / GLASS_VLT), t2 = t * t;
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
      const start = performance.now(), dur = reduce() ? 0 : 520;
      const step = now => {
        const k = dur ? Math.min(1, (now - start) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
        shown = from + (target - from) * e;
        render(shown);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    // Before / after handle
    let split = 38;
    const setSplit = v => { split = Math.max(0, Math.min(100, v)); root.style.setProperty('--split', split + '%'); handle.setAttribute('aria-valuenow', Math.round(split)); };
    handle.setAttribute('role', 'slider'); handle.setAttribute('aria-valuemin', '0'); handle.setAttribute('aria-valuemax', '100');
    const fromPointer = e => { const r = layer.getBoundingClientRect(); setSplit((e.clientX - r.left) / r.width * 100); };
    let dragging = false;
    const startDrag = e => { dragging = true; stage.setPointerCapture(e.pointerId); fromPointer(e); };
    stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button !== 0) return; startDrag(e); });
    stage.addEventListener('pointermove', e => { if (dragging) fromPointer(e); });
    ['pointerup', 'pointercancel'].forEach(t => stage.addEventListener(t, () => { dragging = false; }));
    handle.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setSplit(split - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setSplit(split + 5); }
    });
    stage.style.touchAction = 'pan-y';

    // Intro sweep: reveal the film once, then settle in the middle.
    setSplit(reduce() ? 38 : 92);
    if (!reduce()) {
      const t0 = performance.now();
      const sweep = now => {
        if (dragging) return;
        const k = Math.min(1, (now - t0) / 1800);
        const e = k < .6 ? (k / .6) : 1;
        const v = k < .6 ? 92 - 72 * (1 - Math.pow(1 - e, 3)) : 20 + 18 * (1 - Math.pow(1 - (k - .6) / .4, 3));
        setSplit(v);
        if (k < 1) requestAnimationFrame(sweep);
      };
      setTimeout(() => requestAnimationFrame(sweep), 350);
    }

    // Series and shades
    const tabs = [...root.querySelectorAll('[data-series]')];
    const groups = [...root.querySelectorAll('[data-series-group]')];
    const blurb = root.querySelector('[data-series-blurb]');
    const blurbs = JSON.parse(root.dataset.blurbs || '{}');
    const readout = root.querySelector('[data-readout]');
    const readoutCode = root.querySelector('[data-readout-code]');
    const specs = {};
    root.querySelectorAll('[data-spec]').forEach(n => { specs[n.dataset.spec] = n; });

    root.querySelectorAll('.film-btn').forEach(b => {
      const v = JSON.parse(b.dataset.shade).vlt, t = Math.min(1, v / GLASS_VLT);
      const g = Math.round(toSrgb(0.45 * t * t + SURFACE_REFLECTANCE * 0.8 * (1 - t * t)));
      const sw = b.querySelector('.swatch'); if (sw) sw.style.background = `rgb(${g},${g},${Math.min(255, g + 4)})`;
    });

    function selectShade(btn) {
      const s = JSON.parse(btn.dataset.shade);
      root.querySelectorAll('.film-btn').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      if (readout) readout.textContent = s.vlt + '%';
      if (readoutCode) readoutCode.textContent = s.code;
      afterTag.textContent = s.code;
      for (const key of ['vlt', 'tser', 'irr', 'uv', 'glare']) {
        const el = specs[key]; if (!el) continue;
        el.textContent = s[key] + '%';
        const bar = el.parentElement.querySelector('.spec-bar i');
        if (bar) bar.style.width = s[key] + '%';
      }
      animateTo(s.vlt);
    }
    function selectSeries(tab) {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      groups.forEach(g => { g.hidden = g.dataset.seriesGroup !== tab.dataset.series; });
      if (blurb && blurbs[tab.dataset.series]) blurb.textContent = blurbs[tab.dataset.series];
      const group = groups.find(g => g.dataset.seriesGroup === tab.dataset.series);
      const btns = [...group.querySelectorAll('.film-btn')];
      // Keep a similar darkness when switching ranges.
      const current = shown == null ? 37 : shown;
      const pick = btns.reduce((a, b) => Math.abs(JSON.parse(b.dataset.shade).vlt - current) < Math.abs(JSON.parse(a.dataset.shade).vlt - current) ? b : a);
      selectShade(pick);
    }
    tabs.forEach(t => t.addEventListener('click', () => selectSeries(t)));
    root.querySelectorAll('.film-btn').forEach(b => b.addEventListener('click', () => selectShade(b)));
    groups.forEach(g => g.addEventListener('keydown', e => {
      const btns = [...g.querySelectorAll('.film-btn')], i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % btns.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + btns.length) % btns.length;
      if (n !== null) { e.preventDefault(); btns[n].focus(); btns[n].click(); }
    }));

    selectShade(root.querySelector('.film-btn[aria-pressed="true"]') || root.querySelector('.film-btn'));
    root.classList.add('ready');
  }

  document.querySelectorAll('[data-tint-preview]').forEach(root => {
    const go = () => init(root).catch(() => root.classList.add('failed'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '0px 0px -20% 0px' });
      io.observe(root);
    } else go();
  });
})();
