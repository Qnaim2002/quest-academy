/* v34: low-end phone test (npm run e2e). The page is slowed to 4x (like a cheap Android phone) and we measure
   how fast it starts and how smooth a battle is. The limits are generous so only a real slow-down fails. */
import { test, expect } from '@playwright/test';

const SAVE = { v: 4, lang: 'en', band: 3, welcomed: true, coins: 100, sfx: false, music: false, pixel: true };

test.describe('low-end phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'the phone project only');

  test('starts quickly and stays smooth in a battle (4x slower CPU)', async ({ page, context }) => {
    test.setTimeout(120_000);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript((s) => { localStorage.clear(); localStorage.setItem('quest-academy-v4', JSON.stringify(s)); }, SAVE);
    const t0 = Date.now();
    await page.goto('/');
    await page.waitForSelector('#nav-adventure', { state: 'attached', timeout: 30_000 });
    const startMs = Date.now() - t0;
    expect(startMs, 'time until the menu shows (ms)').toBeLessThan(12_000);

    await page.evaluate(() => { window.__quest.showTab('adventure', true); window.__quest.startBattle('math:3'); });
    await page.waitForSelector('#stage', { timeout: 20_000 });
    await page.waitForTimeout(1500);
    /* frame times over 4 seconds of a running battle */
    const f = await page.evaluate(() => new Promise((done) => {
      const dts = []; let last = performance.now(); const end = last + 4000;
      const step = (now) => { dts.push(now - last); last = now; now < end ? requestAnimationFrame(step) : done(dts); };
      requestAnimationFrame(step);
    }));
    f.shift();
    const sorted = [...f].sort((a, b) => a - b), median = sorted[Math.floor(sorted.length / 2)], p95 = sorted[Math.floor(sorted.length * 0.95)];
    const longFrames = f.filter((d) => d > 200).length;
    console.log(`start ${startMs} ms · frames ${f.length} · median ${median.toFixed(1)} ms · p95 ${p95.toFixed(1)} ms · >200ms: ${longFrames}`);
    expect(median, 'median frame time (ms)').toBeLessThan(40);   // about 25 frames a second or better
    expect(p95, '95th percentile frame time (ms)').toBeLessThan(120);
    expect(longFrames, 'frames longer than 200 ms').toBeLessThanOrEqual(3);
  });
});
