import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/test/test-utils';
import { CompletionDonutChart } from './CompletionDonutChart';

describe('CompletionDonutChart', () => {
  it('renders empty state when total is 0', () => {
    renderWithProviders(<CompletionDonutChart done={0} pending={0} total={0} />);

    expect(screen.getByText('Completion Status')).toBeInTheDocument();
    expect(screen.getByText('Done vs pending across all lists')).toBeInTheDocument();
    expect(screen.getByText('No items yet')).toBeInTheDocument();
  });

  it('renders chart with title, description, and total label', () => {
    renderWithProviders(<CompletionDonutChart done={5} pending={3} total={8} />);

    expect(screen.getByText('Completion Status')).toBeInTheDocument();
    expect(screen.getByText('Done vs pending across all lists')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Total items')).toBeInTheDocument();
  });
});
