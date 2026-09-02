// @ts-check
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/dist-lib/**',
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
      ...reactHooks.configs.recommended.rules,
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
);
