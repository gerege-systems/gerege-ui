import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { brandPresets, type BrandName } from '@gerege-systems/ui';

/* -----------------------------------------------------------------------------
 *  Theme + brand context.
 *
 *  Both are applied to <html> directly (not a wrapped <DesignSystemProvider>)
 *  so the choice reaches Radix portals (dialogs, toasts, dropdowns) that render
 *  at document.body — outside the React tree. Theme is the light/dark class;
 *  brand is a set of CSS-variable overrides drawn from the library's exported
 *  `brandPresets`. Both persist to localStorage and re-hydrate on the next tab.
 * --------------------------------------------------------------------------- */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEMES: Theme[] = ['light', 'dark', 'system'];
const isTheme = (v: unknown): v is Theme => THEMES.includes(v as Theme);
const DARK_MQ = '(prefers-color-scheme: dark)';

interface ThemeContextValue {
  /** Stored preference — `system` follows the OS setting. */
  theme: Theme;
  /** What is actually painted (`system` resolved against the OS). */
  resolvedTheme: ResolvedTheme;
  setTheme: (t: Theme) => void;
  /** Cycle light → dark → system. */
  toggleTheme: () => void;
  brand: BrandName;
  setBrand: (b: BrandName) => void;
  /**
   * Hold the brand off `<html>` without forgetting it — the theme editor's
   * preview must not inherit an accent its own rail does not show.
   */
  setBrandSuppressed: (suppressed: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'theme';
const BRAND_KEY = 'brand';

/**
 * Apply the accent by toggling `data-accent` on <html>. The actual token
 * values (light + dark) live in globals.css under `[data-accent="…"]`, so a
 * switch is a single attribute write and dark mode adapts automatically.
 */
function applyBrand(brand: BrandName) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (brand === 'default') root.removeAttribute('data-accent');
  else root.setAttribute('data-accent', brand);
}

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (isTheme(stored)) return stored;
  } catch {}
  return 'system';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(DARK_MQ).matches ? 'dark' : 'light';
}

function readInitialBrand(): BrandName {
  if (typeof window === 'undefined') return 'default';
  try {
    const stored = localStorage.getItem(BRAND_KEY);
    if (stored && stored in brandPresets) return stored as BrandName;
  } catch {}
  return 'default';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));
  const [brand, setBrandState] = useState<BrandName>(readInitialBrand);
  const [brandSuppressed, setBrandSuppressed] = useState(false);

  // Paint the resolved theme; while on `system`, follow OS changes live.
  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(theme);
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };
    apply();
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    if (theme !== 'system') return;
    const mq = window.matchMedia(DARK_MQ);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    applyBrand(brandSuppressed ? 'default' : brand);
    try {
      localStorage.setItem(BRAND_KEY, brand);
    } catch {}
  }, [brand, brandSuppressed]);

  // Keep tabs in sync — flip theme/brand here when the standalone preview tab
  // changes it (and vice-versa) via the storage event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && isTheme(e.newValue)) setThemeState(e.newValue);
      if (e.key === BRAND_KEY && e.newValue && e.newValue in brandPresets) {
        setBrandState(e.newValue as BrandName);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]),
      brand,
      setBrand: setBrandState,
      setBrandSuppressed,
    }),
    [theme, resolvedTheme, brand],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}

/** Stable callback for non-provider call-sites that only need the toggle. */
export function useToggleTheme() {
  const { toggleTheme } = useTheme();
  return useCallback(toggleTheme, [toggleTheme]);
}
