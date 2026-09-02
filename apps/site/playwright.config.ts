import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;
const PORT = 4173;

/**
 * Showcase E2E. Runs against the production build served by `vite preview`
 * (`pnpm --filter @gerege/site build` first). Chromium only — the bundled
 * headless shell renders 320/375px viewports faithfully (headed Chrome clamps
 * the window to ≥500px).
 *
 * Visual snapshots are platform-specific (font rasterisation), so baselines are
 * keyed by platform; CI skips visual.spec.ts unless CI_VISUAL=1 (see e2e/README).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // GitHub hosted runners have 4 vCPUs; the suite is network-free so 4 is safe.
  workers: CI ? 4 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  reporter: CI
    ? [['list'], ['html', { open: 'never' }], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{projectName}-{platform}/{testFileName}/{arg}{ext}',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'en-US',
    timezoneId: 'UTC',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm --filter @gerege/site preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 60_000,
  },
});
