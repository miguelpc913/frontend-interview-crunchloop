import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryState } from './QueryState';

describe('QueryState', () => {
  it('renders children when not loading and not error', () => {
    render(
      <QueryState isLoading={false} isError={false}>
        <div>Loaded content</div>
      </QueryState>,
    );

    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });

  it('renders default loading fallback when loading', () => {
    render(
      <QueryState isLoading isError={false}>
        <div>Loaded content</div>
      </QueryState>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading fallback when provided', () => {
    render(
      <QueryState isLoading isError={false} loadingFallback={<div>Custom loading</div>}>
        <div>Loaded content</div>
      </QueryState>,
    );

    expect(screen.getByText('Custom loading')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders error fallback title and message', () => {
    render(
      <QueryState
        isLoading={false}
        isError
        errorTitle="Could not load list"
        errorMessage="Please try again later"
      >
        <div>Loaded content</div>
      </QueryState>,
    );

    expect(screen.getByText('Could not load list')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('renders retry button and calls onRetry when provided', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <QueryState isLoading={false} isError onRetry={onRetry}>
        <div>Loaded content</div>
      </QueryState>,
    );

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    expect(retryButton).toBeInTheDocument();
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button without onRetry', () => {
    render(
      <QueryState isLoading={false} isError>
        <div>Loaded content</div>
      </QueryState>,
    );

    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });
});
