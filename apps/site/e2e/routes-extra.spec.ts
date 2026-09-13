import { test, expect, type Page } from '@playwright/test';
import { applyTheme, collectErrors, expectNoErrors, gotoHash } from './helpers';
import { VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Showcase routing behaviour the per-page matrices do not see: the blocks
 *  pages and the 404, the skip link, the theme editor's share-link round trip,
 *  scroll restoration on back/forward, and a crawl of every internal link on
 *  the index pages. Everything is asserted on behaviour (landmarks, text, URL,
 *  focus, scroll position), not on markup.
 * --------------------------------------------------------------------------- */

const main = (page: Page) => page.locator('main#main');
const notFound = (page: Page) => page.getByText('Page not found', { exact: true });
// The router titles the 404 route; the text alone is not a signal, because the
// ErrorState docs page legitimately shows a "Page not found" demo.
const NOT_FOUND_TITLE = /^Page not found/;

/**
 * Boot the app on a hash and wait for its landmark only. `gotoHash` also
 * waits for an <h1>, which the 404 page does not render (its ErrorState title
 * is an h3) — so anything that may land on the 404 goes through here.
 */
async function visitFresh(page: Page, hash: string) {
  await page.goto('about:blank');
  await page.goto(`/${hash ? `#${hash}` : ''}`);
  await expect(page.locator('main, [role=main]').first()).toBeVisible({ timeout: 20_000 });
  // The route effect retitles the document once the route has rendered — the
  // static title from index.html means the app has not reached it yet.
  await expect.poll(() => page.title()).not.toMatch(/design system$/);
  await page.evaluate(() => document.fonts.ready);
}

test.describe('blocks + not-found', () => {
  test.use({ viewport: VIEWPORTS.lg });

  test('#blocks renders <main id="main"> with the block wall', async ({ page }, info) => {
    await applyTheme(page, 'light');
    const errors = collectErrors(page);
    await gotoHash(page, 'blocks');
    await expect(main(page)).toBeVisible();
    await expect(main(page)).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: 'Blocks' })).toBeVisible();
    // Every block is a live section with its own heading; the wall has dozens.
    expect(await main(page).locator('section').count()).toBeGreaterThanOrEqual(10);
    expect(await main(page).getByRole('heading', { level: 2 }).count()).toBeGreaterThanOrEqual(10);
    await expect(notFound(page)).toHaveCount(0);
    await expectNoErrors(page, errors, 'light', info);
  });

  test('#blocks/kpi-row renders <main id="main"> and the block', async ({ page }, info) => {
    await applyTheme(page, 'light');
    const errors = collectErrors(page);
    await gotoHash(page, 'blocks/kpi-row');
    await expect(main(page)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'KPI row' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'All blocks' })).toHaveAttribute('href', '#blocks');
    // The preview tab is the default and shows the block itself, not a stub.
    const preview = page.getByRole('tabpanel');
    await expect(preview).toBeVisible();
    expect((await preview.innerText()).trim().length).toBeGreaterThan(0);
    await expect(notFound(page)).toHaveCount(0);
    await expectNoErrors(page, errors, 'light', info);
  });

  test('an unknown route renders the 404 page with a working "Back to overview"', async ({
    page,
  }, info) => {
    await applyTheme(page, 'light');
    const errors = collectErrors(page);
    await visitFresh(page, 'nope/xyz');
    await expect(main(page)).toBeVisible();
    await expect(notFound(page)).toBeVisible();
    await expect(page).toHaveTitle(NOT_FOUND_TITLE);

    await page.getByRole('link', { name: 'Back to overview' }).click();
    await expect(page).toHaveURL(/\/#?$/);
    await expect(notFound(page)).toHaveCount(0);
    await expect(main(page)).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page).not.toHaveTitle(NOT_FOUND_TITLE);
    await expectNoErrors(page, errors, 'light', info);
  });
});

test.describe('skip link', () => {
  test.use({ viewport: VIEWPORTS.lg });

  for (const hash of ['blocks', 'theme']) {
    test(`#${hash}: first Tab lands on "Skip to content"; activating it focuses #main`, async ({
      page,
    }) => {
      await applyTheme(page, 'light');
      await gotoHash(page, hash);
      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: 'Skip to content' });
      await expect(skip).toBeFocused();
      await expect(skip).toBeVisible();

      await page.keyboard.press('Enter');
      await expect(main(page)).toBeFocused();
      // The skip link is handled in JS: the address bar must not turn into a
      // `#main` route (which the router would read as a 404).
      await expect(page).toHaveURL(new RegExp(`#${hash}(\\?|$)`));
      await expect(notFound(page)).toHaveCount(0);
    });
  }
});

test.describe('theme share link', () => {
  test.use({ viewport: VIEWPORTS.lg });

  const rail = (page: Page) => page.locator('aside[aria-label="Theme controls"]');
  const hash = (page: Page) => page.evaluate(() => location.hash);

  test('survives a reload and a bare #theme navigation', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'theme?l=0.5&c=0.1&h=200');
    const hex = rail(page).getByLabel('HEX');
    await expect(hex).toHaveValue(/^#[0-9a-f]{6}$/);
    const hexValue = await hex.inputValue();
    const shared = await hash(page);
    expect(shared).toMatch(/^#theme\?/);
    for (const kv of ['l=0.5', 'c=0.1', 'h=200']) expect(shared).toContain(kv);

    await page.reload();
    await expect(main(page)).toBeVisible();
    await expect(rail(page).getByLabel('HEX')).toHaveValue(hexValue);
    expect(await hash(page)).toBe(shared);

    // The top-bar link is a bare `#theme`: navigation, not a theme — the
    // editor keeps its state and puts the parameterised hash back.
    await page.evaluate(() => {
      location.hash = '#theme';
    });
    await expect.poll(() => hash(page)).toBe(shared);
    await expect(rail(page).getByLabel('HEX')).toHaveValue(hexValue);
  });
});

test.describe('history keeps scroll', () => {
  test.use({ viewport: VIEWPORTS.lg });

  const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

  test('#blocks → #blocks/kpi-row → back restores the wall position', async ({ page }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'blocks');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect.poll(() => scrollY(page)).toBeGreaterThanOrEqual(1100);

    await page.evaluate(() => {
      location.hash = '#blocks/kpi-row';
    });
    await expect(page.getByRole('heading', { level: 1, name: 'KPI row' })).toBeVisible();
    await expect.poll(() => scrollY(page)).toBe(0);

    await page.goBack();
    await expect(page).toHaveURL(/#blocks$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Blocks' })).toBeVisible();
    await expect.poll(() => scrollY(page), { timeout: 5_000 }).toBeGreaterThanOrEqual(1100);
  });
});

test.describe('internal links resolve', () => {
  test.use({ viewport: VIEWPORTS.lg });
  // ~170 distinct targets, each booted fresh.
  test.setTimeout(300_000);

  const SOURCES = ['', 'components', 'blocks', 'templates', 'guides'];

  test('every href="#…" on the index pages leads to a page, not the 404', async ({ page }) => {
    await applyTheme(page, 'light');
    const targets = new Set<string>();
    for (const source of SOURCES) {
      await gotoHash(page, source);
      const hrefs = await page
        .locator('a[href^="#"]')
        .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!));
      for (const href of hrefs) {
        // The skip link is JS-handled (App.tsx SkipLink), never navigated.
        if (href === '#main') continue;
        targets.add(href.slice(1));
      }
    }
    expect(targets.size).toBeGreaterThan(50);

    const broken: string[] = [];
    for (const target of [...targets].sort()) {
      await visitFresh(page, target);
      if (NOT_FOUND_TITLE.test(await page.title())) broken.push(`#${target} → 404`);
    }
    expect(broken, `${broken.length} of ${targets.size} internal links are broken`).toEqual([]);
  });
});
