import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTodoListHeader } from './useTodoListHeader';

describe('useTodoListHeader', () => {
  it('calls onUpdateName when list name changes and is valid', async () => {
    const onUpdateName = vi.fn();
    const onAddItem = vi.fn();
    const { result } = renderHook(() =>
      useTodoListHeader({ name: 'Old Name', onUpdateName, onAddItem }),
    );

    act(() => {
      result.current.listNameForm.setValue('name', 'New Name');
    });
    act(() => {
      result.current.handleListNameBlur();
    });

    await waitFor(() => {
      expect(onUpdateName).toHaveBeenCalledWith('New Name');
    });
  });

  it('does not call onUpdateName when list name is unchanged', async () => {
    const onUpdateName = vi.fn();
    const onAddItem = vi.fn();
    const { result } = renderHook(() =>
      useTodoListHeader({ name: 'Same Name', onUpdateName, onAddItem }),
    );

    act(() => {
      result.current.listNameForm.setValue('name', 'Same Name');
      result.current.handleListNameBlur();
    });

    await waitFor(() => {
      expect(onUpdateName).not.toHaveBeenCalled();
    });
  });

  it('blurs input on Enter key', () => {
    const { result } = renderHook(() =>
      useTodoListHeader({ name: 'Name', onUpdateName: vi.fn(), onAddItem: vi.fn() }),
    );
    const blur = vi.fn();

    result.current.handleListNameKeyDown({
      key: 'Enter',
      target: { blur },
    } as never);

    expect(blur).toHaveBeenCalled();
  });

  it('adds item with trimmed name and resets field', async () => {
    const onAddItem = vi.fn();
    const { result } = renderHook(() =>
      useTodoListHeader({ name: 'Name', onUpdateName: vi.fn(), onAddItem }),
    );

    act(() => {
      result.current.addTaskForm.setValue('name', '  My Task  ');
    });

    await act(async () => {
      await result.current.handleAddSubmit();
    });

    expect(onAddItem).toHaveBeenCalledWith('My Task');
    expect(result.current.addTaskForm.getValues('name')).toBe('');
  });

  it('does not add item for empty name', async () => {
    const onAddItem = vi.fn();
    const { result } = renderHook(() =>
      useTodoListHeader({ name: 'Name', onUpdateName: vi.fn(), onAddItem }),
    );

    act(() => {
      result.current.addTaskForm.setValue('name', '   ');
    });

    await act(async () => {
      await result.current.handleAddSubmit();
    });

    expect(onAddItem).not.toHaveBeenCalled();
  });
});
