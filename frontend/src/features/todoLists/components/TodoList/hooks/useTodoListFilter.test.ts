import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTodoListFilter } from './useTodoListFilter';
import type { TodoItem } from '@/shared/types/todoList';

const items: TodoItem[] = [
  { id: 1, name: 'Task Alpha', description: 'first item', done: false },
  { id: 2, name: 'Task Beta', description: 'keyword match', done: true },
  { id: 3, name: 'Gamma', description: 'another desc', done: false },
];

describe('useTodoListFilter', () => {
  it('returns all items by default', () => {
    const { result } = renderHook(() => useTodoListFilter(items));

    expect(result.current.filterMode).toBe('all');
    expect(result.current.filteredItems).toHaveLength(3);
    expect(result.current.isReorderEnabled).toBe(true);
  });

  it('filters done items', () => {
    const { result } = renderHook(() => useTodoListFilter(items));

    act(() => {
      result.current.setFilterMode('done');
    });

    expect(result.current.filteredItems.map((item) => item.id)).toEqual([2]);
    expect(result.current.isReorderEnabled).toBe(false);
  });

  it('filters not-done items', () => {
    const { result } = renderHook(() => useTodoListFilter(items));

    act(() => {
      result.current.setFilterMode('not-done');
    });

    expect(result.current.filteredItems.map((item) => item.id)).toEqual([1, 3]);
    expect(result.current.isReorderEnabled).toBe(false);
  });

  it('filters by search query against name and description', async () => {
    const { result } = renderHook(() => useTodoListFilter(items));

    act(() => {
      result.current.setSearchQuery('KEYWORD');
    });

    await waitFor(() => {
      expect(result.current.filteredItems.map((item) => item.id)).toEqual([2]);
    });
    expect(result.current.isReorderEnabled).toBe(false);
  });

  it('applies combined filter mode and search query', async () => {
    const { result } = renderHook(() => useTodoListFilter(items));

    act(() => {
      result.current.setFilterMode('not-done');
      result.current.setSearchQuery('gamma');
    });

    await waitFor(() => {
      expect(result.current.filteredItems.map((item) => item.id)).toEqual([3]);
    });
  });
});
