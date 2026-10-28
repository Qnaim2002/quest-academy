/* v31 smoke test: open a battle, answer (one wrong on purpose), win, look at the mistake review, then open the Parent
   Portal with a new parent code. Fails on any page error. Run with: npm run e2e */
import { test, expect } from '@playwright/test';

test('battle → win → mistake review → Parent Portal', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  /* a fresh child (age 6) who has seen the first math story; calm extras off so the test is quick and steady */
  await page.addInitScript(() => {
    if (sessionStorage.getItem('qa-seeded')) return;
    localStorage.clear();
    localStorage.setItem('quest-academy-v4', JSON.stringify({ v: 4, lang: 'en', band: 3, welcomed: true, coins: 100, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: { 'cine5:3:math:0': 1 } }));
    sessionStorage.setItem('qa-seeded', '1');
  });
  await page.goto('/');

  /* 1. open a battle */
  await page.locator('#nav-adventure').evaluate(b => b.click());
  await page.locator('[data-act="subj"][data-v="math"]').click();
  await page.locator('[data-act="level"][data-v="math:1"]').click();
  await page.locator('#briefOverlay.on [data-act="engage"]').click();
  await expect(page.locator('#battleView')).toBeVisible();
  await expect.poll(() => page.evaluate(() => !!(window.__quest.B.q && window.__quest.B.active))).toBe(true);   // the first question may be a drag-to-order one

  /* 2. answer: once wrong on purpose, then right until the monster falls */
  const state = () => page.evaluate(() => { const B = window.__quest.B, q = B.q; return { has: !!q, tap: !!(q && q.options && q.options.length && q.correct >= 0 && !q.noTap && q.kind !== 'phonics'), correct: q ? q.correct : -1, n: q && q.options ? q.options.length : 0, locked: B.locked, active: B.active }; });
  const tapQuestion = () => page.evaluate(() => { const Q = window.__quest; Q.nextQuestion(Q.makeQ('math:pw', 3)); });
  let wrongDone = false;
  for (let i = 0; i < 60 && !(await page.locator('#winOverlay.on').count()); i++) {
    const s = await state();
    if (!s.active) { await page.waitForTimeout(300); continue; }
    if (s.locked) { await page.waitForTimeout(250); continue; }
    if (!s.tap) { await tapQuestion(); continue; }
    const pickIdx = wrongDone ? s.correct : (s.correct + 1) % s.n;
    await page.locator(`#answers .ans[data-v="${pickIdx}"]`).click();
    wrongDone = true;
    await page.waitForTimeout(400);
  }
  await expect(page.locator('#winOverlay.on')).toBeVisible({ timeout: 20_000 });

  /* 3. the mistake review explains the wrong answer */
  const mx = page.locator('#winSheet .mxbtn');
  await expect(mx).toBeVisible();
  await mx.click();
  await expect(page.locator('#mxOverlay.on .mx-item')).toHaveCount(1);
  await expect(page.locator('#mxOverlay.on .mx-why')).not.toBeEmpty();
  await page.locator('#mxOverlay.on [data-act="mxClose"]').last().click();
  await page.locator('#winOverlay.on [data-act="toMap"]').last().click();
  await expect(page.locator('#winOverlay.on')).toHaveCount(0);

  /* 4. the Parent Portal: create a code (twice), then the portal opens with the recovery question and problem log */
  await page.locator('#nav-parent').evaluate(b => b.click());
  for (const round of [1, 2]) {
    for (const d of '246813') await page.locator(`#tab-parent .keys [data-act="key"][data-v="${d}"]`).click();
    await page.waitForTimeout(400);
    void round;
  }
  await expect(page.locator('#tab-parent h1.title')).toHaveText(/Parent Portal/);
  await expect(page.locator('#recCard')).toBeVisible();
  await expect(page.locator('#tab-parent .crash-card')).toContainText(/No problems/);

  expect(errors, errors.join('\n')).toEqual([]);
});
