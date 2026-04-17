#!/usr/bin/env node
// Scrapes the public Google Maps page for Elite Car Tinting and writes the
// results to reviews.json. Runs headlessly with Playwright – no API key needed.
//
// Local usage:
//   npm i -D playwright
//   npx playwright install chromium
//   node scripts/scrape-google-reviews.mjs

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPS_URL =
  'https://www.google.com/maps/place/Elite+Car+Tinting/@-37.7419,144.9206,17z/' +
  'data=!4m8!3m7!1s0x6ad65a3916c617d7:0x34ed38bbe863374a!8m2!3d-37.7419!4d144.9232!9m1!1b1';

const SCROLL_ROUNDS = 25;
const MAX_REVIEWS = 120;

function normalise(raw) {
  const seen = new Set();
  const out = [];
  for (const r of raw) {
    const key = (r.name || '') + '|' + (r.text || '').slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: r.name || 'Google User',
      relative: r.relative || '',
      rating: Number(r.rating) || 5,
      text: (r.text || '').trim(),
      photo: r.photo || ''
    });
  }
  return out;
}

async function acceptConsent(page) {
  const selectors = [
    'button[aria-label*="Accept all"]',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'form[action*="consent"] button'
  ];
  for (const sel of selectors) {
    const btn = page.locator(sel).first();
    if (await btn.count()) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(800);
      break;
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: 'en-AU',
    viewport: { width: 1280, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36'
  });
  const page = await ctx.newPage();

  await page.goto(MAPS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await acceptConsent(page);

  // Click the Reviews tab if visible
  const reviewsTab = page
    .locator('button[role="tab"][aria-label*="Reviews"], button:has-text("Reviews")')
    .first();
  if (await reviewsTab.count()) {
    await reviewsTab.click().catch(() => {});
  }

  // Wait for the first review card
  await page.waitForSelector('div[data-review-id]', { timeout: 30000 });

  // Find the scrollable review pane and scroll it
  const scrollHandle = await page.evaluateHandle(() => {
    const card = document.querySelector('div[data-review-id]');
    let el = card;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      if (/auto|scroll/.test(style.overflowY) && el.scrollHeight > el.clientHeight) return el;
      el = el.parentElement;
    }
    return document.scrollingElement;
  });

  for (let i = 0; i < SCROLL_ROUNDS; i++) {
    await page.evaluate((node) => { node.scrollBy(0, 4000); }, scrollHandle);
    await page.waitForTimeout(900);
    const count = await page.locator('div[data-review-id]').count();
    if (count >= MAX_REVIEWS) break;
  }

  // Expand "More" buttons so we capture full review text
  await page.evaluate(() => {
    document.querySelectorAll('button.w8nwRe, button[aria-label="See more"], button:has-text("More")').forEach((b) => {
      try { b.click(); } catch (_) {}
    });
  });
  await page.waitForTimeout(500);

  const scraped = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[data-review-id]'));
    return cards.map((c) => {
      const name = (c.querySelector('.d4r55, .TSUbDb')?.textContent || '').trim();
      const relative = (c.querySelector('.rsqaWe, .dehysf')?.textContent || '').trim();
      const textEl = c.querySelector('.wiI7pd, .MyEned, span[jsname]');
      const text = (textEl?.textContent || '').trim();
      const starEl = c.querySelector('span[aria-label*="star"]');
      const label = starEl?.getAttribute('aria-label') || '';
      const m = label.match(/(\d)/);
      const rating = m ? Number(m[1]) : 5;
      const img = c.querySelector('img');
      const photo = img?.src || '';
      return { name, relative, rating, text, photo };
    });
  });

  // Also scrape summary (rating + count)
  const summary = await page.evaluate(() => {
    const scoreEl = document.querySelector('div.fontDisplayLarge, span.ceNzKf');
    const countEl = Array.from(document.querySelectorAll('button, span'))
      .map((n) => n.textContent || '')
      .find((t) => /\d[\d,]*\s*reviews?/i.test(t));
    const scoreM = (scoreEl?.textContent || '').match(/([\d.]+)/);
    const countM = (countEl || '').match(/([\d,]+)\s*reviews?/i);
    return {
      rating: scoreM ? Number(scoreM[1]) : null,
      userRatingCount: countM ? Number(countM[1].replace(/,/g, '')) : null
    };
  });

  const reviews = normalise(scraped).filter((r) => r.text.length > 0);

  const out = {
    rating: summary.rating ?? 5.0,
    userRatingCount: summary.userRatingCount ?? reviews.length,
    placeId: '0x6ad65a3916c617d7:0x34ed38bbe863374a',
    fetchedAt: new Date().toISOString(),
    reviews
  };

  const path = resolve(ROOT, 'reviews.json');
  writeFileSync(path, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${reviews.length} reviews (rating ${out.rating}, ${out.userRatingCount} total) → ${path}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
