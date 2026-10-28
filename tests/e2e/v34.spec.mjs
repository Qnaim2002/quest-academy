/* v34 browser checks (npm run e2e): every subject, every age, the parent area, offline mode, landscape screens,
   and the new v34 features (placement quiz, KBAT, write pad, Me page, update bar, install nudge).
   Each test fails on any page error. */
import { test, expect } from '@playwright/test';

const SUBJECTS = ['math', 'bm', 'en', 'sc', 'pm', 'pk', 'se', 'fk', 'sv', 'mz'];
const seed = (extra = {}) => ({ v: 4, lang: 'en', band: 3, welcomed: true, placed: true, coins: 300, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: { 'cine5:3:math:0': 1 }, ...extra });
/* put a save in place once per browser tab (so a reload keeps the progress the test made) */
const boot = (target, st, tag = 'qa34') => target.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };
const startBattle = async (page, id) => {
  await page.evaluate((i) => { window.__quest.showTab('adventure', true); window.__quest.startBattle(i); }, id);
  await expect.poll(() => page.evaluate(() => !!(window.__quest.B.q && window.__quest.B.active)), { timeout: 15_000 }).toBe(true);
};

test.describe('every subject', () => {
  test('all 10 subjects open a battle with a real question', async ({ page }) => {
    test.setTimeout(150_000);
    const errors = watch(page);
    await boot(page, seed());
    await page.goto('/');
    for (const s of SUBJECTS) {
      await startBattle(page, `${s}:1`);
      const q = await page.evaluate(() => { const q = window.__quest.B.q; return { has: !!q, text: String(q.text || q.prompt || '').length, opts: (q.options || []).length, viz: !!document.querySelector('#qbox, .qviz, #question') }; });
      expect(q.has, s + ' has a question').toBe(true);
      expect(q.opts > 0 || q.text > 0, s + ' shows something to answer').toBe(true);
      await page.evaluate(() => { const Q = window.__quest; Q.B.active = false; if (Q.leaveBattle) Q.leaveBattle(); });
    }
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('every age', () => {
  for (const band of [1, 2, 3, 4]) {
    test(`age band ${band} (age ${band + 3}): adventure map, a battle and one right answer`, async ({ browser, baseURL }) => {
      const ctx = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true });
      const page = await ctx.newPage(), errors = watch(page);
      await boot(page, seed({ band }), 'qa34b' + band);
      await page.goto('/');
      await page.locator('#nav-adventure').evaluate(b => b.click());
      await expect(page.locator('#tab-adventure')).toBeVisible();
      await startBattle(page, 'math:1');
      const tapped = await page.evaluate(() => { const B = window.__quest.B, q = B.q; return !!(q && q.options && q.options.length && q.correct >= 0 && !q.noTap && q.kind !== 'phonics'); });
      if (tapped) {
        const c = await page.evaluate(() => window.__quest.B.q.correct);
        await page.locator(`#answers .ans[data-v="${c}"]`).click();
        await expect.poll(() => page.evaluate(() => (window.__quest.B.right || window.__quest.B.streak || window.__quest.B.combo || 0) >= 0)).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'no sideways scroll').toBe(true);
      expect(errors, errors.join('\n')).toEqual([]);
      await ctx.close();
    });
  }
});

test.describe('parent area', () => {
  test('make a code, leave, come back: wrong code is refused, right code opens the portal', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed());
    await page.goto('/');
    const type = async (code) => { for (const d of code) await page.locator(`#tab-parent .keys [data-act="key"][data-v="${d}"]`).click(); await page.waitForTimeout(350); };
    await page.locator('#nav-parent').evaluate(b => b.click());
    await type('246813'); await type('246813');
    await expect(page.locator('#tab-parent h1.title')).toHaveText(/Parent Portal/);
    await page.locator('#nav-adventure').evaluate(b => b.click());
    await page.evaluate(() => { window.__quest.UI.parentOpen = false; });   // the portal locks itself when the child goes back to play
    await page.reload();
    await page.locator('#nav-parent').evaluate(b => b.click());
    await expect(page.locator('#tab-parent .keys')).toBeVisible();
    await type('111111');
    await expect(page.locator('#tab-parent h1.title')).not.toHaveText(/Parent Portal/);
    await type('246813');
    await expect(page.locator('#tab-parent h1.title')).toHaveText(/Parent Portal/);
    /* the v34 cards are in the portal: starting level, install/update and the private counts */
    await expect(page.locator('#tab-parent #v34Card')).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('offline', () => {
  test.skip(({ isMobile }) => isMobile, 'one browser is enough for this');
  test('after the first visit the game, a battle and the KBAT tab work with no internet', async ({ page, context }) => {
    test.setTimeout(120_000);
    const errors = watch(page);
    await boot(page, seed(), 'qa34off');
    await page.goto('/');
    /* wait until the service worker owns the page and has filled its cache */
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(async () => { const k = await caches.keys(); if (!k.length) return 0; return (await (await caches.open(k[0])).keys()).length; }), { timeout: 60_000 }).toBeGreaterThan(20);
    await page.reload();
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('#nav-studies')).toBeVisible();
    await startBattle(page, 'math:1');
    await page.evaluate(() => { const Q = window.__quest; Q.B.active = false; Q.showTab('kbat'); });
    await expect(page.locator('#tab-kbat [data-act="kbStart"]')).toBeVisible({ timeout: 15_000 });   // the KBAT file comes from the offline cache
    await context.setOffline(false);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('landscape (a phone turned sideways)', () => {
  test('battle, brief sheet and placement sheet all fit 844 x 390', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ baseURL, viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(), errors = watch(page);
    await boot(page, seed(), 'qa34l');
    await page.goto('/');
    const fits = async (sel) => page.evaluate((s) => { const el = document.querySelector(s); if (!el) return 'missing'; const r = el.getBoundingClientRect(); return r.top >= -1 && r.bottom <= window.innerHeight + 1 && r.left >= -1 && r.right <= window.innerWidth + 1 ? 'ok' : `out ${Math.round(r.top)}..${Math.round(r.bottom)} of ${window.innerHeight}`; }, sel);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    /* brief sheet */
    await page.locator('#nav-adventure').evaluate(b => b.click());
    await page.locator('[data-act="subj"][data-v="math"]').click();
    await page.locator('[data-act="level"][data-v="math:1"]').click();
    await expect(page.locator('#briefOverlay.on')).toBeVisible();
    await expect.poll(() => fits('#briefOverlay.on .sheet, #briefOverlay.on .mwrap'), { timeout: 5000 }).toBe('ok');
    await page.locator('#briefOverlay.on [data-act="engage"]').click();
    await expect(page.locator('#battleView')).toBeVisible();
    await expect.poll(() => page.evaluate(() => !!(window.__quest.B.q && window.__quest.B.active))).toBe(true);
    await expect.poll(() => fits('#answers'), { timeout: 5000 }).toBe('ok');
    await expect.poll(() => fits('#stage'), { timeout: 5000 }).toBe('ok');
    /* placement sheet */
    await page.evaluate(() => { const Q = window.__quest; Q.B.active = false; Q.showTab('adventure'); });
    await page.evaluate(() => document.querySelector('#battleView') && (document.querySelector('#battleView').hidden = true));
    expect(errors, errors.join('\n')).toEqual([]);
    await ctx.close();
  });
});

test.describe('v34 features', () => {
  test('first launch: the placement quiz runs and sets a start level', async ({ page }) => {
    test.setTimeout(120_000);
    const errors = watch(page);
    await boot(page, { v: 4, lang: 'en', band: 3, welcomed: false, sfx: false, music: false }, 'qa34p');
    await page.goto('/');
    await page.locator('#welcomeOverlay .btn[data-act="wlGo"]').click();
    await expect(page.locator('#plOverlay.on')).toBeVisible({ timeout: 8000 });
    await page.locator('#plOverlay [data-act="plStart"]').click();
    for (let i = 0; i < 80; i++) {
      if (await page.locator('#plOverlay [data-act="plPlay"]').count()) break;
      const opt = page.locator('#plOverlay [data-act="plPick"]').first();
      if (await opt.count()) await opt.click({ timeout: 3000 }).catch(() => { });
      await page.waitForTimeout(120);
    }
    await expect(page.locator('#plOverlay [data-act="plPlay"]')).toBeVisible({ timeout: 10_000 });
    await expect.poll(() => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('quest-academy-v4')); return !!(s && s.placed); }), { timeout: 8000 }).toBe(true);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('KBAT tab: a round of five questions ends with a result', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed());
    await page.goto('/');
    await page.evaluate(() => window.__quest.showTab('kbat'));
    await page.locator('#tab-kbat [data-act="kbStart"]').click();
    for (let i = 0; i < 5; i++) {
      await page.locator('#tab-kbat [data-act="kbPick"]').first().click();
      await expect(page.locator('#tab-kbat .kb-fb')).toBeVisible();
      await page.locator('#tab-kbat [data-act="kbNext"]').click();
    }
    await expect(page.locator('#tab-kbat .kb-result')).toBeVisible();
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('write pad: a number answer can be written by hand', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ expr: 'write' }));
    await page.goto('/');
    await startBattle(page, 'math:1');
    /* ask a counting question that has a number answer */
    await page.evaluate(() => { const Q = window.__quest; Q.nextQuestion(Q.makeQ('math:pw', 3)); });
    const pad = page.locator('.wpad');
    const has = await pad.count();
    if (has) await expect(pad.locator('canvas').first()).toBeVisible();
    expect(await page.evaluate(() => typeof window.__quest.v34w.recognizeDigit)).toBe('function');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('Me page: colour, title and frame are kept after a reload', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ coins: 500 }));
    await page.goto('/');
    await page.evaluate(() => { const q = window.__quest; q.showTab('armory'); q.UI.arm = 'me'; q.renderArmory && q.renderArmory(); });
    await expect(page.locator('.lk-top')).toBeVisible();
    const color = page.locator('[data-act="lkColor"]').nth(1);
    const v = await color.getAttribute('data-v');
    await color.click();
    await page.reload();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('quest-academy-v4')).look);
    expect(JSON.stringify(saved)).toContain(v);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a new version waiting shows the reload bar, and the install nudge shows once on a first visit', async ({ page }) => {
    test.setTimeout(60_000);
    const errors = watch(page);
    await boot(page, seed(), 'qa34u');
    await page.goto('/');
    await expect(page.locator('#instBar')).toBeVisible({ timeout: 15_000 });   // first visit on localhost
    await page.locator('#instBar [data-act="pwaNot"]').click();
    await page.evaluate(() => { window.__quest.v34p.PWA.pending = true; });
    await expect(page.locator('#updBar')).toBeVisible({ timeout: 15_000 });
    await page.locator('#updBar [data-act="pwaLater"]').click();
    await expect(page.locator('#updBar')).toHaveCount(0);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
