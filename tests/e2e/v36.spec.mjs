/* v36 browser checks: tower builds with reroll and banish, a milestone boss rule, the Ascension panel, a curse deal for older
   children only, and a story choice that changes the next land. */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 5, lang: 'en', band: 3, welcomed: true, placed: true, coins: 300, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: {}, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };

test.describe('v36', () => {
  test('Tower: the map says Ascension is locked, a perk sheet has a build row, a reroll and a banish button', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa36a');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await expect(page.locator('.tw-asc.locked')).toBeVisible();
    await expect(page.locator('.tw-legend')).toContainText(/rule/i);
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    await page.evaluate(() => { const T = window.__quest.v35.tw, r = T.twRun(); r.coins = 60; r.spent = 0; r.floor = 6; window.__quest.S().coins = 200; T.twPerkSheet(); });
    await expect(page.locator('#winSheet .tw-builds')).toBeVisible();
    await expect(page.locator('#winSheet [data-act=twReroll]')).toBeVisible();
    await expect(page.locator('#winSheet [data-act=twBan]').first()).toBeVisible();
    const before = await page.locator('#winSheet .tw-card b').allTextContents();
    await page.locator('#winSheet [data-act=twReroll]').click();
    await expect(page.locator('#winSheet .tw-card').first()).toBeVisible();
    const spent = await page.evaluate(() => window.__quest.v35.tw.twRun().spent);
    expect(spent).toBeGreaterThan(0);
    const gone = await page.locator('#winSheet [data-act=twBan]').first().getAttribute('data-v');
    await page.locator('#winSheet [data-act=twBan]').first().click();
    await expect(page.locator('#winSheet .tw-card').first()).toBeVisible();
    expect(await page.evaluate(() => window.__quest.v35.tw.twRun().ban)).toContain(gone);
    void before;
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('Tower: the floor 25 boss announces Twin Strike, and floor 50 stops the clock until a mistake', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ pace: 'standard' }), 'qa36b');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    await page.evaluate(() => window.__quest.v27.startBattle('tower:25'));
    await expect(page.locator('#twBanner')).toContainText(/Twin Strike/);
    expect(await page.evaluate(() => window.__quest.B.lv.rule)).toBe('pairs');
    await page.evaluate(() => window.__quest.v27.startBattle('tower:50'));
    await expect(page.locator('#twBanner')).toContainText(/Hourglass/);
    const t0 = await page.evaluate(() => window.__quest.B.tleft);
    await page.waitForTimeout(1300);
    const t1 = await page.evaluate(() => window.__quest.B.tleft);
    expect(t1).toBe(t0);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('Tower: a curse deal is offered at the Shrine for age 6 but not for age 4', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ band: 3 }), 'qa36c');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    await page.evaluate(() => { const T = window.__quest.v35.tw, r = T.twRun(); r.floor = 8; T.twShrine(r); });
    await expect(page.locator('#winSheet [data-act=twCurse]')).toBeVisible();
    await page.locator('#winSheet [data-act=twCurse]').click();
    await page.locator('#winSheet [data-act=twCurseTake]').first().click();
    await expect(page.locator('#winSheet [data-act=twPerk]').first()).toBeVisible();
    expect(await page.evaluate(() => window.__quest.v35.tw.twRun().curse)).toMatchObject({ left: 5 });
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('Tower: no curse deal for age 4', async ({ page }) => {
    await boot(page, seed({ band: 1 }), 'qa36d');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    await page.evaluate(() => { const T = window.__quest.v35.tw, r = T.twRun(); r.floor = 8; T.twShrine(r); });
    await expect(page.locator('#winSheet [data-act=twShrineYes]')).toBeVisible();
    await expect(page.locator('#winSheet [data-act=twCurse]')).toHaveCount(0);
  });

  test('Story: a choice changes the next land and shows a chip in its fights', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ pathFx: { 'math:1': { id: 'ally', z: 0, used: 0 } } }), 'qa36e');
    await page.goto('/');
    await page.evaluate(() => window.__quest.v27.startBattle('math:11'));
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    await expect(page.locator('#pathChip')).toContainText(/Helper/);
    const r = await page.evaluate(() => { const Q = window.__quest; return Q.v36.pathOf(Q.B.lv).id; });
    expect(r).toBe('ally');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
