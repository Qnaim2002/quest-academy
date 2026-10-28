/* v37 browser checks: Learn in three steps, Play with a back arrow, the lock button, four bottom buttons. */
import { test, expect } from '@playwright/test';

const seed = (extra = {}) => ({ v: 5, lang: 'en', band: 2, welcomed: true, placed: true, coins: 100, sfx: false, music: false, pace: 'unlimited', why: false, tele: false, cine: false, talk: false, comics: {}, ...extra });
const boot = (page, st, tag) => page.addInitScript(([s, k]) => { if (sessionStorage.getItem(k)) return; localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); sessionStorage.setItem(k, '1'); }, [st, tag]);
const watch = (page) => { const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) errors.push(m.text()); }); return errors; };

test.describe('v37', () => {
  test('Learn: pick a subject, pick a lesson, press Go, close, and land on the lessons again', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa37a');
    await page.goto('/');
    await expect(page.locator('#nav-studies')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('.nav button:visible')).toHaveCount(5);
    await expect(page.locator('.v37-big')).toHaveCount(4);
    await expect(page.locator('[data-act="sage"]')).toHaveCount(0);
    await page.locator('[data-act="v37Subj"][data-v="math"]').click();
    await expect(page.locator('.v37-lesson')).toHaveCount(3);
    await expect(page.locator('.v37-lesson.next')).toHaveCount(1);
    await page.locator('.v37-lesson.next').click();
    await expect(page.locator('.v37-go')).toBeVisible();
    await page.locator('.v37-go').click();
    await expect(page.locator('#lessonOverlay.on')).toBeVisible();
    await page.locator('#lessonOverlay [data-act="closeLesson"]').first().click();
    await expect(page.locator('.v37-lesson').first()).toBeVisible();
    await page.locator('#tab-studies .v37-back').click();
    await expect(page.locator('.v37-big').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
  test('Lesson page: one step at a time, arrows move on, Finish closes', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed({ band: 3 }), 'qa37L');
    await page.goto('/');
    await page.locator('[data-act="v37Subj"][data-v="math"]').click();
    await page.locator('.v37-lesson.next').click();
    await page.locator('.v37-go').click();
    const sh = page.locator('#lessonSheet');
    await expect(sh).toHaveAttribute('data-v37', 'learn0');
    await expect(sh.locator('.v37-lnav .go')).toBeVisible();
    await expect(sh.locator('.lsteps:visible')).toHaveCount(0);
    await sh.locator('.v37-lnav .go').click();
    await expect(sh).toHaveAttribute('data-v37', 'learn');
    await sh.locator('.v37-lnav [data-act="v37Sb"]').click();
    await expect(sh).toHaveAttribute('data-v37', 'learn0');
    for (let i = 0; i < 20 && !(await sh.getAttribute('data-v37') === 'done'); i++) await sh.locator('.v37-lnav .go').click();
    await expect(sh).toHaveAttribute('data-v37', 'done');
    await expect(sh.locator('[data-act="lessonDone"]')).toBeVisible();
    await sh.locator('.v37-finish').click();
    await expect(page.locator('#lessonOverlay.on')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
  test('Learn: the games page opens a game', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa37b');
    await page.goto('/');
    for (let i = 0; i < 2; i++) await page.locator('[data-act="v37Pn"]').click();
    await page.locator('[data-act="v37Games"]').click();
    await page.locator('[data-act="actOpen"][data-v="notebook"]').click();
    await expect(page.locator('#lessonOverlay.on')).toBeVisible();
    expect(errors).toEqual([]);
  });
  test('Play: three buttons, each opens its screen with a back arrow, and the lock opens the Parents area', async ({ page }) => {
    const errors = watch(page);
    await boot(page, seed(), 'qa37c');
    await page.goto('/');
    await page.locator('#nav-play').click();
    await expect(page.locator('.v37-hub')).toHaveCount(3);
    for (const v of ['adventure', 'tower', 'kbat']) {
      await page.locator(`.v37-hub[data-v="${v}"]`).click();
      await expect(page.locator(`#tab-${v}.on`)).toBeVisible();
      await expect(page.locator('#nav-play')).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#v37Sub')).toBeVisible();
      await page.locator('#v37Sub .v37-back').click();
      await expect(page.locator('#tab-play.on')).toBeVisible();
    }
    await page.locator('#v37Lock').click();
    await expect(page.locator('#tab-parent.on')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
