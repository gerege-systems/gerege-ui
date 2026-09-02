#!/usr/bin/env node
/* Non-interactive sanity check: scaffold each template and verify the expected
 * files are present, tokens were replaced, and the generated sources typecheck
 * against the workspace copy of @gerege-systems/ui (so a template importing a
 * component that does not exist fails here, not on the user's machine).
 *
 * Projects are scaffolded under node_modules/.cache so `react`, `vite/client`
 * etc. resolve via the hoisted workspace node_modules — no install needed. */

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'dist/index.js');
const UI_SRC = path.resolve(ROOT, '../ui/src');
const TSC = path.resolve(ROOT, '../../node_modules/.bin/tsc');
const CACHE = path.join(ROOT, 'node_modules/.cache/czui-smoke');
mkdirSync(CACHE, { recursive: true });

if (!existsSync(CLI)) {
  console.error('dist/index.js not built — run `pnpm build` first.');
  process.exit(1);
}

const TEMPLATES = ['vite-blank', 'vite-dashboard'];
const EXPECTED = [
  'package.json',
  '.gitignore',
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  'src/main.tsx',
  'src/App.tsx',
];

let failed = 0;

for (const tpl of TEMPLATES) {
  const tmp = mkdtempSync(path.join(CACHE, `${tpl}-`));
  const projectName = 'sample-app';
  const project = path.join(tmp, projectName);

  console.log(`\n→ Scaffolding ${tpl} into ${project}`);
  try {
    execFileSync('node', [CLI, projectName, '--template', tpl, '--no-install'], {
      cwd: tmp,
      stdio: 'pipe',
    });
  } catch (err) {
    console.error(`  ✗ CLI exited non-zero: ${err.message}`);
    failed++;
    rmSync(tmp, { recursive: true, force: true });
    continue;
  }

  let templateFailed = 0;
  for (const f of EXPECTED) {
    if (!existsSync(path.join(project, f))) {
      console.error(`  ✗ missing ${f}`);
      templateFailed++;
    }
  }
  if (templateFailed === 0) console.log(`  ✓ all ${EXPECTED.length} files present`);

  // Verify token replacement
  const pkg = JSON.parse(readFileSync(path.join(project, 'package.json'), 'utf8'));
  if (pkg.name !== projectName) {
    console.error(`  ✗ package.json name not replaced: got "${pkg.name}"`);
    templateFailed++;
  } else {
    console.log(`  ✓ __PROJECT_NAME__ replaced in package.json`);
  }

  // No `_package.json` or `_gitignore` should leak through
  const stray = readdirSync(project).filter((f) => f.startsWith('_'));
  if (stray.length > 0) {
    console.error(`  ✗ stray underscore files: ${stray.join(', ')}`);
    templateFailed++;
  }

  // Typecheck the generated sources against packages/ui/src.
  const tsconfig = {
    extends: './tsconfig.json',
    compilerOptions: {
      baseUrl: '.',
      types: ['vite/client', 'node'],
      paths: {
        '@gerege-systems/ui': [path.join(UI_SRC, 'index.ts')],
        '@gerege-systems/ui/icon': [path.join(UI_SRC, 'icon.ts')],
        '@/*': [path.join(UI_SRC, '*')],
      },
    },
    include: ['src', path.join(UI_SRC, 'types')],
  };
  writeFileSync(path.join(project, 'tsconfig.smoke.json'), JSON.stringify(tsconfig, null, 2));
  try {
    execFileSync(TSC, ['-p', 'tsconfig.smoke.json', '--noEmit'], { cwd: project, stdio: 'pipe' });
    console.log('  ✓ tsc --noEmit passes against packages/ui/src');
  } catch (err) {
    console.error('  ✗ typecheck failed:');
    console.error(
      String(err.stdout ?? err.message)
        .split('\n')
        .map((l) => '      ' + l)
        .join('\n'),
    );
    templateFailed++;
  }

  rmSync(tmp, { recursive: true, force: true });
  if (templateFailed > 0) failed++;
}

if (failed > 0) {
  console.error(`\n${failed} template(s) failed smoke test`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
