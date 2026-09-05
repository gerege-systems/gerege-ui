// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as UI from '../index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '..');
const uiDir = path.join(srcDir, 'components/ui');
const indexSrc = readFileSync(path.join(srcDir, 'index.ts'), 'utf8');

const FORWARD_REF = Symbol.for('react.forward_ref');
const MEMO = Symbol.for('react.memo');

/** Files under components/ui intentionally not re-exported from the root entry. */
const NOT_IN_INDEX: Record<string, string> = {
  Icon: 'shipped via the separate `@gerege-systems/ui/icon` entry so lucide stays out of the root bundle',
};

/**
 * Components that legitimately do not forward a ref: providers, hook-like
 * wrappers, render-prop utilities, and function components whose root is a
 * third-party element that owns the ref.
 */
const NO_REF_ALLOWED = new Set([
  'DesignSystemProvider',
  'Form', // react-hook-form FormProvider wrapper
  'FormField', // Controller wrapper (render prop)
  'Toaster', // mounts the queue; nothing sensible to ref
  'ToastProvider', // Radix provider
  'TooltipProvider', // Radix provider
  'TooltipRoot', // Radix root (context only)
  'Tooltip', // shorthand around TooltipRoot
  'Dialog',
  'DialogPortal',
  'Sheet',
  'SheetPortal',
  'Drawer',
  'DrawerPortal',
  'DropdownMenu',
  'DropdownMenuPortal',
  'DropdownMenuSub',
  'ContextMenu',
  'ContextMenuPortal',
  'ContextMenuSub',
  'Popover',
  'Select',
  'CommandDialog',
  'ConfirmationDialog',
  'Calendar', // react-day-picker DayPicker (no ref API)
  'LineChart',
  'AreaChart',
  'BarChart',
  'SidebarSection',
  'TimelineTime',
  'TimelineTitle',
  'TimelineDescription',
  'CommandShortcut',
  'DropdownMenuShortcut',
  'ContextMenuShortcut',
  'DataGrid', // generic component — forwardRef would erase the row type parameter
  // Plain layout <div> wrappers. Not forwarding a ref is a known gap, tracked
  // here so adding forwardRef later turns into an allow-list cleanup.
  'DialogHeader',
  'DialogFooter',
  'SheetHeader',
  'SheetFooter',
  'DrawerHeader',
  'DrawerFooter',
]);

function isComponent(v: unknown): boolean {
  if (typeof v === 'function') return true;
  if (typeof v === 'object' && v !== null) {
    const t = (v as { $$typeof?: symbol }).$$typeof;
    return t === FORWARD_REF || t === MEMO;
  }
  return false;
}

function forwardsRef(v: unknown): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as { $$typeof?: symbol; type?: unknown };
  if (o.$$typeof === FORWARD_REF) return true;
  if (o.$$typeof === MEMO) return forwardsRef(o.type);
  return false;
}

function nameOf(v: unknown): string | undefined {
  const o = v as {
    $$typeof?: symbol;
    displayName?: string;
    name?: string;
    render?: { name?: string };
    type?: unknown;
  };
  if (o.displayName) return o.displayName;
  if (typeof v === 'function' && o.name) return o.name;
  if (o.$$typeof === MEMO) return nameOf(o.type);
  return o.render?.name || undefined;
}

/** Every value exported by the primitive libraries this package wraps. */
async function thirdPartyExports(): Promise<Set<unknown>> {
  const pkg = JSON.parse(readFileSync(path.resolve(srcDir, '../package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };
  const primitives = Object.keys(pkg.dependencies).filter(
    (d) => d.startsWith('@radix-ui/') || d === 'vaul' || d === 'cmdk',
  );
  const out = new Set<unknown>();
  for (const name of primitives) {
    const mod = (await import(name)) as Record<string, unknown>;
    for (const v of Object.values(mod)) out.add(v);
  }
  return out;
}

const componentFiles = readdirSync(uiDir)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
  .map((f) => f.replace(/\.tsx$/, ''));

const componentExports = Object.entries(UI).filter(
  ([name, v]) => /^[A-Z]/.test(name) && isComponent(v),
);

describe('public API surface', () => {
  it('every components/ui file is exported from index.ts (or allow-listed)', () => {
    const missing = componentFiles.filter(
      (f) => !indexSrc.includes(`'./components/ui/${f}'`) && !(f in NOT_IN_INDEX),
    );
    expect(missing).toEqual([]);
    const stale = Object.keys(NOT_IN_INDEX).filter((f) => !componentFiles.includes(f));
    expect(stale).toEqual([]);
  });

  it('no default exports anywhere in components/ui, hooks, lib', () => {
    const dirs = ['components/ui', 'hooks', 'lib'].map((d) => path.join(srcDir, d));
    const offenders: string[] = [];
    for (const dir of dirs) {
      for (const f of readdirSync(dir)) {
        if (!/\.tsx?$/.test(f) || /\.test\.tsx?$/.test(f)) continue;
        const src = readFileSync(path.join(dir, f), 'utf8');
        if (/^export default\b/m.test(src))
          offenders.push(path.relative(srcDir, path.join(dir, f)));
      }
    }
    expect(offenders).toEqual([]);
  });

  it('exports a substantial component set', () => {
    expect(componentExports.length).toBeGreaterThan(150);
  });

  it('every exported component has a display name', () => {
    const unnamed = componentExports.filter(([, v]) => !nameOf(v)).map(([n]) => n);
    expect(unnamed).toEqual([]);
  });

  it('forwardRef components carry an explicit displayName (not just the render fn name)', async () => {
    // Direct re-exports of a primitive (`export const DialogTrigger = DialogPrimitive.Trigger`)
    // are exempt: recent Radix builds ship forwardRef objects without displayName, and
    // that is theirs to name. Everything defined in this package must still set it.
    const thirdParty = await thirdPartyExports();
    const missing = componentExports
      .filter(([, v]) => forwardsRef(v) && !thirdParty.has(v))
      .filter(([, v]) => !(v as { displayName?: string }).displayName)
      .map(([n]) => n);
    expect(missing).toEqual([]);
  });

  it('every exported component forwards a ref unless allow-listed', () => {
    const offenders = componentExports
      .filter(([name, v]) => !forwardsRef(v) && !NO_REF_ALLOWED.has(name))
      .map(([n]) => n);
    expect(offenders).toEqual([]);
  });

  it('the no-ref allow-list has no stale or unnecessary entries', () => {
    const names = new Map(componentExports);
    const stale = [...NO_REF_ALLOWED].filter((n) => !names.has(n));
    expect(stale, 'allow-listed but not exported').toEqual([]);
    const unnecessary = [...NO_REF_ALLOWED].filter((n) => forwardsRef(names.get(n)));
    expect(unnecessary, 'allow-listed but already forwards ref').toEqual([]);
  });

  it('non-component exports are the known utilities', () => {
    const others = Object.entries(UI)
      .filter(([name, v]) => !(/^[A-Z]/.test(name) && isComponent(v)))
      .map(([n]) => n)
      .sort();
    expect(others).toEqual(
      [
        'DEFAULT_CHART_COLORS',
        'Icons',
        'Illustrations',
        'TOAST_DURATIONS',
        'abbreviateNumber',
        'brandPresets',
        'cn',
        'cva',
        'defaultChartLabels',
        'defaultPaginationLabels',
        'defaultStrings',
        'formatDate',
        'formatMNT',
        'formatNumber',
        'formatPhone',
        'formatString',
        'getDateTimeFormat',
        'isApplePlatform',
        'mnStrings',
        'niceTicks',
        'paginationLabelsFromStrings',
        'parsePhoneMN',
        'toast',
        'useCommandPaletteShortcut',
        'useDebounce',
        'useDebouncedCallback',
        'useDelayedLoading',
        'useFieldIds',
        'useFormField',
        'useMediaQuery',
        'useModifierKey',
        'usePrefersReducedMotion',
        'useSidebar',
        'useStrings',
        'useToast',
      ].sort(),
    );
  });
});
