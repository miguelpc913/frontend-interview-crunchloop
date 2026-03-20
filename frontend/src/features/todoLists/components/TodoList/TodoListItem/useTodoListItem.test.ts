import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTodoListItem } from './useTodoListItem';

describe('useTodoListItem', () => {
  it('calls onUpdate with trimmed name when changed and valid', async () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() =>
      useTodoListItem({
        item: { id: 1, name: 'Task A', description: 'desc', done: false },
        onUpdate,
        onDelete: vi.fn(),
      }),
    );

    act(() => {
      result.current.form.setValue('name', '  Renamed Task  ');
      result.current.handleNameBlur();
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({ name: 'Renamed Task' });
    });
  });

  it('does not call onUpdate for unchanged name', async () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() =>
      useTodoListItem({
        item: { id: 1, name: 'Task A', description: 'desc', done: false },
        onUpdate,
        onDelete: vi.fn(),
      }),
    );

    act(() => {
      result.current.form.setValue('name', 'Task A');
      result.current.handleNameBlur();
    });

    await waitFor(() => {
      expect(onUpdate).not.toHaveBeenCalled();
    });
  });

  it('calls onUpdate when description changes', async () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() =>
      useTodoListItem({
        item: { id: 1, name: 'Task A', description: 'desc', done: false },
        onUpdate,
        onDelete: vi.fn(),
      }),
    );

    act(() => {
      result.current.form.setValue('description', 'new description');
      result.current.handleDescriptionBlur();
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith({ description: 'new description' });
    });
  });

  it('blurs input on Enter key', () => {
    const { result } = renderHook(() =>
      useTodoListItem({
        item: { id: 1, name: 'Task A', description: '', done: false },
        onUpdate: vi.fn(),
        onDelete: vi.fn(),
      }),
    );
    const blur = vi.fn();

    result.current.handleKeyDown({
      key: 'Enter',
      target: { blur },
    } as never);

    expect(blur).toHaveBeenCalled();
  });

  it('resets form values when item changes', async () => {
    const onUpdate = vi.fn();
    const { result, rerender } = renderHook(
      ({ itemName }) =>
        useTodoListItem({
          item: { id: 1, name: itemName, description: 'desc', done: false },
          onUpdate,
          onDelete: vi.fn(),
        }),
      { initialProps: { itemName: 'Task A' } },
    );

    act(() => {
      result.current.form.setValue('name', 'Local value');
    });
    rerender({ itemName: 'Server value' });

    await waitFor(() => {
      expect(result.current.form.getValues('name')).toBe('Server value');
    });
  });
});
