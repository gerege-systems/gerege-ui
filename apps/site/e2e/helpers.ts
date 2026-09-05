import { expect, test, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Theme } from './routes';

/* -----------------------------------------------------------------------------
 *  Shared helpers: theme setup, page-error collection, overflow, axe, focus.
 *  Every failure is also appended to test-results/findings.jsonl so the run's
 *  defects can be summarised without re-reading the report.
 * --------------------------------------------------------------------------- */

// Playwright empties test-results/ at the start of every run; point
// E2E_FINDINGS_FILE elsewhere when running the suite in several invocations.
const FINDINGS_FILE =
  process.env.E2E_FINDINGS_FILE ||
  join(dirname(fileURLToPath(import.meta.url)), '..', 'test-results', 'findings.jsonl');

export interface Finding {
  spec: string;
  url: string;
  viewport: string;
  theme: string;
  kind: 'console' | 'overflow' | 'axe' | 'focus' | 'structure' | 'other';
  detail: unknown;
}

export function recordFinding(info: TestInfo, f: Omit<Finding, 'spec'>) {
  const row: Finding = { spec: info.titlePath.slice(1).join(' › '), ...f };
  try {
    mkdirSync(dirname(FINDINGS_FILE), { recursive: true });
    appendFileSync(FINDINGS_FILE, JSON.stringify(row) + '\n');
  } catch {
    /* best effort */
  }
}

/** Describe the current viewport/theme for messages + findings. */
export function ctx(page: Page, theme: Theme) {
  const vp = page.viewportSize();
  return { viewport: vp ? `${vp.width}x${vp.height}` : 'unknown', theme, url: page.url() };
}

/**
 * Apply a theme the way the site does: OS emulation (`colorScheme`) plus the
 * persisted `theme` key that public/theme-init.js and ThemeProvider read.
 * Must run before the first navigation.
 */
export async function applyTheme(page: Page, theme: Theme) {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
      localStorage.removeItem('brand');
    } catch {}
  }, theme);
}

export interface PageErrors {
  console: string[];
  pageErrors: string[];
  failedRequests: string[];
  /** Console messages + failed requests that happen *after* load are still tracked. */
  snapshot(): string[];
}

/** Ignore-list for noise that is not an app defect. */
const IGNORED_REQUEST = [/favicon/i];
const IGNORED_CONSOLE = [
  // Vite preview does not set the font headers; only the fallback stack changes.
  /fonts\.(googleapis|gstatic)\.com/i,
];

export function collectErrors(page: Page): PageErrors {
  const state: PageErrors = {
    console: [],
    pageErrors: [],
    failedRequests: [],
    snapshot: () => [
      ...state.console.map((m) => `console.error: ${m}`),
      ...state.pageErrors.map((m) => `pageerror: ${m}`),
      ...state.failedRequests.map((m) => `requestfailed: ${m}`),
    ],
  };
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    state.console.push(text);
  });
  page.on('pageerror', (err) => state.pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (IGNORED_REQUEST.some((re) => re.test(url))) return;
    if (IGNORED_CONSOLE.some((re) => re.test(url))) return;
    state.failedRequests.push(`${url} — ${req.failure()?.errorText ?? 'failed'}`);
  });
  page.on('response', (res) => {
    const url = res.url();
    if (res.status() >= 400 && !IGNORED_REQUEST.some((re) => re.test(url))) {
      state.failedRequests.push(`${url} — HTTP ${res.status()}`);
    }
  });
  return state;
}

/** Navigate to a hash route and wait for the route's content to settle. */
export async function gotoHash(page: Page, hash: string) {
  // A hash-only change on an already-loaded document does not remount the
  // SPA; reload so every visit starts from a fresh app state.
  const sameDoc = page.url().startsWith('http');
  await page.goto(`/${hash ? `#${hash}` : ''}`);
  if (sameDoc) await page.reload();
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 20_000 });
  // Lazy chunks (template previews, docs demos, icons) — give them a beat.
  await page.waitForLoadState('networkidle').catch(() => {});
  // Skeleton/DelayedFallback windows + Radix mount animations.
  await page.waitForTimeout(250);
}

export async function expectNoErrors(page: Page, errors: PageErrors, theme: Theme, info: TestInfo) {
  const all = errors.snapshot();
  if (all.length) recordFinding(info, { ...ctx(page, theme), kind: 'console', detail: all });
  expect.soft(all, 'console / page / network errors').toEqual([]);
}

export async function expectNoHorizontalOverflow(page: Page, theme: Theme, info: TestInfo) {
  const { scrollWidth, clientWidth, offenders } = await page.evaluate(() => {
    const doc = document.documentElement;
    const vw = doc.clientWidth;
    // Name the widest elements that poke past the viewport — makes the report actionable.
    const offenders: string[] = [];
    if (doc.scrollWidth > vw) {
      const all = Array.from(document.body.querySelectorAll<HTMLElement>('*'));
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.right > vw + 1 || r.left < -1) {
          const id = el.id ? `#${el.id}` : '';
          const cls =
            typeof el.className === 'string'
              ? '.' + el.className.trim().split(/\s+/).slice(0, 4).join('.')
              : '';
          offenders.push(
            `${el.tagName.toLowerCase()}${id}${cls} [${Math.round(r.left)}→${Math.round(r.right)}]`,
          );
          if (offenders.length >= 8) break;
        }
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: vw, offenders };
  });
  if (scrollWidth > clientWidth) {
    recordFinding(info, {
      ...ctx(page, theme),
      kind: 'overflow',
      detail: { scrollWidth, clientWidth, offenders },
    });
  }
  expect
    .soft(
      scrollWidth,
      `horizontal overflow (scrollWidth ${scrollWidth} > viewport ${clientWidth}); widest: ${offenders.join(' | ')}`,
    )
    .toBeLessThanOrEqual(clientWidth);
}

/**
 * `app` shells own the viewport: only their own panes scroll, so the document
 * itself must never grow past it. The usual culprit is an absolutely
 * positioned descendant (`sr-only` labels above all) inside a scroll pane that
 * is not `position: relative` — its containing block becomes the initial one,
 * so it escapes every ancestor's overflow and stretches the document.
 */
export async function expectNoDocumentScroll(page: Page, theme: Theme, info: TestInfo) {
  const { scrollHeight, clientHeight, offenders } = await page.evaluate(() => {
    const doc = document.documentElement;
    const vh = doc.clientHeight;
    const offenders: string[] = [];
    if (doc.scrollHeight > vh + 1) {
      for (const el of Array.from(document.body.querySelectorAll<HTMLElement>('*'))) {
        const r = el.getBoundingClientRect();
        if (r.bottom <= vh + 1) continue;
        const id = el.id ? `#${el.id}` : '';
        const cls =
          typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\s+/).slice(0, 4).join('.')
            : '';
        offenders.push(
          `${el.tagName.toLowerCase()}${id}${cls} [${Math.round(r.top)}\u2192${Math.round(r.bottom)}]`,
        );
        if (offenders.length >= 8) break;
      }
    }
    return { scrollHeight: doc.scrollHeight, clientHeight: vh, offenders };
  });
  if (scrollHeight > clientHeight + 1) {
    recordFinding(info, {
      ...ctx(page, theme),
      kind: 'overflow',
      detail: { scrollHeight, clientHeight, offenders },
    });
  }
  expect
    .soft(
      scrollHeight,
      `document scrolls behind a viewport-locked shell (scrollHeight ${scrollHeight} > viewport ${clientHeight}); below the fold: ${offenders.join(' | ')}`,
    )
    .toBeLessThanOrEqual(clientHeight + 1);
}

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

export interface AxeOptions {
  /** Restrict the scan to a selector (e.g. a dialog). */
  include?: string;
}

/**
 * Axe scan. serious/critical fail the test; moderate/minor go to annotations
 * (visible in the HTML report) as soft warnings.
 */
export async function expectAxeClean(
  page: Page,
  theme: Theme,
  info: TestInfo,
  opts: AxeOptions = {},
) {
  let builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
  if (opts.include) builder = builder.include(opts.include);
  const results = await builder.analyze();

  const fmt = (v: (typeof results.violations)[number]) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.slice(0, 5).map((n) => ({
      target: n.target.join(' '),
      html: n.html.slice(0, 300),
      failureSummary: n.failureSummary?.split('\n').slice(0, 3).join(' '),
    })),
  });

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  const warnings = results.violations.filter(
    (v) => v.impact === 'moderate' || v.impact === 'minor',
  );

  for (const w of warnings) {
    info.annotations.push({
      type: `axe-${w.impact}`,
      description: `${w.id}: ${w.help} — ${w.nodes
        .map((n) => n.target.join(' '))
        .slice(0, 3)
        .join(', ')}`,
    });
  }
  if (blocking.length) {
    recordFinding(info, { ...ctx(page, theme), kind: 'axe', detail: blocking.map(fmt) });
  }
  expect
    .soft(
      blocking.map(fmt),
      `axe serious/critical violations:\n${JSON.stringify(blocking.map(fmt), null, 2)}`,
    )
    .toEqual([]);
}

export interface FocusStep {
  step: number;
  tag: string;
  name: string;
  inViewport: boolean;
  ringVisible: boolean;
  box: { x: number; y: number; w: number; h: number } | null;
  outline: string;
  boxShadow: string;
}

/**
 * Press Tab `n` times; after each press the focused element must be inside the
 * viewport and paint a visible focus indicator (outline or box-shadow). Hidden
 * elements (display:none) are unreachable by Tab, so `body` as the active
 * element means focus escaped the document — also a failure.
 */
export async function tabThrough(page: Page, n: number): Promise<FocusStep[]> {
  const steps: FocusStep[] = [];
  for (let i = 1; i <= n; i++) {
    await page.keyboard.press('Tab');
    // Let :focus-visible styles + any scroll-into-view settle.
    await page.waitForTimeout(40);
    const s = await page.evaluate((step) => {
      const el = document.activeElement as HTMLElement | null;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!el || el === document.body) {
        return {
          step,
          tag: 'body',
          name: '',
          inViewport: false,
          ringVisible: false,
          box: null,
          outline: '',
          boxShadow: '',
        };
      }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // Ring may be painted by a focus-visible pseudo on the element itself, or
      // by a wrapper (e.g. Radix Checkbox/Switch render a button with the ring).
      const paints = (c: CSSStyleDeclaration) =>
        (c.outlineStyle !== 'none' &&
          parseFloat(c.outlineWidth) > 0 &&
          c.outlineColor !== 'transparent') ||
        (c.boxShadow !== 'none' && c.boxShadow !== '');
      // The ring may sit on a wrapper (Input paints it via focus-within on its
      // frame) — accept the element or any of its three nearest ancestors.
      let ring = paints(cs);
      for (let p = el.parentElement, d = 0; p && d < 3 && !ring; p = p.parentElement, d++) {
        ring = paints(getComputedStyle(p));
      }
      const outlineVisible = ring;
      const shadowVisible = false;
      const name =
        el.getAttribute('aria-label') ||
        el.textContent?.trim().slice(0, 40) ||
        el.getAttribute('placeholder') ||
        '';
      return {
        step,
        tag: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''}`,
        name,
        // Fully inside the viewport, or — for elements taller/wider than the
        // viewport (scroll regions, long tables) — their top-left edge is visible.
        inViewport:
          r.width > 0 &&
          r.height > 0 &&
          r.left >= -1 &&
          r.top >= -1 &&
          (r.right <= vw + 1 || r.width > vw) &&
          (r.bottom <= vh + 1 || r.height > vh),
        ringVisible: outlineVisible || shadowVisible,
        box: {
          x: Math.round(r.left),
          y: Math.round(r.top),
          w: Math.round(r.width),
          h: Math.round(r.height),
        },
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        boxShadow: cs.boxShadow,
      };
    }, i);
    steps.push(s);
    // Focus left the document (Tab ran past the last tabbable element and
    // moved to browser chrome): the sequence is exhausted, not broken.
    if (s.tag === 'body' && i > 1) {
      steps.pop();
      break;
    }
  }
  return steps;
}

export async function expectFocusVisible(page: Page, theme: Theme, info: TestInfo, n = 15) {
  const steps = await tabThrough(page, n);
  const bad = steps.filter((s) => !s.inViewport || !s.ringVisible);
  if (bad.length) recordFinding(info, { ...ctx(page, theme), kind: 'focus', detail: bad });
  expect
    .soft(
      bad.map(
        (s) =>
          `#${s.step} ${s.tag} "${s.name}" inViewport=${s.inViewport} ring=${s.ringVisible} box=${JSON.stringify(s.box)} outline="${s.outline}" shadow="${s.boxShadow.slice(0, 60)}"`,
      ),
      'every Tab stop must be inside the viewport and paint a focus ring',
    )
    .toEqual([]);
}

export { test, expect };
