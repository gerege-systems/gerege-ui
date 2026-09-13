// @ts-check
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/dist-lib/**',
      '**/coverage/**',
      'design-research/**',
      '**/node_modules/**',
      '**/*.d.ts',
      'apps/site/src/generated/**',
      'packages/create-app/templates/**',
      // Ad-hoc probe scripts run from the working tree, never committed.
      '**/zz-*.mjs',
    ],
  },
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // react-hooks 7 folds the React Compiler rules (set-state-in-effect,
      // purity, refs, immutability, …) into `recommended`. They are on; the
      // few places that must set state in an effect (a subscription's first
      // read, a timer) carry a per-line disable with the reason.
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Scrollable containers must be keyboard-reachable (axe
      // scrollable-region-focusable); the sanctioned pattern is
      // role="region" + aria-label + tabindex="0".
      'jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['region', 'group'] }],
    },
  },
  {
    // Test probes write a hook's return into a module variable on purpose.
    files: ['**/*.test.{ts,tsx}'],
    rules: { 'react-hooks/globals': 'off' },
  },
);
