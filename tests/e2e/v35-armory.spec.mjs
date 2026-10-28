/* v35 browser checks for the Armory: trophy gear and traits, compare, weapon evolution, the wardrobe, and two relic slots with pairs. */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 5, lang: 'en', band: 3, welcomed: true, placed: true, coins: 2000, sfx: false, music: false, pace: 'unlimited', defeated: 200, comics: {},
  owned: ['weapon_pencil', 'weapon_quill', 'weapon_torch', 'shield_none', 'shield_heart', 'shield_wood', 'cape_none', 'cape_ocean', 'cape_star', 'aura_none'],
  relics: ['r_owl', 'r_hourglass', 'r_fang', 'r_bell', 'r_heart'], relicOn: 'r_owl', relicX: ['r_hourglass'], upg: { weapon_torch: 5 }, equipped: { weapon: 'weapon_torch' }, tower: { best: { 3: 35 }, runs: 2 }, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s));
  localStorage.setItem('quest-academy-device', JSON.stringify({ v: 1, active: 'p1', profiles: [{ id: 'p1', name: '', made: 1 }], inst: { shown: 9, at: Date.now(), never: true, done: true } })); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };

for (const pixel of [true, false]) {
  test.describe(pixel ? 'Armory (pixel art)' : 'Armory (classic art)', () => {
    test('past wins unlock trophy gear, a piece can be compared, and the weapon evolves with a ceremony', async ({ page }) => {
      const errors = watch(page);
      await boot(page, seed({ pixel }), 'qa35a' + pixel);
      await page.goto('/');
      await page.locator('#nav-armory').click();
      await page.locator('[data-act=slot][data-v=weapon]').click();
      await expect.poll(() => page.evaluate(() => window.__quest.S().owned.includes('weapon_keris'))).toBe(true);   // tower floor 30 reached before
      await expect(page.locator('.tr-src').first()).toBeVisible();
      await page.locator('.item[data-v="weapon_quill"] .item-pv').click();
      await expect(page.locator('.cmp li')).toHaveCount(6);
      await page.locator('[data-act=pvReset]').click();
      const before = await page.evaluate(() => window.__quest.v35.arm.armStats(window.__quest.S().equipped).atk);
      await page.locator('[data-act=evoGo]').scrollIntoViewIfNeeded();
      await page.locator('[data-act=evoGo]').click();
      await expect(page.locator('#wevoOverlay.on')).toHaveCount(1);
      await expect(page.locator('#evoBtns [data-act=ov27Close]')).toBeVisible({ timeout: 6000 });
      expect(await page.evaluate(() => window.__quest.S().evo.weapon_torch)).toBe(1);
      expect(await page.evaluate(() => window.__quest.v35.arm.armStats(window.__quest.S().equipped).atk)).toBe(before + 3);
      await page.locator('#evoBtns [data-act=ov27Close]').click();
      await expect(page.locator('.evo-card.done')).toBeVisible();
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test('the wardrobe changes how the hero looks but not the power, and two relics can be worn together', async ({ page }) => {
      const errors = watch(page);
      await boot(page, seed({ pixel }), 'qa35b' + pixel);
      await page.goto('/');
      const atk0 = await page.evaluate(() => window.__quest.v35.arm.armStats(window.__quest.S().equipped).atk);
      await page.locator('#nav-armory').click();
      await page.locator('[data-act=armView][data-v=wd]').click();
      await page.locator('[data-act=wdSet][data-v="weapon|weapon_quill"]').click();
      expect(await page.evaluate(() => window.__quest.S().wardrobe.weapon)).toBe('weapon_quill');
      expect(await page.evaluate(() => window.__quest.v35.arm.armStats(window.__quest.S().equipped).atk)).toBe(atk0);
      await page.locator('[data-act=wdSet][data-v="weapon|"]').click();
      expect(await page.evaluate(() => !(window.__quest.S().wardrobe || {}).weapon)).toBe(true);
      await page.locator('#nav-cards').click();
      await page.locator('[data-act=relicView][data-v="1"]').click();
      await expect(page.locator('.relic-slots .rs.full')).toHaveCount(2);
      await expect(page.locator('.relic-slots .rs.lock')).toHaveCount(1);
      await expect(page.locator('.relic-slots .syn li.on')).toHaveCount(1);   // Hoot's Feather + Tiny Hourglass
      expect(errors, errors.join('\n')).toEqual([]);
    });
  });
}
