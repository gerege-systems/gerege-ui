import type { GuideDoc } from './types';
import { CodeBlock } from '../widgets/CodeBlock';
import { ThemingBody } from '../guides/Theming';
import { FormsBody } from '../guides/Forms';
import { DarkModeBody } from '../guides/DarkMode';
import { ResponsiveBody } from '../guides/Responsive';
import { MigrationBody } from '../guides/Migration';

/* -----------------------------------------------------------------------------
 *  Long-form guides. Inline guides (Quick start, Accessibility) keep their
 *  body here; richer guides with live demos live in src/showcase/guides/*.
 * --------------------------------------------------------------------------- */

const quickstart: GuideDoc = {
  slug: 'quickstart',
  title: 'Quick start',
  description: 'Install the package, import the stylesheet, render your first component.',
  body: (
    <div className="prose-block">
      <h2>1. Install</h2>
      <CodeBlock language="bash" code="pnpm add @gerege-systems/ui" />
      <p>
        Peer dependencies: <code>react@&gt;=18</code>, <code>react-dom@&gt;=18</code>. Already in
        your app — no extra setup.
      </p>

      <h2>2. Import the stylesheet</h2>
      <p>Once, at the top of your app entry:</p>
      <CodeBlock code={`import '@gerege-systems/ui/styles.css';`} />

      <h2>3. Use a component</h2>
      <CodeBlock
        code={`import { Button, Dialog, DialogContent, DialogTrigger, DialogTitle } from '@gerege-systems/ui';

export function ExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export…</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Export workspace</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}`}
      />

      <h2>4. Dark mode</h2>
      <p>
        Toggle the <code>dark</code> class on any container — usually <code>&lt;html&gt;</code>. All
        token-coloured surfaces flip automatically.
      </p>
      <CodeBlock code={`document.documentElement.classList.toggle('dark');`} />
    </div>
  ),
};

const theming: GuideDoc = {
  slug: 'theming',
  title: 'Theming',
  description:
    'Change the brand colour, fonts, and surfaces — globally or per subtree. Live brand-swap demo included.',
  body: <ThemingBody />,
};

const accessibility: GuideDoc = {
  slug: 'accessibility',
  title: 'Accessibility',
  description: 'WCAG AA contrast, keyboard nav, focus management, and screen-reader expectations.',
  body: (
    <div className="prose-block">
      <h2>Built-in guarantees</h2>
      <ul>
        <li>WCAG AA contrast on every token pair (light + dark).</li>
        <li>
          Visible focus ring on every interactive element (<code>:focus-visible</code>).
        </li>
        <li>Keyboard parity — every action reachable without a mouse.</li>
        <li>
          All overlays (Dialog, Sheet, Popover, …) trap and restore focus correctly via Radix.
        </li>
        <li>
          <code>prefers-reduced-motion</code> respected — animations downgrade to subtle fades.
        </li>
      </ul>

      <h2>What you must do</h2>
      <ul>
        <li>
          Always pass <code>aria-label</code> to <code>IconButton</code> (TypeScript enforces it).
        </li>
        <li>
          Provide an <code>alt</code> on <code>Avatar</code> images; <code>fallback</code> initials
          are required.
        </li>
        <li>
          Inside a <code>Dialog</code>, always render <code>DialogTitle</code> — Radix will warn
          otherwise.
        </li>
        <li>
          For <code>Input</code>, set <code>label</code> (use <code>hideLabel</code> to visually
          hide but stay in the a11y tree).
        </li>
      </ul>
    </div>
  ),
};

const forms: GuideDoc = {
  slug: 'forms',
  title: 'Forms (react-hook-form)',
  description:
    'Use Form + FormField for consistent labels, errors, and validation. Includes a live working sign-in form.',
  body: <FormsBody />,
};

const darkMode: GuideDoc = {
  slug: 'dark-mode',
  title: 'Dark mode',
  description: 'How dark mode is implemented + a live theme toggle.',
  body: <DarkModeBody />,
};

const responsive: GuideDoc = {
  slug: 'responsive',
  title: 'Responsive design',
  description: 'Breakpoints, mobile-first patterns, and a live breakpoint indicator.',
  body: <ResponsiveBody />,
};

const migration: GuideDoc = {
  slug: 'migration',
  title: 'Migration guide',
  description:
    'Upgrade notes by release (0.4 → 0.6). Later releases are additive — see the changelog for details.',
  body: <MigrationBody />,
};

// Ordered as a learning progression, not alphabetically: start → theme it →
// dark mode → build forms → make it responsive → a11y → migrate.
export const guideDocs: GuideDoc[] = [
  quickstart,
  theming,
  darkMode,
  forms,
  responsive,
  accessibility,
  migration,
];

export function getGuideDoc(slug: string): GuideDoc | undefined {
  return guideDocs.find((g) => g.slug === slug);
}
