/* v33 browser checks: buy a pet in Pet Haven, a story opens on scene 1, a finisher paints its light show, and the
   biggest text size still fits the screen. Run with: npm run e2e */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 4, lang: 'en', band: 3, welcomed: true, coins: 900, sfx: false, music: false, pace: 'unlimited', ...extra });
const boot = (page, st) => page.addInitScript((s) => { if (sessionStorage.getItem('qa33')) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem('qa33', '1'); }, st);

test('buy a pet in Pet Haven', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await boot(page, seed({ owned: [] }));
  await page.goto('/');
  await page.evaluate(() => { const q = window.__quest; q.showTab('armory'); q.UI.arm = 'haven'; q.renderHaven(); });
  const btn = page.locator('[data-act="hvBuyPet"]').first();
  await expect(btn).toBeVisible();
  const id = await btn.getAttribute('data-v');
  await btn.click();
  await expect.poll(() => page.evaluate((i) => (JSON.parse(localStorage.getItem('quest-academy-v4')).owned || []).includes(i), id)).toBe(true);
  expect(errors).toEqual([]);
});

test('a story opens on scene 1 and has one big button', async ({ page }) => {
  await boot(page, seed());
  await page.goto('/');
  await page.evaluate(() => window.__quest.openComic(0, null, 'math', 'chapter'));
  await expect(page.locator('#comicOverlay.on')).toBeVisible();
  expect(await page.evaluate(() => window.__quest.UI.comic.i)).toBe(1);
});

test('a finisher paints a light show and cleans it up', async ({ page }) => {
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await boot(page, seed());
  await page.goto('/');
  await page.evaluate(() => { const q = window.__quest; q.showTab('armory'); q.UI.arm = 'gear'; q.UI.slot = 'finisher'; q.renderArmory && q.renderArmory(); });
  await page.evaluate(() => { const h = document.querySelector('#finPv'); window.__quest.finPreview('fin_meteor', h); });
  await expect(page.locator('.vfxcv')).toHaveCount(1);
  await expect(page.locator('.vfxcv')).toHaveCount(0, { timeout: 8000 });
  expect(errors).toEqual([]);
});

test('the biggest text size does not push anything off the screen', async ({ page }) => {
  await boot(page, seed({ fs: 1.3 }));
  await page.goto('/');
  for (const tab of ['studies', 'adventure', 'armory', 'cards', 'parent']) {
    await page.evaluate((t) => window.__quest.showTab(t), tab);
    await page.waitForTimeout(300);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(over, tab).toBeLessThanOrEqual(2);
  }
});
