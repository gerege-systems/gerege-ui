import { test, expect, type Page } from '@playwright/test';
import { collectErrors, expectNoErrors, gotoHash } from './helpers';

/* -----------------------------------------------------------------------------
 *  The two attribute layers the library ships — `data-style` (shape) and
 *  `data-depth` (elevation) — as seen by the browser.
 *
 *  Both are plain CSS, so nothing below can be unit-tested: jsdom applies no
 *  stylesheet. The probe is a fragment injected into the theme page's preview
 *  scope, which is the one place both attributes are live; measuring computed
 *  values there keeps the test independent of which of the thirty blocks the
 *  shuffle happened to render.
 * --------------------------------------------------------------------------- */

const PROBE = `
  <div data-slot="checkbox-field"><span role="checkbox" class="rounded-sm size-4 border block"></span></div>
  <nav data-slot="pagination"><button class="size-8 rounded-md">1</button></nav>
  <div data-slot="table-container" class="rounded-lg border"><table data-slot="table"></table></div>
  <div data-slot="progress" class="rounded-full h-1 w-40"></div>
  <div data-slot="timeline-bullet" class="rounded-full size-6 border"></div>
  <span data-slot="slider-thumb" class="rounded-full size-4 border-2 block"></span>
  <div data-slot="tabs-list" data-variant="pills" class="rounded-lg p-1 inline-flex">
    <button role="tab" class="rounded-md px-3">Tab</button>
  </div>
  <div role="menuitem" class="rounded-sm px-2">Row</div>
  <span role="radio" class="rounded-full size-4 border block"></span>
  <div data-slot="card" class="rounded-lg border shadow-md p-4">Card</div>
  <div data-slot="popover-content" class="rounded-lg border shadow-lg p-4">Popover</div>
`;

/** Inject the probe into the preview scope — the subtree both attributes sit on. */
async function injectProbe(page: Page) {
  await page.evaluate((html) => {
    const host = document.querySelector('[data-style]');
    if (!host) throw new Error('theme page preview scope not found');
    const div = document.createElement('div');
    div.id = 'layer-probe';
    div.innerHTML = html;
    host.prepend(div);
  }, PROBE);
}

const radius = (page: Page, selector: string) =>
  page.$eval(`#layer-probe ${selector}`, (el) => getComputedStyle(el).borderRadius);

test.describe('style layer', () => {
  test('nova leaves the library defaults alone', async ({ page }) => {
    await gotoHash(page, 'theme');
    await injectProbe(page);
    expect(await radius(page, "[data-slot='pagination'] button")).toBe('6px');
    expect(await radius(page, "[data-slot='table-container']")).toBe('8px');
  });

  test('vega squares every shape it owns — but not the radio', async ({ page }) => {
    await gotoHash(page, 'theme?st=vega');
    await injectProbe(page);
    for (const sel of [
      "[data-slot='checkbox-field'] [role=checkbox]",
      "[data-slot='pagination'] button",
      "[data-slot='table-container']",
      "[data-slot='progress']",
      "[data-slot='timeline-bullet']",
      "[data-slot='slider-thumb']",
      "[data-slot='tabs-list']",
      '[role=tab]',
      '[role=menuitem]',
    ]) {
      expect(await radius(page, sel), sel).toBe('0px');
    }
    // Round-vs-square is how a radio is told from a checkbox: not a style's call.
    expect(await radius(page, '[role=radio]')).toBe('9999px');
  });

  test('lyra pills the controls but caps the marks', async ({ page }) => {
    await gotoHash(page, 'theme?st=lyra');
    await injectProbe(page);
    expect(await radius(page, "[data-slot='pagination'] button")).toBe('9999px');
    expect(await radius(page, '[role=tab]')).toBe('9999px');
    // A pill checkbox would read as a radio, so the mark radius is capped.
    expect(await radius(page, "[data-slot='checkbox-field'] [role=checkbox]")).toBe('4px');
    expect(await radius(page, '[role=menuitem]')).toBe('4px');
  });
});

test.describe('depth layer', () => {
  const shadow = (page: Page, selector: string) =>
    page.$eval(`#layer-probe ${selector}`, (el) => getComputedStyle(el).boxShadow);

  test('flat removes the floating shadows, deep strengthens them', async ({ page }) => {
    await gotoHash(page, 'theme');
    await injectProbe(page);
    const softCard = await shadow(page, "[data-slot='card']");
    expect(softCard).toContain('rgba(0, 0, 0, 0.06)');

    await gotoHash(page, 'theme?dp=flat');
    await injectProbe(page);
    // Every layer is still listed, but none of them paints: alpha 0 throughout.
    const opaque = /rgba\(0, 0, 0, 0\.\d/;
    expect(await shadow(page, "[data-slot='card']")).not.toMatch(opaque);
    expect(await shadow(page, "[data-slot='popover-content']")).not.toMatch(opaque);

    await gotoHash(page, 'theme?dp=deep');
    await injectProbe(page);
    expect(await shadow(page, "[data-slot='card']")).toContain('rgba(0, 0, 0, 0.16)');
    expect(await shadow(page, "[data-slot='popover-content']")).toContain('rgba(0, 0, 0, 0.2)');
  });
});

test.describe('theme rail', () => {
  test('every axis is the same dropdown, and each one writes the hash', async ({ page }) => {
    const errors = collectErrors(page);
    await gotoHash(page, 'theme');
    const rail = page.locator('aside[aria-label="Theme controls"]');
    for (const label of ['Style', 'Base Color', 'Accent', 'Chart Color', 'Depth']) {
      await expect(rail.getByLabel(label, { exact: true })).toBeVisible();
    }

    await rail.getByLabel('Depth', { exact: true }).click();
    await page.getByRole('option', { name: 'Raised', exact: true }).click();
    await expect.poll(() => page.evaluate(() => location.hash)).toContain('dp=raised');
    await expect(page.locator('[data-depth="raised"]')).toHaveCount(1);

    // Style and Depth move no tokens, so Reset has to survive on them alone.
    await expect(rail.getByRole('button', { name: 'Reset' })).toBeVisible();
    await expectNoErrors(page, errors, 'light', test.info());
  });
});

test.describe('theme rail owns the accent', () => {
  test('the top-bar brand stays off the wall, and the switcher is gone', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('brand', 'violet'));
    await gotoHash(page, 'theme');
    // The stored brand still reaches every other page…
    await expect(page.getByRole('button', { name: /Accent colour/ })).toHaveCount(0);
    // …but on #theme <html> carries no data-accent, so the wall shows the
    // library default the rail reports.
    await expect
      .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-accent')))
      .toBeNull();
    const wallAccent = await page.$eval('[data-brand-scope]', (el) =>
      getComputedStyle(el).getPropertyValue('--accent').trim(),
    );
    // theme.css says hsl(238 50% 49%); the build serialises it as its hex.
    expect(['hsl(238 50% 49%)', '#3e43bb']).toContain(wallAccent);
    await gotoHash(page, 'components');
    await expect(page.getByRole('button', { name: /Accent colour/ })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-accent')))
      .toBe('violet');
  });

  test('the HEX field takes a value one keystroke at a time', async ({ page }) => {
    await gotoHash(page, 'theme');
    const hex = page.locator('aside[aria-label="Theme controls"]').getByLabel('HEX');
    await hex.fill('');
    await hex.pressSequentially('#0076d2');
    await expect(hex).toHaveValue('#0076d2');
    await expect.poll(() => page.evaluate(() => location.hash)).toContain('h=');
  });

  test('a body font change reaches headings on the wall', async ({ page }) => {
    await gotoHash(page, 'theme?fs=inter');
    const heading = await page.$eval(
      '[data-brand-scope] :is(h1,h2,h3,h4)',
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(heading).toContain('Inter');
  });
});
