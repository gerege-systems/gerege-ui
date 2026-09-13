import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { axe } from 'jest-axe';
import { brandPresets, DesignSystemProvider } from './DesignSystemProvider';
import { useStrings } from '@/hooks/use-strings';
import { mnStrings } from '@/lib/strings.mn';

function ShowString({ path }: { path: 'alert.dismiss' | 'dialog.close' }) {
  const s = useStrings();
  const [a, b] = path.split('.') as ['alert' | 'dialog', 'dismiss' | 'close'];
  return <span data-testid={path}>{(s[a] as Record<string, string>)[b]}</span>;
}

describe('DesignSystemProvider', () => {
  it('renders children inside a `contents` scope div and spreads props', () => {
    render(
      <DesignSystemProvider data-testid="scope" className="extra" id="ds">
        <span>child</span>
      </DesignSystemProvider>,
    );
    const scope = screen.getByTestId('scope');
    expect(scope).toHaveClass('contents', 'extra');
    expect(scope).toHaveAttribute('id', 'ds');
    expect(scope).toHaveAttribute('data-brand-scope');
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('flat tokens become inline CSS variables (with or without the -- prefix)', () => {
    render(
      <DesignSystemProvider
        data-testid="scope"
        tokens={{ accent: 'red', '--radius-md': '10px' }}
        style={{ color: 'blue' }}
      >
        x
      </DesignSystemProvider>,
    );
    const scope = screen.getByTestId('scope');
    expect(scope.style.getPropertyValue('--accent')).toBe('red');
    expect(scope.style.getPropertyValue('--radius-md')).toBe('10px');
    expect(scope.style.color).toBe('blue');
    expect(document.querySelector('style[data-brand-scope-style]')).toBeNull();
  });

  it('light/dark token pairs render a scoped <style> sheet instead of inline vars', () => {
    render(
      <DesignSystemProvider data-testid="scope" tokens={brandPresets.violet}>
        x
      </DesignSystemProvider>,
    );
    const scope = screen.getByTestId('scope');
    expect(scope.style.getPropertyValue('--accent')).toBe('');
    const id = scope.getAttribute('data-brand-scope')!;
    const sheet = document.querySelector(`style[data-brand-scope-style="${id}"]`);
    expect(sheet).not.toBeNull();
    const css = sheet!.textContent!;
    expect(css).toContain(
      `[data-brand-scope="${id}"]{--accent:${brandPresets.violet.light.accent}`,
    );
    expect(css).toContain(`.dark [data-brand-scope="${id}"]`);
    expect(css).toContain(`--accent:${brandPresets.violet.dark.accent}`);
  });

  it('the scoped sheet survives server rendering unescaped', () => {
    // A text child is HTML-escaped by the server renderer and <style> keeps
    // the entities literally, so the selector would never match after SSR.
    const html = renderToString(
      <DesignSystemProvider tokens={brandPresets.violet}>x</DesignSystemProvider>,
    );
    expect(html).toMatch(/<style[^>]*>\[data-brand-scope="[^"]+"\]\{--accent:oklch/);
    expect(html).not.toContain('&quot;');
  });

  it('a pair without `dark` emits only the light block', () => {
    render(
      <DesignSystemProvider data-testid="scope" tokens={{ light: { accent: 'red' } }}>
        x
      </DesignSystemProvider>,
    );
    const id = screen.getByTestId('scope').getAttribute('data-brand-scope')!;
    const css = document.querySelector(`style[data-brand-scope-style="${id}"]`)!.textContent!;
    expect(css).not.toContain('.dark');
  });

  it('strings: full override, partial merge, and nested providers', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <ShowString path="alert.dismiss" />
        <DesignSystemProvider strings={{ alert: { dismiss: 'Inner' } }}>
          <ShowString path="dialog.close" />
        </DesignSystemProvider>
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('alert.dismiss')).toHaveTextContent('Хаах');
    // nested partial keeps the parent's Mongolian for untouched keys
    expect(screen.getByTestId('dialog.close')).toHaveTextContent('Хаах');
  });

  it('undefined leaves in a partial keep the defaults', () => {
    render(
      <DesignSystemProvider strings={{ alert: { dismiss: undefined } }}>
        <ShowString path="alert.dismiss" />
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('alert.dismiss')).toHaveTextContent('Dismiss');
  });

  it('exposes the built-in brand presets', () => {
    expect(Object.keys(brandPresets)).toEqual(
      expect.arrayContaining(['default', 'blue', 'violet', 'emerald', 'rose', 'amber']),
    );
    expect(brandPresets.default.light).toEqual({});
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <DesignSystemProvider tokens={brandPresets.blue}>
        <button type="button">ok</button>
      </DesignSystemProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
