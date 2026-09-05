import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const THEME_PATH = path.resolve(__dirname, '../../styles/theme.css');

export type TokenMap = Record<string, string>;

export interface ParsedTheme {
  /** `:root { … }` semantic block. */
  light: TokenMap;
  /** `.dark { … }` semantic block. */
  dark: TokenMap;
  /** `@theme { … }` raw primitives (fonts, text scale, radius, shadow, z, motion, palette). */
  raw: TokenMap;
  /** `[data-accent='x']` presets: light (`:root[...]`) and dark (`.dark[...]`) overrides. */
  accents: Record<string, { light: TokenMap; dark: TokenMap }>;
}

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Body of the first top-level (column 0) block whose selector matches. */
function block(css: string, selector: string): string {
  const re = new RegExp(
    `^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([\\s\\S]*?)^\\}`,
    'm',
  );
  const m = re.exec(css);
  if (!m) throw new Error(`block not found: ${selector}`);
  return m[1];
}

export function parseDeclarations(body: string): TokenMap {
  const out: TokenMap = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].replace(/\s+/g, ' ').trim();
  }
  return out;
}

export function parseTheme(css = readFileSync(THEME_PATH, 'utf8')): ParsedTheme {
  const clean = stripComments(css);
  const accents: ParsedTheme['accents'] = {};
  for (const m of clean.matchAll(/^:root\[data-accent='([\w-]+)'\]\s*\{/gm)) {
    const name = m[1];
    accents[name] = {
      light: parseDeclarations(block(clean, `:root[data-accent='${name}']`)),
      dark: parseDeclarations(block(clean, `.dark[data-accent='${name}']`)),
    };
  }
  return {
    light: parseDeclarations(block(clean, ':root')),
    dark: parseDeclarations(block(clean, '.dark')),
    raw: parseDeclarations(block(clean, '@theme')),
    accents,
  };
}
