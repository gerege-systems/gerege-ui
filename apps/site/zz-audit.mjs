import { chromium } from 'playwright';
import fs from 'node:fs';

const OUT =
  '/private/tmp/claude-501/-Users-bayarsaikhan/cd8da25a-c392-457c-9760-0b671b3aea19/scratchpad/audit';
const slugs = process.argv.slice(2);
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 375, height: 812 },
];

const probe = () => {
  const res = {
    title: document.title,
    bodyText: document.body.innerText.slice(0, 200),
    notFound: false,
    docOverflow: null,
    examples: [],
  };
  res.notFound = /page not found|404/i.test(document.body.innerText.slice(0, 500));
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth)
    res.docOverflow = { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth };

  // preview surfaces: container has a tab bar with buttons "Preview"/"Code"
  const surfaces = [];
  document.querySelectorAll('button[aria-pressed]').forEach((b) => {
    if (b.textContent.trim() !== 'Preview') return;
    const bar = b.parentElement;
    const container = bar.parentElement;
    const surface = bar.nextElementSibling;
    if (surface) surfaces.push({ container, surface });
  });

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return (
      r.width > 0 &&
      r.height > 0 &&
      cs.visibility !== 'hidden' &&
      cs.display !== 'none' &&
      cs.opacity !== '0'
    );
  };

  surfaces.forEach(({ surface }, i) => {
    // heading: nearest preceding h3/h2 outside container
    let heading = '';
    let n = surface.closest('div');
    let p = surface.parentElement;
    while (p && !heading) {
      let s = p.previousElementSibling;
      while (s) {
        const h = s.matches?.('h1,h2,h3,h4') ? s : s.querySelector?.('h1,h2,h3,h4');
        if (h) {
          heading = h.textContent.trim();
          break;
        }
        s = s.previousElementSibling;
      }
      p = p.parentElement;
    }
    const sr = surface.getBoundingClientRect();
    const item = {
      index: i,
      heading,
      height: Math.round(sr.height),
      width: Math.round(sr.width),
      empty: false,
      innerOverflow: [],
      escaped: [],
    };
    const kids = Array.from(surface.children);
    const visKids = kids.filter(visible);
    if (sr.height === 0 || visKids.length === 0) {
      item.empty = true;
      item.debug = {
        childCount: kids.length,
        innerHTMLLen: surface.innerHTML.length,
        text: surface.innerText.trim().slice(0, 80),
      };
    }
    if (surface.scrollWidth > surface.clientWidth + 2) {
      item.innerOverflow.push({
        sel: 'SURFACE',
        scrollWidth: surface.scrollWidth,
        clientWidth: surface.clientWidth,
      });
    }
    const desc = (el, out) => {
      for (const c of el.children) {
        const cs = getComputedStyle(c);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (c.scrollWidth > c.clientWidth + 2 && !['auto', 'scroll'].includes(cs.overflowX)) {
          out.push({
            sel:
              c.tagName.toLowerCase() +
              (c.className && typeof c.className === 'string'
                ? '.' + c.className.trim().split(/\s+/).slice(0, 4).join('.')
                : ''),
            scrollWidth: c.scrollWidth,
            clientWidth: c.clientWidth,
          });
        }
        desc(c, out);
      }
    };
    desc(surface, item.innerOverflow);
    // escaped horizontally out of surface
    const walk = (el) => {
      for (const c of el.children) {
        const cs = getComputedStyle(c);
        if (
          cs.display === 'none' ||
          cs.visibility === 'hidden' ||
          cs.position === 'fixed' ||
          cs.position === 'absolute'
        )
          continue;
        const r = c.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const dl = sr.left - r.left,
          dr = r.right - sr.right;
        if (dl > 4 || dr > 4) {
          item.escaped.push({
            sel:
              c.tagName.toLowerCase() +
              (typeof c.className === 'string' && c.className
                ? '.' + c.className.trim().split(/\s+/).slice(0, 4).join('.')
                : ''),
            overLeft: Math.round(dl),
            overRight: Math.round(dr),
            text: (c.innerText || '').trim().slice(0, 50),
          });
          continue; // outermost only
        }
        walk(c);
      }
    };
    walk(surface);
    item.innerOverflow = item.innerOverflow.slice(0, 6);
    item.escaped = item.escaped.slice(0, 6);
    res.examples.push(item);
  });
  res.surfaceCount = surfaces.length;
  return res;
};

const browser = await chromium.launch({ channel: 'chromium-headless-shell' });
const results = {};
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const slug of slugs) {
    const errors = [];
    const onErr = (e) =>
      errors.push(
        'PAGEERROR: ' + (e.stack || e.message || String(e)).split('\n').slice(0, 3).join(' | '),
      );
    const onCon = (m) => {
      if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 400));
    };
    page.on('pageerror', onErr);
    page.on('console', onCon);
    try {
      await page.goto(`https://ui.gecore.mn/#components/${slug}`, {
        waitUntil: 'networkidle',
        timeout: 45000,
      });
      await page.waitForTimeout(900);
      const r = await page.evaluate(probe);
      r.errors = errors;
      results[`${slug}|${vp.name}`] = r;
    } catch (e) {
      results[`${slug}|${vp.name}`] = { fatal: String(e).slice(0, 300), errors };
    }
    page.off('pageerror', onErr);
    page.off('console', onCon);
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(OUT + '/results.json', JSON.stringify(results, null, 1));
console.log('done', Object.keys(results).length);
