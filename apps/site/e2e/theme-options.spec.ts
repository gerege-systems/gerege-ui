import { test, expect, type Locator, type Page } from '@playwright/test';
import { collectErrors, expectNoErrors, gotoHash } from './helpers';
import { BASE_COLORS, CHART_PALETTES, DEPTHS, STYLES } from '../src/showcase/theme/presets';
import { FONTS, MONO_FONTS } from '../src/showcase/theme/fonts';

/* -----------------------------------------------------------------------------
 *  Every option in every rail control, exercised through the UI, measured on
 *  the wall. A dropdown entry that writes the hash but moves nothing on the
 *  page is exactly the failure a unit test cannot see.
 * --------------------------------------------------------------------------- */

const SCOPE = '[data-brand-scope]';

/** What component-styles.css gives a control under each style. */
const STYLE_SHAPE: Record<string, { radius: string; height: number }> = {
  nova: { radius: '6px', height: 36 },
  vega: { radius: '0px', height: 36 },
  maia: { radius: '12px', height: 36 },
  lyra: { radius: '9999px', height: 36 },
  mira: { radius: '4.2px', height: 32 },
  luma: { radius: '10.2px', height: 40 },
  sera: { radius: '3px', height: 36 },
  rhea: { radius: '8.1px', height: 36 },
};

const PROBE = `
  <nav data-slot="pagination"><button class="size-8 rounded-md">1</button></nav>
  <button data-slot="button" class="h-9 rounded-md px-3.5">Probe</button>
  <span id="swatch"></span>
`;

async function injectProbe(page: Page) {
  await page.evaluate((html) => {
    document.getElementById('option-probe')?.remove();
    const host = document.querySelector('[data-brand-scope]');
    if (!host) throw new Error('theme wall scope not found');
    const div = document.createElement('div');
    div.id = 'option-probe';
    div.innerHTML = html;
    host.prepend(div);
  }, PROBE);
}

const rail = (page: Page) => page.locator('aside[aria-label="Theme controls"]');

async function optionNames(page: Page, trigger: Locator): Promise<string[]> {
  await trigger.click();
  const names = await page.getByRole('option').allTextContents();
  await page.keyboard.press('Escape');
  return names.map((n) => n.trim());
}

async function choose(page: Page, trigger: Locator, name: string) {
  await trigger.click();
  await page.getByRole('option', { name, exact: true }).click();
}

const scopeVar = (page: Page, name: string) =>
  page.$eval(
    SCOPE,
    (el, v) =>
      getComputedStyle(el as HTMLElement)
        .getPropertyValue(v)
        .trim(),
    name,
  );

const hashParam = (page: Page, key: string) =>
  page.evaluate((k) => new URLSearchParams(location.hash.split('?')[1] ?? '').get(k), key);

/**
 * Any CSS colour → `[r, g, b]` as the browser paints it. Through a canvas:
 * Chromium keeps `oklch()` as `oklch()` in computed style, so reading it
 * back from an element would not compare with a hex.
 */
const rgbOf = (page: Page, color: string) =>
  page.evaluate((c) => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
  }, color);

test.describe('theme rail options', () => {
  test('every Style reshapes the controls as its hint says', async ({ page }) => {
    await gotoHash(page, 'theme');
    const trigger = rail(page).getByLabel('Style', { exact: true });
    const labels = await optionNames(page, trigger);
    expect(labels).toEqual(STYLES.map((s) => s.label));
    for (const s of STYLES) {
      await choose(page, trigger, s.label);
      expect(await hashParam(page, 'st'), s.name).toBe(s.name === 'nova' ? null : s.name);
      await expect(page.locator(`[data-style="${s.name}"]`)).toHaveCount(1);
      await injectProbe(page);
      const shape = STYLE_SHAPE[s.name];
      expect(shape, `STYLE_SHAPE is missing ${s.name}`).toBeDefined();
      expect(
        await page.$eval(
          "#option-probe [data-slot='pagination'] button",
          (el) => getComputedStyle(el).borderRadius,
        ),
        `${s.name} radius`,
      ).toBe(shape.radius);
      expect(
        await page.$eval(
          "#option-probe [data-slot='button']",
          (el) => el.getBoundingClientRect().height,
        ),
        `${s.name} control height`,
      ).toBe(shape.height);
    }
  });

  test('every Base Color moves the neutrals in both modes', async ({ page }) => {
    await gotoHash(page, 'theme');
    const trigger = rail(page).getByLabel('Base Color', { exact: true });
    expect(await optionNames(page, trigger)).toEqual(BASE_COLORS.map((b) => b.label));
    for (const b of BASE_COLORS) {
      await choose(page, trigger, b.label);
      expect(await hashParam(page, 'bc')).toBe(b.name === 'slate' ? null : b.name);
      for (const [token, value] of Object.entries(b.tokens.light)) {
        expect(await scopeVar(page, `--${token}`), `${b.name} light --${token}`).toBe(value);
      }
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      for (const [token, value] of Object.entries(b.tokens.dark ?? {})) {
        expect(await scopeVar(page, `--${token}`), `${b.name} dark --${token}`).toBe(value);
      }
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
    }
  });

  test('every Accent paints the wall with the colour the HEX field shows, and passes AA', async ({
    page,
  }) => {
    await gotoHash(page, 'theme');
    const r = rail(page);
    const trigger = r.getByLabel('Accent', { exact: true });
    const labels = await optionNames(page, trigger);
    expect(labels.length).toBe(12);
    await injectProbe(page);
    for (const label of labels) {
      await choose(page, trigger, label);
      const hex = await r.getByLabel('HEX').inputValue();
      expect(hex, label).toMatch(/^#[0-9a-f]{6}$/);
      const accent = await scopeVar(page, '--accent');
      const painted = await rgbOf(page, accent || 'var(--accent)');
      const expected = await rgbOf(page, hex);
      painted.forEach((v, i) =>
        expect(Math.abs(v - expected[i]), `${label} channel ${i}`).toBeLessThanOrEqual(3),
      );
      await expect(r.getByText(/^Light:.*passes AA/)).toBeVisible();
      await expect(r.getByText(/^Dark:.*passes AA/)).toBeVisible();
    }
  });

  test('every Chart Color sets the six series', async ({ page }) => {
    await gotoHash(page, 'theme');
    const trigger = rail(page).getByLabel('Chart Color', { exact: true });
    expect(await optionNames(page, trigger)).toEqual(CHART_PALETTES.map((c) => c.label));
    for (const c of CHART_PALETTES) {
      await choose(page, trigger, c.label);
      expect(await hashParam(page, 'ch')).toBe(c.name === 'default' ? null : c.name);
      for (const [token, value] of Object.entries(c.tokens.light)) {
        expect(await scopeVar(page, `--${token}`), `${c.name} --${token}`).toBe(value);
      }
    }
  });

  test('every Depth lands on the wall as an attribute', async ({ page }) => {
    await gotoHash(page, 'theme');
    const trigger = rail(page).getByLabel('Depth', { exact: true });
    expect(await optionNames(page, trigger)).toEqual(DEPTHS.map((d) => d.label));
    for (const d of DEPTHS) {
      await choose(page, trigger, d.label);
      await expect(page.locator(`[data-depth="${d.name}"]`)).toHaveCount(1);
    }
  });

  test('every Radius step reaches the tokens; a shape-owning style disables them', async ({
    page,
  }) => {
    await gotoHash(page, 'theme');
    const r = rail(page);
    const expected: Record<string, string> = {
      None: '0px',
      Small: '4px',
      Medium: '6px',
      Large: '10px',
      Full: '9999px',
    };
    for (const [label, value] of Object.entries(expected)) {
      await r.getByRole('button', { name: label, exact: true }).click();
      expect(await scopeVar(page, '--radius-md'), label).toBe(value);
    }
    await r.getByRole('button', { name: 'Follow style', exact: true }).click();
    // Nothing set on the scope: the inherited library value shows through.
    expect(await scopeVar(page, '--radius-md')).toBe('6px');
    await choose(page, r.getByLabel('Style', { exact: true }), 'Vega');
    for (const label of Object.keys(expected)) {
      await expect(r.getByRole('button', { name: label, exact: true })).toBeDisabled();
    }
    await expect(r.getByText(/Vega sets its own shape/)).toBeVisible();
  });

  test('every font reaches the wall — body, headings and mono', async ({ page }) => {
    await gotoHash(page, 'theme');
    const r = rail(page);
    const family = (stack: string) => stack.split(',')[0].replace(/'/g, '').trim();
    const body = () => page.$eval(`${SCOPE} .font-sans`, (el) => getComputedStyle(el).fontFamily);
    const heading = () =>
      page.$eval(`${SCOPE} :is(h1,h2,h3,h4)`, (el) => getComputedStyle(el).fontFamily);
    const link = () =>
      page.evaluate(
        () =>
          (document.getElementById('theme-editor-fonts') as HTMLLinkElement | null)?.href ?? null,
      );

    const fontTrigger = r.getByLabel('Font font', { exact: true });
    expect(await optionNames(page, fontTrigger)).toEqual(FONTS.map((f) => f.label));
    for (const f of FONTS) {
      await choose(page, fontTrigger, f.label);
      expect(await body(), `${f.name} body`).toContain(family(f.stack));
      // Heading follows the body face unless a heading face is set (previewTokens alias).
      expect(await heading(), `${f.name} heading`).toContain(family(f.stack));
      if (f.google) expect(await link(), `${f.name} link`).toContain(f.google.replace(/ /g, '+'));
    }
    await choose(page, fontTrigger, 'Geist');

    const headingTrigger = r.getByLabel('Heading font', { exact: true });
    await choose(page, headingTrigger, 'Lora');
    expect(await heading()).toContain('Lora');
    expect(await body()).toContain('Geist');
    await choose(page, headingTrigger, 'Geist');

    const monoTrigger = r.getByLabel('Mono font', { exact: true });
    expect(await optionNames(page, monoTrigger)).toEqual(MONO_FONTS.map((f) => f.label));
    for (const f of MONO_FONTS) {
      await choose(page, monoTrigger, f.label);
      // The default is inherited from theme.css (quoted differently), so
      // compare by family rather than by the exact stack.
      expect(await scopeVar(page, '--font-mono'), f.name).toContain(family(f.stack));
    }
  });

  test('Get code hands over CSS the browser parses, for both setups', async ({ page }) => {
    const errors = collectErrors(page);
    await gotoHash(
      page,
      'theme?l=0.58&c=0.16&h=50&st=maia&dp=raised&bc=stone&ch=teal&r=10&fs=inter&fm=jetbrains-mono',
    );
    await rail(page).getByRole('button', { name: 'Get code' }).click();
    const dialog = page.getByRole('dialog');
    const parse = async () => {
      const css = await dialog.locator('pre').last().innerText();
      return page.evaluate((text) => {
        const body = text
          .split('\n')
          .filter((l) => !/^@(import|source)/.test(l))
          .join('\n');
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(body);
        return { rules: sheet.cssRules.length, text };
      }, css);
    };
    const tw = await parse();
    expect(tw.rules).toBeGreaterThanOrEqual(2); // :root + .dark
    expect(tw.text).toContain("@import 'tailwindcss'");
    expect(tw.text).toContain('data-style="maia"');
    expect(tw.text).toContain('data-depth="raised"');
    expect(tw.text).toContain('--radius-md: 10px');
    expect(tw.text).toContain("--font-sans: 'Inter'");
    await dialog.getByRole('button', { name: 'No Tailwind' }).click();
    const plain = await parse();
    expect(plain.text).toContain("@import '@gerege-systems/ui/styles.css'");
    expect(plain.text).not.toContain('tailwindcss');
    expect(plain.rules).toBe(tw.rules);
    await expectNoErrors(page, errors, 'light', test.info());
  });
});
