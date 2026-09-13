import { test, expect, type Page } from '@playwright/test';
import { collectErrors, expectNoErrors, gotoHash, applyTheme } from './helpers';
import { VIEWPORTS } from './routes';

/* -----------------------------------------------------------------------------
 *  Admin template — Projects page behaviour: URL state, sort, pagination,
 *  bulk selection, undoable archive, demo states, density, theme, layout
 *  switch, and the mobile drawer.
 * --------------------------------------------------------------------------- */

const PROJECTS = 'preview/admin/app/sidebar/projects';

const table = (page: Page) => page.locator('table');
const dataRows = (page: Page) =>
  page.locator('tbody tr:has(input[type=checkbox], button[role=checkbox])');
const search = (page: Page) => page.getByRole('searchbox', { name: 'Search projects' });
const demoMenu = (page: Page) => page.getByRole('button', { name: /^Demo controls/ });

async function openProjects(page: Page) {
  await applyTheme(page, 'light');
  await gotoHash(page, PROJECTS);
  await expect(table(page)).toBeVisible();
  await expect(dataRows(page).first()).toBeVisible();
}

test.describe('admin › projects @1280', () => {
  test.use({ viewport: VIEWPORTS.lg });

  test('search filters rows and writes ?q= to the URL', async ({ page }, info) => {
    const errors = collectErrors(page);
    await openProjects(page);
    const before = await dataRows(page).count();
    expect(before).toBeGreaterThan(1);

    await search(page).fill('Billing');
    // 300 ms debounce before the list + URL update.
    await expect.poll(() => dataRows(page).count()).toBeLessThan(before);
    await expect(page).toHaveURL(/\?(.*&)?q=Billing/);
    await expect(page.getByText(/Search: “Billing”/)).toBeVisible();

    // Deep link: reload with the same URL restores the filter.
    await page.reload();
    await expect(search(page)).toHaveValue('Billing');
    await expect.poll(() => dataRows(page).count()).toBeLessThan(before);

    await expectNoErrors(page, errors, 'light', info);
  });

  test('column sort cycles asc → desc → none and reflects aria-sort', async ({ page }) => {
    await openProjects(page);
    const nameHead = page.locator('th', { hasText: 'Name' }).first();
    const nameBtn = nameHead.getByRole('button');

    const firstName = async () => dataRows(page).first().locator('td').nth(1).innerText();
    const initial = await firstName();

    await nameBtn.click();
    await expect(nameHead).toHaveAttribute('aria-sort', 'ascending');
    await expect(page).toHaveURL(/sort=name/);
    const asc = await firstName();

    await nameBtn.click();
    await expect(nameHead).toHaveAttribute('aria-sort', 'descending');
    const desc = await firstName();
    expect(asc).not.toBe(desc);

    await nameBtn.click();
    await expect(nameHead).not.toHaveAttribute('aria-sort', /.+/);
    await expect(page).toHaveURL(/sort=none/);
    expect(await firstName()).toBe(initial);
  });

  test('pagination changes the page and URL', async ({ page }) => {
    await openProjects(page);
    const nav = page.getByRole('navigation', { name: 'Pagination' });
    await expect(nav).toBeVisible();
    const first = await dataRows(page).first().locator('td').nth(1).innerText();

    await nav.getByRole('button', { name: 'Next page' }).click();
    await expect(page).toHaveURL(/[?&]p=2/);
    await expect(nav.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(await dataRows(page).first().locator('td').nth(1).innerText()).not.toBe(first);

    // Page-size change resets to page 1.
    const sizeSelect = nav.getByRole('combobox');
    if (await sizeSelect.count()) {
      await sizeSelect.first().click();
      await page.getByRole('option', { name: /50/ }).click();
      await expect(page).not.toHaveURL(/[?&]p=2/);
      await expect(page).toHaveURL(/size=50/);
    }
  });

  test('selecting rows shows the bulk bar; archive is undoable via toast', async ({ page }) => {
    await openProjects(page);
    const row = dataRows(page).first();
    const name = (await row.locator('td').nth(1).innerText()).trim();
    const statusBefore = (await row.locator('td').nth(2).innerText()).trim();
    expect(statusBefore).not.toBe('Archived');

    await row.getByRole('checkbox', { name: `Select ${name}` }).click();
    const bulk = page.getByRole('toolbar', { name: 'Bulk actions' });
    await expect(bulk).toBeVisible();
    await expect(bulk).toContainText('1 selected');

    await bulk.getByRole('button', { name: 'Archive' }).click();
    await expect(bulk).toBeHidden();
    const archivedRow = page.locator('tbody tr', { hasText: name });
    await expect(archivedRow.locator('td').nth(2)).toHaveText(/Archived/);

    // Radix toasts pause/close on hover; the viewport region intercepts pointer
    // events, so activate Undo the way a keyboard user would (F8 → Undo).
    const undo = page.getByRole('button', { name: /^Undo$/ }).first();
    await expect(undo).toBeVisible();
    await undo.focus();
    await page.keyboard.press('Enter');
    await expect(archivedRow.locator('td').nth(2)).toHaveText(statusBefore);
  });

  test('demo states: loading → skeleton, empty → EmptyState, error → ErrorState + Retry recovers', async ({
    page,
  }) => {
    await openProjects(page);

    const choose = async (state: string) => {
      await demoMenu(page).click();
      await page.getByRole('menuitemradio', { name: state }).click();
      await expect(demoMenu(page)).toHaveAttribute(
        'aria-label',
        new RegExp(`State: ${state}`, 'i'),
      );
    };

    await choose('Loading');
    await expect(dataRows(page)).toHaveCount(0);
    await expect(page.locator('tbody [aria-hidden]').first()).toBeVisible();

    await choose('Empty');
    await expect(page.getByRole('heading', { name: 'No projects yet' })).toBeVisible();
    await expect(table(page)).toBeHidden();

    await choose('Error');
    await expect(
      page.getByRole('heading', { name: /Something went wrong|Couldn.t load/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /Try again|Retry/i }).click();
    await expect(table(page)).toBeVisible();
    await expect(dataRows(page).first()).toBeVisible();
    await expect(demoMenu(page)).toHaveAttribute('aria-label', /State: normal/i);
  });

  test('compact density reduces row height', async ({ page }) => {
    await openProjects(page);
    const rowH = async () => (await dataRows(page).first().boundingBox())!.height;
    const before = await rowH();

    await demoMenu(page).click();
    await page.getByRole('menuitemradio', { name: 'Compact' }).click();
    await expect.poll(rowH).toBeLessThan(before);
    await expect(page.locator('[data-density=compact]')).toHaveCount(1);
  });

  test('theme toggle in the top bar flips html.dark', async ({ page }) => {
    await openProjects(page);
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    await page
      .locator('header')
      .getByRole('button', { name: /^Theme: Light/ })
      .click();
    await expect(html).toHaveClass(/dark/);
    await expect(
      page.locator('header').getByRole('button', { name: /^Theme: Dark/ }),
    ).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
  });

  test('layout switch via the preview dock updates the URL and shell', async ({ page }) => {
    await openProjects(page);
    await expect(page.locator('aside, nav').filter({ hasText: 'Overview' }).first()).toBeVisible();

    await page.getByRole('button', { name: /^Template: Admin dashboard/ }).click();
    await page.getByRole('menuitemradio', { name: 'Top nav', exact: true }).click();
    await expect(page).toHaveURL(/#preview\/admin\/app\/topnav\//);
    await expect(page.getByRole('menuitemradio', { name: 'Top nav', exact: true })).toBeHidden();
    // Top-nav shell renders the primary links in the header, not a rail.
    await expect(
      page.locator('header').getByRole('button', { name: 'Projects', exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: /^Template: Admin dashboard/ }).click();
    await page.getByRole('menuitemradio', { name: 'Sidebar with module', exact: true }).click();
    await expect(page).toHaveURL(/#preview\/admin\/app\/sidebar-module/);
    await expect(
      page
        .getByRole('navigation', { name: 'Modules' })
        .or(page.getByRole('group', { name: 'Modules' }))
        .first(),
    ).toBeVisible();
    // Picking a module on the rail opens that module's first page.
    await page
      .getByRole('navigation', { name: 'Modules' })
      .getByRole('button', { name: 'Finance' })
      .click();
    await expect(page).toHaveURL(/#preview\/admin\/app\/sidebar-module\/invoices/);
    await expect(page.getByRole('heading', { level: 1, name: 'Invoices' })).toBeVisible();

    // Top nav with module: modules are menu buttons in the header; the menu
    // lists the module's pages grouped under section headings (two tiers).
    await page.getByRole('button', { name: /^Template: Admin dashboard/ }).click();
    await page.getByRole('menuitemradio', { name: 'Top nav with module' }).click();
    await expect(page).toHaveURL(/#preview\/admin\/app\/topnav-module/);
    // Scoped to the primary nav: the page header's breadcrumb also has a "CRM" button.
    const crm = page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('button', { name: 'CRM', exact: true });
    await expect(crm).toBeVisible();
    await crm.click();
    // Two tiers: the menu lists every page, grouped under section headings.
    const menu = page.getByRole('menu');
    await expect(menu.getByText('Sales', { exact: true })).toBeVisible();
    await expect(menu.getByText('Audience', { exact: true })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /^Segments/ })).toBeVisible();
    await menu.getByRole('menuitem', { name: /^Customers/ }).click();
    await expect(page).toHaveURL(/#preview\/admin\/app\/topnav-module\/customers/);
    await expect(page.getByRole('heading', { level: 1, name: 'Customers' })).toBeVisible();
    // The owning module is the active item; the trail is rooted in the module
    // (no Home — that would be another module's page).
    await expect(crm).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('main nav[aria-label="Breadcrumb"]')).toHaveText(
      /^CRMSalesCustomers$/,
    );
  });

  test('demo menu › Top bar off: the sidebar takes the bar’s utilities and the trail', async ({
    page,
  }) => {
    await openProjects(page);
    await page.getByRole('button', { name: /^Demo controls/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Top bar' }).click();
    // The bar only serves the drawer below lg now.
    await expect(page.locator('header').first()).toBeHidden();
    const sidebar = page.locator('[data-slot="sidebar"]').first();
    await expect(sidebar.getByRole('button', { name: 'Open command palette' })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: 'Account menu' })).toBeVisible();
    await expect(page.locator('main nav[aria-label="Breadcrumb"]')).toHaveText(
      /^HomeWorkspaceProjects$/,
    );
    // Back on: the bar returns with its cluster, the trail leaves the page.
    await sidebar.getByRole('button', { name: /^Demo controls/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Top bar' }).click();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main nav[aria-label="Breadcrumb"]')).toHaveCount(0);
  });

  test('Top bar off, sidebar: utilities sit above the user card, which opens the account menu', async ({
    page,
  }) => {
    await openProjects(page);
    await page.getByRole('button', { name: /^Demo controls/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Top bar' }).click();
    const sidebar = page.locator('[data-slot="sidebar"]').first();
    const palette = await sidebar
      .getByRole('button', { name: 'Open command palette' })
      .boundingBox();
    const card = sidebar.getByRole('button', { name: 'Account menu' });
    await expect(card).toContainText('Alex Morgan');
    expect(palette!.y + palette!.height).toBeLessThanOrEqual((await card.boundingBox())!.y);
    await card.click();
    await expect(page.getByRole('menuitem', { name: /Sign out/ })).toBeVisible();
  });

  test('Top bar off, sidebar with module: utilities stack in the rail above the avatar', async ({
    page,
  }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/admin/app/sidebar-module/customers');
    await page.getByRole('button', { name: /^Demo controls/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Top bar' }).click();
    const rail = page.getByRole('navigation', { name: 'Modules' });
    const palette = await rail.getByRole('button', { name: 'Open command palette' }).boundingBox();
    const bell = await rail.getByRole('button', { name: /Notifications/ }).boundingBox();
    const account = rail.getByRole('button', { name: 'Account menu' });
    // A column: same x, each below the last, the avatar at the foot.
    expect(Math.round(bell!.x)).toBe(Math.round(palette!.x));
    expect(bell!.y).toBeGreaterThan(palette!.y);
    expect((await account.boundingBox())!.y).toBeGreaterThan(bell!.y);
    // The panel keeps its list; no second account menu anywhere.
    await expect(page.getByRole('button', { name: 'Account menu' })).toHaveCount(1);
    await account.click();
    await expect(page.getByRole('menuitem', { name: /Sign out/ })).toBeVisible();
  });
});

test.describe('admin › top nav @1600', () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test('demo menu › Top bar in container: the bar’s content sits in the 1440px column', async ({
    page,
  }) => {
    await applyTheme(page, 'light');
    await gotoHash(page, 'preview/admin/app/topnav/projects');
    const bar = page.locator('header').first();
    // Edge to edge (minus a scrollbar, if the platform draws one).
    expect((await bar.boundingBox())!.width).toBeGreaterThan(1500);
    await page.getByRole('button', { name: /^Demo controls/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Top bar in container' }).click();
    const box = (await bar.boundingBox())!;
    expect(Math.round(box.width)).toBe(1440);
    // Centred in the window (the offset shrinks by half a scrollbar, if any).
    expect(box.x).toBeGreaterThan(70);
    expect(box.x).toBeLessThan(90);
  });
});

test.describe('admin › projects @375', () => {
  test.use({ viewport: VIEWPORTS.sm });

  test('hamburger opens the navigation drawer; Escape closes and restores focus', async ({
    page,
  }) => {
    await openProjects(page);
    const burger = page.getByRole('button', { name: 'Open navigation' });
    await expect(burger).toBeVisible();
    await burger.click();

    const drawer = page.getByRole('dialog', { name: 'Navigation' });
    await expect(drawer).toBeVisible();
    await expect(
      drawer
        .getByRole('button', { name: 'Overview' })
        .or(drawer.getByRole('link', { name: 'Overview' }))
        .first(),
    ).toBeVisible();
    // Focus moves into the drawer.
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    const focusedAfterClose = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el
        ? `${el.tagName.toLowerCase()} aria-label="${el.getAttribute('aria-label') ?? ''}" text="${el.textContent?.trim().slice(0, 30) ?? ''}"`
        : 'null';
    });
    await expect(
      burger,
      `focus should return to the hamburger; it is on ${focusedAfterClose}`,
    ).toBeFocused();

    // Navigating from the drawer closes it and changes the page.
    await burger.click();
    await drawer
      .getByRole('button', { name: 'Inbox' })
      .or(drawer.getByRole('link', { name: 'Inbox' }))
      .first()
      .click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/inbox/);
  });
});
