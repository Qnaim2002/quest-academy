/* v35 browser checks for the Tower: the map, a climb with perks, special floors, rooms, story, and the sibling scoreboard. */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 5, lang: 'en', band: 3, welcomed: true, placed: true, coins: 300, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: {}, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };
const T = () => 'window.__quest.v35.tw';

/* beat the monster of the floor that is on screen, then press the button of the win card */
async function clearFloor(page) {
  await page.evaluate(() => { const Q = window.__quest; Q.B.locked = false; Q.B.mHp = 0; Q.v27.win(); });
  await expect(page.locator('#winSheet [data-act=runNext]')).toBeVisible({ timeout: 8000 });
  await page.locator('#winSheet [data-act=runNext]').click();
}
/* deal with what comes between two floors; returns the titles it saw */
async function between(page, seen) {
  for (let g = 0; g < 10; g++) {
    await page.waitForTimeout(250);
    const on = await page.evaluate(() => { const o = document.querySelector('#winOverlay.on'), s = o && o.querySelector('.tw-sheet'); return s ? (s.querySelector('h2') || {}).textContent || '' : null; });
    if (on === null) return;
    seen.push(on);
    const pz = await page.evaluate(() => !!document.querySelector('#twPz'));
    if (pz) { await page.evaluate(() => { const T = window.__quest.v35.tw, r = T.twRun(); T.twPuzzleDone(r); }); continue; }
    for (const s of ['[data-act=twPerk]', '[data-act=twShrineYes]', '[data-act=twShrinePick]', '[data-act=twBuy]:not([disabled])', '[data-act=twNext]']) {
      const el = page.locator('#winSheet ' + s).first();
      if (await el.count()) { await el.click(); break; }
    }
  }
}

test.describe('Tower', () => {
  test('the map shows the next boss as a shadow, and a climb gives perks, rooms and a story', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa35t');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await expect(page.locator('.tw-col .tw-sil')).toHaveCount(1);
    await expect(page.locator('.tw-hero')).toHaveCount(1);
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!(window.__quest.B.lv && window.__quest.B.lv.special === 'tower' && window.__quest.B.active))).toBe(true);
    const seen = [];
    let maxMax = 0;
    for (let f = 1; f <= 10; f++) {
      expect(await page.evaluate(() => window.__quest.B.lv.floor)).toBe(f);
      await clearFloor(page);
      await between(page, seen);
      await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
      maxMax = Math.max(maxMax, await page.evaluate(() => window.__quest.B.hMax));
    }
    const text = seen.join(' | ');
    expect(text).toMatch(/Pick a perk/);           // after floor 5 and floor 10
    expect(text).toMatch(/📖/);                      // a story beat on floor 10
    expect(text).toMatch(/What do you want to climb with/);
    expect(text).toMatch(/Puzzle Room|Campfire|Merchant|Shrine/);   // floor 7 is a room
    const perks = await page.evaluate(() => window.__quest.v35.tw.twRun().perks);
    const nPerks = Object.values(perks).reduce((a, b) => a + b, 0);
    expect(nPerks).toBeGreaterThanOrEqual(2);       // one after floor 5 and one after floor 10 (a Shrine or Merchant on floor 7 can add one more)
    expect(nPerks).toBeLessThanOrEqual(3);
    expect(await page.evaluate(() => window.__quest.S().tower.today.floor)).toBe(10);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('special floors: the banner, the mirror, no clock, and only order puzzles', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ pace: 'standard' }), 'qa35u');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    for (const m of ['mirror', 'zen', 'order', 'speed', 'lucky']) {
      await page.evaluate((m) => { const T = window.__quest.v35.tw, r = T.twRun(); for (let s = 1; s < 5000; s++) { r.seed = s; const x = T.twMod(3); if (x && x.id === m) break; } window.__quest.v27.startBattle('tower:3'); }, m);
      await expect(page.locator('#twBanner')).toBeVisible();
      const info = await page.evaluate(() => { const B = window.__quest.B; return { mod: B.lv.mod, tmax: B.tmax, mirror: document.querySelector('#battleView').classList.contains('tw-mirror'), kind: B.q.kind, only: B.lv.only }; });
      expect(info.mod).toBe(m);
      expect(info.mirror).toBe(m === 'mirror');
      if (m === 'zen') expect(info.tmax).toBe(0); else expect(info.tmax).toBeGreaterThan(0);
      if (m === 'order') expect(['order', 'match', 'wx']).toContain(info.kind);
    }
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('perks change the fight: +1 heart, a forgiven mistake, double coins', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa35v');
    await page.goto('/');
    await page.locator('#nav-tower').evaluate(b => b.click());
    await page.locator('[data-act=towerGo][data-v="1"]').click();
    await expect.poll(() => page.evaluate(() => !!window.__quest.B.active)).toBe(true);
    const mx0 = await page.evaluate(() => window.__quest.B.hMax);
    await page.evaluate(() => { const T = window.__quest.v35.tw; T.twGivePerk('heart'); T.twGivePerk('forgive'); T.twGivePerk('coin2'); window.__quest.v27.startBattle('tower:2'); });
    await expect.poll(() => page.evaluate(() => window.__quest.B.hMax)).toBe(Math.round(mx0 * 1.15));
    /* the first mistake on a floor does not hurt */
    await page.evaluate(() => { const Q = window.__quest; Q.nextQuestion(Q.v35.QT.tfQ('math', 3)); });
    const hp = await page.evaluate(() => window.__quest.B.hHp);
    await page.evaluate(() => { const Q = window.__quest, q = Q.B.q; Q.onPick && Q.onPick(q.options.findIndex((_, i) => i !== q.correct)); });
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => window.__quest.B.hHp)).toBe(hp);
    expect(await page.evaluate(() => window.__quest.B.forgave)).toBe(true);
    /* double coins: the next win pays twice, once */
    const base = await page.evaluate(() => window.__quest.v35.tw.twReward(10, { rewMul: 1 }, window.__quest.v35.tw.twRun()));
    expect(base).toBe(20);
    expect(await page.evaluate(() => window.__quest.v35.tw.twReward(10, { rewMul: 1 }, window.__quest.v35.tw.twRun()))).toBe(10);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a brother or sister’s best floor today shows on the tower page', async ({ page }) => {
    const errors = watch(page);
    const day = new Date(); const td = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    await page.addInitScript(([s, td]) => {
      if (sessionStorage.getItem('qa35w')) return; localStorage.clear(); sessionStorage.setItem('qa35w', '1');
      localStorage.setItem('quest-academy-device', JSON.stringify({ v: 1, active: 'p1', profiles: [{ id: 'p1', name: 'Adam', made: 1 }, { id: 'p2', name: 'Aisyah', made: 2 }] }));
      localStorage.setItem('quest-academy-v4', JSON.stringify(s));
      localStorage.setItem('quest-academy-v4:p2', JSON.stringify({ ...s, tower: { best: { 3: 34 }, runs: 3, today: { day: td, floor: 34 } } }));
    }, [seed(), td]);
    await page.goto('/');
    await page.locator('#whoSheet [data-act=whoPick][data-v=p1]').click();   // "Who is playing?" appears when there are two children
    await page.locator('#nav-tower').evaluate(b => b.click());
    await expect(page.locator('.tw-board')).toContainText('Aisyah reached floor 34 today');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
