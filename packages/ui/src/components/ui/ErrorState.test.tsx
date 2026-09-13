import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ErrorState } from './ErrorState';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('ErrorState', () => {
  it('renders the generic preset by default', () => {
    const { container } = render(<ErrorState />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Unexpected error');
    expect(screen.getByText('Something interrupted this action.')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each([
    ['403', "You don't have access"],
    ['404', 'Page not found'],
    ['500', 'Something went wrong'],
  ] as const)('variant %s uses its preset title', (variant, title) => {
    render(<ErrorState variant={variant} />);
    expect(screen.getByRole('heading')).toHaveTextContent(title);
  });

  it('title / description / illustration / headingLevel overrides win', () => {
    render(
      <ErrorState
        variant="404"
        title="Quota exceeded"
        description="1,000 events/day."
        illustration={<svg data-testid="ill" />}
        headingLevel={1}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Quota exceeded');
    expect(screen.getByText('1,000 events/day.')).toBeInTheDocument();
    expect(screen.getByTestId('ill')).toBeInTheDocument();
  });

  it('onRetry renders a "Try again" button that calls the handler (mouse + keyboard)', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState variant="500" onRetry={onRetry} />);
    const btn = screen.getByRole('button', { name: 'Try again' });
    await user.click(btn);
    btn.focus();
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('custom action replaces the retry button', () => {
    render(<ErrorState onRetry={() => {}} action={<a href="/">Go home</a>} />);
    expect(screen.getByRole('link', { name: 'Go home' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is an alert only when `live`', () => {
    const { rerender } = render(<ErrorState data-testid="es" />);
    expect(screen.getByTestId('es')).not.toHaveAttribute('role');
    rerender(<ErrorState data-testid="es" live />);
    expect(screen.getByTestId('es')).toHaveAttribute('role', 'alert');
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ErrorState ref={ref} className="extra" data-testid="es" />);
    expect(ref.current).toBe(screen.getByTestId('es'));
    expect(ref.current).toHaveClass('extra', 'rounded-lg');
  });

  it('localises preset copy and the retry label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <ErrorState variant="404" onRetry={() => {}} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent(mnStrings.errorState.notFoundTitle);
    expect(screen.getByRole('button', { name: mnStrings.errorState.tryAgain })).toBeInTheDocument();
    expect(screen.queryByText('Page not found')).toBeNull();
  });

  it('is axe-clean across variants', async () => {
    const { container } = render(
      <div>
        <ErrorState variant="403" />
        <ErrorState variant="404" />
        <ErrorState variant="500" onRetry={() => {}} />
        <ErrorState live />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
