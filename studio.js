'use strict';
// Animate glass independently of the photoreal car. Values are illustrative only.
const shadePresets = {
  70: ['Clear', 'A nearly clear appearance that keeps the cabin bright.'],
  50: ['Light', 'A lighter finish for a subtle change in appearance.'],
  35: ['Balanced', 'A balanced, understated finish with a darker look.'],
  20: ['Dark', 'A deeper shade for a more pronounced visual contrast.'],
  5: ['Deep', 'The darkest visual option in this preview.']
};
const range = document.getElementById('tintRange');
const playButton = document.querySelector('[data-preview-play]');
const heroPreview = document.querySelector('.hero-configurator');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let previewTimer;
let playing = false;
let heroVisible = true;
let currentShade = 35;
let previewStep = 1;
const previewSequence = [70, 35, 20, 5, 50];

function updateShade(rawValue) {
  const value = Math.max(5, Math.min(70, Number(rawValue)));
  currentShade = value;
  const nearest = Object.keys(shadePresets).reduce((a, b) => Math.abs(Number(a) - value) < Math.abs(Number(b) - value) ? a : b);
  const preset = shadePresets[nearest];
  document.querySelectorAll('.glass-tint').forEach(glass => glass.setAttribute('opacity', String(.93 * (1 - value / 80))));
  document.querySelectorAll('[data-shade]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.shade) === value)));
  document.querySelectorAll('[data-shade-readout]').forEach(label => { label.textContent = value + '% VLT'; });
  document.querySelectorAll('[data-shade-name]').forEach(label => { label.textContent = preset[0]; });
  const description = document.getElementById('shadeDescription');
  if (description) description.textContent = preset[1];
  const output = document.getElementById('shadeValue');
  if (output) output.innerHTML = value + '<span>%</span>';
  if (range) {
    range.value = value;
    range.setAttribute('aria-valuetext', value + ' percent visible light transmission');
    const progress = (value - 5) / 65 * 100;
    range.style.background = 'linear-gradient(90deg, #8573ca ' + progress + '%, #d2d9eb ' + progress + '%)';
  }
}

function togglePlayback(enable) {
  clearInterval(previewTimer);
  playing = enable;
  document.body.classList.toggle('preview-paused', !enable);
  const description = document.getElementById('shadeDescription');
  if (description) description.setAttribute('aria-live', enable ? 'off' : 'polite');
  if (playButton) {
    playButton.setAttribute('aria-pressed', String(enable));
    playButton.querySelector('[data-play-icon]').textContent = enable ? 'Ⅱ' : '▷';
    playButton.querySelector('[data-play-label]').textContent = enable ? 'Pause preview' : 'Play preview';
  }
  if (enable) {
    previewTimer = setInterval(() => {
      if (!heroVisible || document.hidden) return;
      previewStep = (previewStep + 1) % previewSequence.length;
      updateShade(previewSequence[previewStep]);
    }, 3800);
  }
}

document.querySelectorAll('[data-shade]').forEach(button => {
  button.addEventListener('click', () => { togglePlayback(false); updateShade(button.dataset.shade); });
});
if (range) range.addEventListener('input', () => { togglePlayback(false); updateShade(range.value); });
if (playButton) playButton.addEventListener('click', () => togglePlayback(!playing));
if (heroPreview) {
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; }, {threshold: .15}).observe(heroPreview);
  updateShade(currentShade);
  togglePlayback(!reduceMotion.matches);
  reduceMotion.addEventListener('change', event => { if (event.matches) togglePlayback(false); });
}
const menuButton = document.getElementById('hamburger');
if (menuButton) menuButton.setAttribute('aria-controls', 'navLinks');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.click(); menuButton.focus();
  }
});
const filmTabs = Array.from(document.querySelectorAll('.film-tab'));
function selectFilmTab(selectedTab) {
  const selectedPanel = document.getElementById('tab-' + selectedTab.dataset.tab);
  if (!selectedPanel) return;
  filmTabs.forEach(tab => {
    const selected = tab === selectedTab;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById('tab-' + tab.dataset.tab);
    if (panel) {
      panel.classList.toggle('active', selected);
      panel.hidden = !selected;
    }
  });
}
filmTabs.forEach((tab, index) => {
  const panel = document.getElementById('tab-' + tab.dataset.tab);
  tab.id = 'film-tab-' + tab.dataset.tab;
  tab.setAttribute('aria-controls', 'tab-' + tab.dataset.tab);
  if (panel) panel.setAttribute('aria-labelledby', tab.id);
  tab.addEventListener('click', () => selectFilmTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % filmTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + filmTabs.length) % filmTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = filmTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); filmTabs[next].click(); filmTabs[next].focus(); }
  });
});
if (filmTabs.length) selectFilmTab(filmTabs.find(tab => tab.getAttribute('aria-selected') === 'true') || filmTabs[0]);
document.querySelectorAll('.faq-item').forEach((item, index) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (question && answer) { answer.id = 'faq-answer-' + index; question.setAttribute('aria-controls', answer.id); }
});
