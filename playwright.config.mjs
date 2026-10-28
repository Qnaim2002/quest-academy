/* v31: browser smoke test (npm run e2e). It builds the game, serves it on port 4179 and plays it in Chromium on a
   computer-sized and a phone-sized screen. One-time setup on a new computer: npx playwright install chromium */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4179', trace: 'retain-on-failure' },
  webServer: { command: 'npm run build && npx vite preview --port 4179 --strictPort', url: 'http://localhost:4179', reuseExistingServer: !process.env.CI, timeout: 180_000 },
  projects: [
    { name: 'computer', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } }
  ]
});
