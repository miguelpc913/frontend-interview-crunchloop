import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';
import { ReactNode } from 'react';

function ExplodingComponent(): ReactNode {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>Healthy child</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Healthy child')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ExplodingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Unexpected error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong while rendering this page.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
