// `@types/jest-axe` augments Jest's global `jest.Matchers`. Up to vitest 4 the
// `Assertion` type inherited that namespace when it existed; vitest 5 dropped
// the compatibility, so the matcher registered in src/test/setup.ts is
// declared on vitest's own `Matchers` here (type parameters must match the
// upstream declaration exactly for the interfaces to merge).
import 'vitest';
import type { AxeResults } from 'jest-axe';

declare module 'vitest' {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoViolations(results?: Partial<AxeResults>): R;
  }
}
