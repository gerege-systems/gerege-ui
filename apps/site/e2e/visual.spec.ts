import { test, expect } from '@playwright/test';
import { gotoHash, applyTheme } from './helpers';
import { THEMES, VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Visual baselines: home, one admin page, landing × 1280/375 × light/dark.
 *  Baselines live in e2e/__screenshots__/<project>-<platform>/ and are
 *  rasterised per OS, so they are only comparable on the platform that
 *  generated them. CI skips this spec unless CI_VISUAL=1 (see e2e/README.md).
 *  Regenerate: pnpm --filter @gerege-systems/site test:e2e visual --update-snapshots
 * --------------------------------------------------------------------------- */

test.skip(
  !!process.env.CI && !process.env.CI_VISUAL,
  'visual baselines are per-platform; set CI_VISUAL=1 to compare in CI',
);

const PAGES = [
  { name: 'home', hash: '' },
  { name: 'admin-overview', hash: 'preview/admin/app/sidebar/overview' },
  { name: 'landing', hash: 'preview/landing/home' },
] as const;

for (const [vpName, viewport] of [
  ['1280', VIEWPORTS.lg],
  ['375', VIEWPORTS.sm],
] as const) {
  for (const theme of THEMES) {
    test.describe(`visual @${vpName} ${theme}`, () => {
      test.use({ viewport });
      for (const p of PAGES) {
        test(p.name, async ({ page }) => {
          await applyTheme(page, theme);
          await gotoHash(page, p.hash);
          await page.evaluate(() => document.fonts.ready);
          await expect(page).toHaveScreenshot(`${p.name}-${vpName}-${theme}.png`, {
            fullPage: p.hash !== 'preview/admin/app/sidebar/overview',
            maxDiffPixelRatio: 0.02,
            // Charts/relative times tick; mask the admin's live bits.
            mask: [
              page.locator('time'),
              page.locator('[data-chart], canvas, svg.recharts-surface'),
            ],
          });
        });
      }
    });
  }
}
