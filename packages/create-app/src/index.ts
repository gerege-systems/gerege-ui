#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { cancel, confirm, intro, isCancel, log, outro, select, text } from '@clack/prompts';
import kleur from 'kleur';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

interface Template {
  id: string;
  label: string;
  hint: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'vite-blank',
    label: 'Vite + Blank',
    hint: 'Minimal Vite + React + @gerege-systems/ui starter',
  },
  {
    id: 'vite-dashboard',
    label: 'Vite + Dashboard',
    hint: 'Sidebar + TopNav dashboard shell, ready to wire data',
  },
];

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('bun')) return 'bun';
  return 'npm';
}

function parseArgs(argv: string[]): {
  projectName?: string;
  template?: string;
  noInstall?: boolean;
  yes?: boolean;
} {
  const args = argv.slice(2);
  let projectName: string | undefined;
  let template: string | undefined;
  let noInstall = false;
  let yes = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--template' || a === '-t') {
      template = args[++i];
    } else if (a === '--no-install') {
      noInstall = true;
    } else if (a === '--yes' || a === '-y') {
      yes = true;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else if (!a.startsWith('-')) {
      projectName = a;
    }
  }
  return { projectName, template, noInstall, yes };
}

function printHelp() {
  const lines = [
    '',
    kleur.bold('  @gerege-systems/create-app') +
      kleur.gray(' — scaffold a new @gerege-systems/ui project'),
    '',
    '  Usage:',
    '    npm create @gerege-systems/app [project-name] [options]',
    '',
    '  Options:',
    '    -t, --template <name>   Skip the prompt and use a known template',
    '    -y, --yes               Skip "install deps?" prompt and install',
    '        --no-install        Skip dependency install entirely',
    '    -h, --help              Show this help',
    '',
    '  Templates:',
    ...TEMPLATES.map((t) => `    ${t.id.padEnd(20)} ${kleur.gray(t.hint)}`),
    '',
  ];
  console.log(lines.join('\n'));
}

function isValidProjectName(name: string): true | string {
  if (!name) return 'Project name is required';
  if (name === '.' || name === './') return 'Use a directory name, not "."';
  if (!/^[a-z0-9._-]+$/i.test(name)) {
    return 'Use letters, numbers, dashes, dots, or underscores';
  }
  return true;
}

function copyTemplate(templateId: string, dest: string, projectName: string) {
  const src = path.join(TEMPLATES_DIR, templateId);
  if (!existsSync(src)) {
    throw new Error(`Template "${templateId}" not found at ${src}`);
  }
  mkdirSync(dest, { recursive: true });
  walk(src, dest, projectName);
}

function walk(srcDir: string, destDir: string, projectName: string) {
  for (const entry of readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, entry);
    // npm replaces `package.json` in the published tarball if named raw.
    // Templates ship it as `_package.json` so npm doesn't mistake it for
    // the CLI's own manifest; rename on copy.
    const destName =
      entry === '_package.json' ? 'package.json' : entry === '_gitignore' ? '.gitignore' : entry;
    const destPath = path.join(destDir, destName);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      walk(srcPath, destPath, projectName);
    } else {
      const raw = readFileSync(srcPath, 'utf8');
      const rendered = raw.replace(/__PROJECT_NAME__/g, projectName);
      writeFileSync(destPath, rendered);
    }
  }
}

async function run() {
  intro(kleur.bold(kleur.cyan('  ✦  @gerege-systems/create-app  ')));

  const { projectName: cliName, template: cliTemplate, noInstall, yes } = parseArgs(process.argv);

  // 1. Project name
  let projectName = cliName;
  if (!projectName) {
    const answer = await text({
      message: 'Project name',
      placeholder: 'my-app',
      defaultValue: 'my-app',
      validate: (v) => {
        const r = isValidProjectName(v || 'my-app');
        return r === true ? undefined : r;
      },
    });
    if (isCancel(answer)) {
      cancel('Cancelled.');
      process.exit(0);
    }
    projectName = (answer as string) || 'my-app';
  } else {
    const valid = isValidProjectName(projectName);
    if (valid !== true) {
      log.error(valid);
      process.exit(1);
    }
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    const proceed = await confirm({
      message: `Directory "${projectName}" is not empty. Overwrite?`,
      initialValue: false,
    });
    if (isCancel(proceed) || !proceed) {
      cancel('Cancelled.');
      process.exit(0);
    }
  }

  // 2. Template
  let templateId = cliTemplate;
  if (!templateId) {
    const answer = await select({
      message: 'Pick a template',
      options: TEMPLATES.map((t) => ({ value: t.id, label: t.label, hint: t.hint })),
    });
    if (isCancel(answer)) {
      cancel('Cancelled.');
      process.exit(0);
    }
    templateId = answer as string;
  }
  if (!TEMPLATES.some((t) => t.id === templateId)) {
    log.error(`Unknown template "${templateId}". Run with --help to list.`);
    process.exit(1);
  }

  // 3. Install deps? (skip prompt if --yes or --no-install was passed)
  let installNow: boolean;
  if (noInstall) {
    installNow = false;
  } else if (yes) {
    installNow = true;
  } else {
    const ans = await confirm({
      message: 'Install dependencies now?',
      initialValue: true,
    });
    if (isCancel(ans)) {
      cancel('Cancelled.');
      process.exit(0);
    }
    installNow = ans as boolean;
  }

  // 4. Scaffold
  log.step(`Scaffolding into ${kleur.cyan(path.relative(process.cwd(), targetDir) || '.')}`);
  try {
    copyTemplate(templateId, targetDir, projectName);
  } catch (err) {
    log.error((err as Error).message);
    process.exit(1);
  }

  // 5. Install
  const pm = detectPackageManager();
  if (installNow) {
    log.step(`Installing dependencies with ${kleur.cyan(pm)} (this can take a minute)…`);
    const result = spawnSync(pm, ['install'], { cwd: targetDir, stdio: 'inherit' });
    if (result.status !== 0) {
      log.warn('Install failed. You can re-run it manually after fixing the issue.');
    }
  }

  outro(
    [
      kleur.green('  All set.'),
      '',
      kleur.gray('  Next steps:'),
      `    ${kleur.cyan(`cd ${projectName}`)}`,
      ...(installNow ? [] : [`    ${kleur.cyan(`${pm} install`)}`]),
      `    ${kleur.cyan(`${pm} run dev`)}`,
      '',
      kleur.gray('  Docs: https://ui.gecore.mn'),
    ].join('\n'),
  );
}

run().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
