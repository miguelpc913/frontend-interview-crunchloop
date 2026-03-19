import { describe, expect, it } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useTodoList } from './useTodoList';
import { resetTodoLists } from '@/test/handlers';
import { todoListQueryKeys } from '@/shared/query/todoLists';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

describe('useTodoList', () => {
  it('fetches and returns todo list data', async () => {
    resetTodoLists();
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useTodoList(1), { wrapper });

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull();
    });

    expect(result.current.todoList?.name).toBe('List One');
    expect(result.current.todoList?.todoItems).toHaveLength(2);
    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filterMode).toBe('all');
    expect(result.current.isReorderEnabled).toBe(true);
  });

  it('filters by search query and disables reorder while searching', async () => {
    resetTodoLists();
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTodoList(1), { wrapper });

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull();
    });

    act(() => {
      result.current.setSearchQuery('beta');
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0]?.name).toBe('Task B');
      expect(result.current.isReorderEnabled).toBe(false);
    });
  });

  it('filters by done mode', async () => {
    resetTodoLists();
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTodoList(1), { wrapper });

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull();
    });

    act(() => {
      result.current.setFilterMode('done');
    });

    await waitFor(() => {
      expect(result.current.filteredItems).toHaveLength(1);
      expect(result.current.filteredItems[0]?.name).toBe('Task B');
      expect(result.current.isReorderEnabled).toBe(false);
    });
  });

  it('does not query detail endpoint when todoListId <= 0', async () => {
    resetTodoLists();
    const { wrapper, queryClient } = createWrapper();
    renderHook(() => useTodoList(-1), { wrapper });

    await waitFor(() => {
      expect(queryClient.getQueryData(todoListQueryKeys.detail(-1))).toBeUndefined();
    });
  });
});
