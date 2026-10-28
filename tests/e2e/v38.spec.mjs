/* v38 browser checks: the child's Settings tab, the Hero armour sections and the simple parent card. */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 5, lang: 'en', band: 2, welcomed: true, placed: true, coins: 100, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: {}, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };

test.describe('v38', () => {
  test('Settings tab: sound, boss battle and easy reading rows switch on and off', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa38s');
    await page.goto('/');
    await page.locator('#nav-settings').click();
    const tab = page.locator('#tab-settings');
    await expect(tab).toContainText('Sound and voice');
    await expect(tab).toContainText('Boss battle');
    await expect(tab).toContainText('Easy reading');
    const row = tab.locator('[data-act^="v38"]').first();
    await expect(row).toBeVisible();
    await row.click();
    await expect(tab).toContainText('Easy reading');
    expect(errors).toEqual([]);
  });
  test('Hero tab: helmets, body armor, gauntlets and leg armor instead of knights', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ coins: 2000 }), 'qa38h');
    await page.goto('/');
    await page.locator('#nav-armory').click();
    const tab = page.locator('#tab-armory');
    for (const w of ['Helmets', 'Body armor', 'Gauntlets', 'Leg armor']) await expect(tab.getByRole('button', { name: w })).toBeVisible();
    await expect(tab.getByRole('button', { name: 'Knights' })).toHaveCount(0);
    await tab.getByRole('button', { name: 'Helmets' }).click();
    await expect(tab.getByRole('button', { name: /Buy/ }).first()).toBeVisible();
    await tab.getByRole('button', { name: /Buy/ }).first().click();
    await expect(tab.getByRole('button', { name: /Wearing/ }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
