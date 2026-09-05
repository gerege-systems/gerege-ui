import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteCounts } from '../../../scripts/site-counts';
import { componentDocs } from '../registry/components';
import { templateDocs } from '../registry/templates';
import { guideDocs } from '../registry/guides';

/**
 * index.html's meta copy is filled from a file scan at build time; the home
 * page shows the same numbers from the registry. Keep the two in step.
 */
describe('index.html meta counts', () => {
  it('file-scan counts equal the registry', () => {
    expect(siteCounts()).toEqual({
      components: componentDocs.length,
      templates: templateDocs.length,
      guides: guideDocs.length,
    });
  });

  it('index.html uses the placeholders, not literal numbers', () => {
    const html = readFileSync(path.resolve(__dirname, '../../../index.html'), 'utf8');
    expect(html).toContain('%COMPONENT_COUNT% accessible components');
    expect(html).not.toMatch(/\d+ accessible components/);
  });
});
