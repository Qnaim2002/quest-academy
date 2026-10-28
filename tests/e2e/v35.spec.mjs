/* v35 browser checks: every new question format can be played to a right answer with a finger or mouse
   (number line, fill the gap, sort, sentence, spot, clock, money, listen-and-tap, two steps, memory, hotspot, draw, rhythm). */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 4, lang: 'en', band: 3, welcomed: true, placed: true, coins: 300, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: { 'cine5:3:math:0': 1 }, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };

/* [format, subject, band] */
const CASES = [['numline', 'math', 1], ['numline', 'math', 3], ['numline', 'math', 4], ['fill', 'math', 2], ['fill', 'en', 3], ['bucket', 'sc', 1], ['bucket', 'math', 3], ['sent', 'bm', 3], ['spot', 'math', 3], ['spot', 'en', 2], ['clock', 'math', 2], ['clock', 'math', 4], ['money', 'math', 2], ['money', 'math', 4], ['picword', 'en', 1], ['picword', 'math', 2], ['twostep', 'math', 3], ['memory', 'sv', 2], ['hotspot', 'sc', 1], ['hotspot', 'pk', 3], ['hotspot', 'mz', 4], ['draw', 'math', 3], ['draw', 'sv', 1], ['rhythm', 'mz', 2]];

async function solve(page, kind) {
  const q = await page.evaluate(() => { const q = window.__quest.B.q; return { type: q.type, kind: q.kind, target: q.target, cfg: q.cfg, bad: q.bad, op: q.op, c: q.c, ans: q.ansText, items: q.items && q.items.map((i) => i.b), words: q.items && q.items.length, pattern: q.pattern, glyph: q.glyph, coins: q.coins, mem: q.mem }; });
  const A = page.locator('#answers');
  if (kind === 'numline') {
    const box = await A.locator('.nl-track').boundingBox(), c = q.cfg;
    await page.mouse.click(box.x + box.width * (c.target - c.lo) / (c.hi - c.lo), box.y + 44);
    await A.locator('[data-wx="go"]').click();
  } else if (kind === 'fill') {
    const ans = q.ans;
    await A.locator('.fl-tile', { hasText: new RegExp('^' + ans.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).click(); await A.locator('.fl-gap').click();
  } else if (kind === 'bucket') {
    for (let i = 0; i < q.items.length; i++) { await A.locator(`.bk-tile[data-i="${i}"]`).click(); await A.locator(`.bk-box[data-b="${q.items[i]}"]`).click(); }
  } else if (kind === 'sent' || kind === 'memory') {
    for (let k = 0; k < q.words; k++) await A.locator(`.o-tray .o-tile[data-i="${k}"]`).click();
  } else if (kind === 'spot') {
    await A.locator(`.sp-line[data-i="${q.bad}"]`).click();
  } else if (kind === 'clock') {
    const [h, m] = await page.evaluate(() => { const t = window.__quest.B.q.target; return [t.h, t.m]; });
    const start = await A.locator('.ck-read').innerText(), [sh] = start.split(':').map(Number);
    for (let i = 0; i < ((h - sh) + 12) % 12; i++) await A.locator('[data-w="h+"]').click();
    for (let i = 0; i < m / 5; i++) await A.locator('[data-w="m+"]').click();
    await A.locator('[data-wx="go"]').click();
  } else if (kind === 'money') {
    let left = q.target;
    for (const c of [...q.coins].sort((a, b) => b - a)) while (left >= c) { await A.locator(`.mn-tray .mn-coin[data-c="${c}"]`).click(); left -= c; }
  } else if (kind === 'picword') {
    await A.locator(`.pw-pic[data-i="${q.target}"]`).click();
  } else if (kind === 'twostep') {
    const ei = await page.evaluate(() => window.__quest.B.q.exprs.findIndex((e) => e.o === window.__quest.B.q.op)); await A.locator(`.ts-opt[data-i="${ei}"]`).click();
    const ni = await page.evaluate(() => window.__quest.B.q.nums.indexOf(window.__quest.B.q.c)); await A.locator(`.ts-opt[data-i="${ni}"]`).click();
  } else if (kind === 'hotspot') {
    const z = A.locator(`[data-z="${q.target}"]`).first(), shape = z.locator('path, circle, rect, polygon, ellipse');
    await ((await shape.count()) ? shape.first() : z).click({ force: true });
  } else if (kind === 'draw') {
    const strokes = await page.evaluate((g) => window.__quest.v35.GLYPHS[g], q.glyph), box = await A.locator('canvas').boundingBox();
    for (const s of strokes) { const P = s.map(([x, y]) => [box.x + x / 100 * box.width, box.y + y / 100 * box.height]); await page.mouse.move(...P[0]); await page.mouse.down(); for (const p of P) await page.mouse.move(...p, { steps: 1 }); await page.mouse.up(); }
    await A.locator('[data-tr="done"]').click();
  } else if (kind === 'rhythm') {
    await page.waitForTimeout(q.pattern.length * 560 + 1200);
    for (const p of q.pattern) await A.locator(`.rh-pad[data-p="${p}"]`).click();
  }
}

test.describe('new question formats', () => {
  test('each format can be played to a right answer', async ({ page }) => {
    test.setTimeout(240_000);
    const errors = watch(page);
    await boot(page, seed(), 'qa35');
    await page.goto('/');
    await page.evaluate(() => window.__quest.v35.fmLoad());
    for (const [kind, subj, band] of CASES) {
      await page.evaluate((s) => { window.__quest.showTab('adventure', true); window.__quest.v27.startBattle(s + ':1'); }, subj);
      await expect.poll(() => page.evaluate(() => !!(window.__quest.B.q && window.__quest.B.active)), { timeout: 15_000 }).toBe(true);
      await page.evaluate(([k, s, b]) => { const Q = window.__quest, q = Q.v35.FM.mod.make(k, s, b); window.__forced = q; Q.nextQuestion(q); }, [kind, subj, band]);
      await expect.poll(() => page.evaluate(() => window.__quest.B.q === window.__forced), { timeout: 5000 }).toBe(true);
      const before = await page.evaluate(() => window.__quest.B.asked || 0);
      await page.locator('#answers').scrollIntoViewIfNeeded();
      await solve(page, kind);
      await expect.poll(() => page.evaluate(() => (window.__quest.B.asked || 0)), { timeout: 8000, message: `${kind}/${subj}/${band} should end in a right answer` }).toBeGreaterThan(before);
      await page.evaluate(() => { const Q = window.__quest; Q.B.active = false; if (Q.leaveBattle) Q.leaveBattle(); });
    }
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a wrong try on the number line costs a try but the question stays', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa35b');
    await page.goto('/');
    await page.evaluate(() => window.__quest.v35.fmLoad());
    await page.evaluate(() => { window.__quest.showTab('adventure', true); window.__quest.v27.startBattle('math:1'); });
    await expect.poll(() => page.evaluate(() => !!(window.__quest.B.q && window.__quest.B.active))).toBe(true);
    await page.evaluate(() => { const Q = window.__quest, q = Q.v35.FM.mod.make('numline', 'math', 3); window.__forced = q; Q.nextQuestion(q); });
    await page.locator('#answers').scrollIntoViewIfNeeded();
    await page.locator('#answers [data-wx="go"]').click();   // the marker is still at 0: wrong
    await expect.poll(() => page.evaluate(() => window.__quest.B.wrong)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.__quest.B.q === window.__forced)).toBe(true);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
