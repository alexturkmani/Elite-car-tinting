'use strict';
// Shade preview is illustrative, not a specification or a road-use recommendation.
const shades = {50: ['LIGHT', 'A lighter finish for a subtle change in appearance.'],35: ['BALANCED', 'A balanced, understated finish with a darker look.'],20: ['DARK', 'A deeper shade for a more pronounced visual contrast.'],5: ['DEEP', 'The darkest visual option in this illustration.']};
document.querySelectorAll('[data-shade]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.shade;
    document.querySelectorAll('[data-shade]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    document.getElementById('tintWindows').setAttribute('opacity', String(1 - Number(value) / 100));
    document.getElementById('shadeReadout').textContent = value + '% / ' + shades[value][0];
    document.getElementById('shadeDescription').textContent = shades[value][1];
  });
});
const menuButton = document.getElementById('hamburger');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.click(); menuButton.focus();
  }
});
const filmTabs = Array.from(document.querySelectorAll('.film-tab'));
filmTabs.forEach((tab, index) => {
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % filmTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + filmTabs.length) % filmTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = filmTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); filmTabs[next].click(); filmTabs[next].focus(); }
  });
});
document.querySelectorAll('.faq-item').forEach((item, index) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (question && answer) { answer.id = 'faq-answer-' + index; question.setAttribute('aria-controls', answer.id); }
});
