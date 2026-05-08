#!/usr/bin/env node
// Scrapes the public Google Maps page for Elite Car Tinting and writes the
// results to reviews.json. Runs headlessly with Playwright - no API key needed.
//
// Local usage:
//   npm i -D playwright
//   npx playwright install chromium
//   node scripts/scrape-google-reviews.mjs

import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLACE_ID = 'ChIJ1xfGFjla1moROjdj6Ls47TQ';

// Two URL strategies tried in order; place_id URL is more stable across rebrands
const URLS = [
  `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}&hl=en`,
  'https://www.google.com/maps/place/Elite+Car+Tinting/@-37.7419,144.9206,17z/' +
    'data=!4m8!3m7!1s0x6ad65a3916c617d7:0x34ed38bbe863374a!8m2!3d-37.7419!4d144.9232!9m1!1b1',
];

const SCROLL_ROUNDS = 30;
const MAX_REVIEWS = 150;

// data-review-id is a stable data attribute Google has kept across DOM refactors
const CARD_SEL = 'div[data-review-id]';

// ---------------------------------------------------------------------------

function normalise(raw) {
  const seen = new Set();
  const out = [];
  for (const r of raw) {
    if (!r.text || r.text.length < 5) continue;
    const key = (r.name || '') + '|' + r.text.slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: r.name || 'Google User',
      relative: r.relative || '',
      rating: Number(r.rating) || 5,
      text: r.text.trim(),
      photo: r.photo || '',
    });
  }
  return out;
}

async function dismissConsent(page) {
  const candidates = [
    'button[aria-label*="Accept all"]',
    'button[aria-label*="Reject all"]',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'button:has-text("Agree")',
    'form[action*="consent"] button',
  ];
  for (const sel of candidates) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.count() > 0) {
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(1000);
        return;
      }
    } catch (_) {}
  }
}

async function clickReviewsTab(page) {
  const candidates = [
    'button[role="tab"][aria-label*="Reviews"]',
    'button[role="tab"]:has-text("Reviews")',
    '[data-tab-index="1"]',
  ];
  for (const sel of candidates) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.count() > 0) {
        await btn.click({ timeout: 5000 });
        await page.waitForTimeout(1500);
        return;
      }
    } catch (_) {}
  }
}

async function scrollReviews(page) {
  const scrollHandle = await page.evaluateHandle((sel) => {
    const card = document.querySelector(sel);
    if (!card) return document.scrollingElement;
    let el = card;
    while (el && el !== document.body) {
      const s = getComputedStyle(el);
      if (/auto|scroll/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 50) return el;
      el = el.parentElement;
    }
    return document.scrollingElement;
  }, CARD_SEL);

  for (let i = 0; i < SCROLL_ROUNDS; i++) {
    await page.evaluate((node) => { node.scrollBy(0, 5000); }, scrollHandle);
    await page.waitForTimeout(800);
    const count = await page.locator(CARD_SEL).count();
    if (count >= MAX_REVIEWS) break;
  }
}

async function expandMoreButtons(page) {
  await page.evaluate(() => {
    ['button.w8nwRe', 'button[aria-label="See more"]', 'button[aria-expanded="false"]']
      .flatMap((sel) => Array.from(document.querySelectorAll(sel)))
      .forEach((b) => { try { b.click(); } catch (_) {} });
  });
  await page.waitForTimeout(600);
}

async function extractReviews(page) {
  return page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel)).map((c) => {
      // Name - try stable selectors then fallback to contributor link text
      const name = (
        c.querySelector('.d4r55')?.textContent ||
        c.querySelector('.TSUbDb')?.textContent ||
        c.querySelector('a[href*="contrib"]')?.textContent ||
        c.querySelector('[class*="fontBodyMedium"]')?.textContent ||
        ''
      ).trim();

      // Relative date - look for known classes, else pattern-match spans
      const relative = (
        c.querySelector('.rsqaWe')?.textContent ||
        c.querySelector('.dehysf')?.textContent ||
        Array.from(c.querySelectorAll('span')).find((el) =>
          /\b(ago|week|month|year|day)s?\b/i.test(el.textContent)
        )?.textContent ||
        ''
      ).trim();

      // Star rating via aria-label (most stable - Google uses this for accessibility)
      const starEl = c.querySelector('span[aria-label*="star"]');
      const starLabel = starEl?.getAttribute('aria-label') || '';
      const starMatch = starLabel.match(/(\d)/);
      const rating = starMatch ? Number(starMatch[1]) : 5;

      // Review text - try known classes then fall back to longest non-empty span
      const textEl = (
        c.querySelector('.wiI7pd') ||
        c.querySelector('.MyEned') ||
        c.querySelector('span[jsname]') ||
        Array.from(c.querySelectorAll('span')).reduce(
          (best, el) => (el.textContent.length > (best?.textContent.length ?? 0) ? el : best),
          null
        )
      );
      const text = (textEl?.textContent || '').trim();

      // Avatar photo
      const imgEl = c.querySelector('img.NBa7we') || c.querySelector('img[src*="googleusercontent"]');
      const photo = imgEl?.src || '';

      return { name, relative, rating, text, photo };
    });
  }, sel);
}

async function extractSummary(page) {
  return page.evaluate(() => {
    const scoreEl =
      document.querySelector('div.fontDisplayLarge') ||
      document.querySelector('span.ceNzKf') ||
      document.querySelector('[aria-label*="stars out of 5"]');
    const scoreM = (
      scoreEl?.textContent || scoreEl?.getAttribute('aria-label') || ''
    ).match(/([\d.]+)/);

    const countText = Array.from(document.querySelectorAll('button, span, div'))
      .map((n) => (n.childNodes.length === 1 && n.firstChild?.nodeType === 3 ? n.textContent : ''))
      .find((t) => /\d[\d,]*\s*reviews?/i.test(t));
    const countM = (countText || '').match(/([\d,]+)\s*reviews?/i);

    return {
      rating: scoreM ? Number(scoreM[1]) : null,
      userRatingCount: countM ? Number(countM[1].replace(/,/g, '')) : null,
    };
  });
}

// ---------------------------------------------------------------------------

async function attemptScrape(url) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  try {
    const ctx = await browser.newContext({
      locale: 'en-AU',
      timezoneId: 'Australia/Melbourne',
      viewport: { width: 1280, height: 900 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/124.0.0.0 Safari/537.36',
    });

    const page = await ctx.newPage();

    // Block heavy assets to speed up page load
    await page.route('**/*.{png,jpg,jpeg,gif,webp,woff,woff2,ttf,mp4,webm}', (r) => r.abort());

    console.log(`[scrape] navigating → ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    await dismissConsent(page);
    await clickReviewsTab(page);

    try {
      await page.waitForSelector(CARD_SEL, { timeout: 30_000 });
    } catch {
      // Save a debug screenshot so failures can be diagnosed from the Actions log
      const shot = resolve(ROOT, 'debug-screenshot.png');
      await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
      console.error('[scrape] timed out waiting for review cards — screenshot saved');
      throw new Error('review cards selector timed out');
    }

    await scrollReviews(page);
    await expandMoreButtons(page);

    const cardCount = await page.locator(CARD_SEL).count();
    console.log(`[scrape] found ${cardCount} review cards`);

    const [scraped, summary] = await Promise.all([
      extractReviews(page),
      extractSummary(page),
    ]);

    return { reviews: normalise(scraped), summary };
  } finally {
    await browser.close();
  }
}

async function main() {
  const outPath = resolve(ROOT, 'reviews.json');

  // Load previous file once so we can fall back to it on failure
  let prev = null;
  if (existsSync(outPath)) {
    try { prev = JSON.parse(readFileSync(outPath, 'utf8')); } catch (_) {}
  }

  let lastError;
  for (const url of URLS) {
    try {
      const { reviews, summary } = await attemptScrape(url);

      if (reviews.length < 3) {
        console.warn(`[scrape] only ${reviews.length} reviews from ${url} — trying next URL`);
        lastError = new Error(`low review count: ${reviews.length}`);
        continue;
      }

      // Success: preserve previous count/rating if the live page didn't surface them
      const out = {
        rating: summary.rating ?? prev?.rating ?? 5.0,
        userRatingCount: summary.userRatingCount ?? prev?.userRatingCount ?? reviews.length,
        placeId: PLACE_ID,
        fetchedAt: new Date().toISOString(),
        reviews,
      };

      writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
      console.log(
        `[scrape] wrote ${reviews.length} reviews ` +
        `(rating ${out.rating}, ${out.userRatingCount} total) → ${outPath}`
      );
      return;
    } catch (err) {
      console.error(`[scrape] URL failed (${url}): ${err.message}`);
      lastError = err;
    }
  }

  // All URLs failed — preserve previous payload with a warning timestamp
  console.warn('[scrape] all attempts failed — preserving previous reviews.json');
  if (prev) {
    prev.fetchedAt = new Date().toISOString();
    prev.lastScrapeWarning = `scrape failed at ${prev.fetchedAt}: ${lastError?.message}`;
    try {
      writeFileSync(outPath, JSON.stringify(prev, null, 2), 'utf8');
    } catch (e) {
      console.error('[scrape] could not write reviews.json:', e.message);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('[scrape] unhandled error:', err);
  process.exit(1);
});
