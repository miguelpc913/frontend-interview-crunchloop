import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { TodoListFilterDropdown } from './TodoListFilterDropdown';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';

describe('TodoListFilterDropdown', () => {
  it('renders current mode label and no Filter badge for "all"', () => {
    renderWithProviders(
      <TodoListFilterDropdown mode='all' onChangeMode={() => {}} />,
    );

    expect(screen.getByText('All tasks')).toBeInTheDocument();
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });

  it('shows Filter badge for non-all modes and calls onChangeMode', async () => {
    const onChangeSpy = vi.fn();

    function Wrapper() {
      const [mode, setMode] = useState<'all' | 'done' | 'not-done'>('all');
      return (
        <TodoListFilterDropdown
          mode={mode}
          onChangeMode={(next) => {
            onChangeSpy(next);
            setMode(next);
          }}
        />
      );
    }

    renderWithProviders(<Wrapper />);

    const user = userEvent.setup();
    await user.click(screen.getByText('All tasks'));

    await user.click(screen.getByText('Done'));

    expect(onChangeSpy).toHaveBeenLastCalledWith('done');
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('selects "Not done"', async () => {
    function Wrapper() {
      const [mode, setMode] = useState<'all' | 'done' | 'not-done'>('all');
      return (
        <TodoListFilterDropdown mode={mode} onChangeMode={setMode} />
      );
    }

    renderWithProviders(<Wrapper />);

    const user = userEvent.setup();
    await user.click(screen.getByText('All tasks'));
    await user.click(screen.getByText('Not done'));

    expect(screen.getByText('Not done')).toBeInTheDocument();
  });
});
