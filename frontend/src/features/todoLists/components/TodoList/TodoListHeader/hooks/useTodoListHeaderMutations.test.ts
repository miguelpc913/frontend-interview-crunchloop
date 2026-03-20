import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import type { TodoList } from '@/shared/types/todoList';
import { todoListQueryKeys } from '@/shared/query/todoLists';
import { useTodoListHeaderMutations } from './useTodoListHeaderMutations';
import { server } from '@/test/server';
import { setTodoLists } from '@/test/handlers';

function makeList(): TodoList {
  return {
    id: 1,
    name: 'List One',
    todoItems: [{ id: 1, name: 'Task A', description: '', done: false }],
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

function seedCaches(queryClient: QueryClient, list: TodoList) {
  queryClient.setQueryData(todoListQueryKeys.detail(list.id), list);
  queryClient.setQueryData(todoListQueryKeys.all, [list]);
}

describe('useTodoListHeaderMutations', () => {
  it('updates list name in caches on success', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListHeaderMutations(1), { wrapper });

    act(() => {
      result.current.handleUpdateName('Renamed List');
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.name).toBe('Renamed List');
    });

    const all = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);
    expect(all?.[0]?.name).toBe('Renamed List');
  });

  it('removes list from caches on delete success', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListHeaderMutations(1), { wrapper });

    act(() => {
      result.current.handleDeleteList();
    });

    await waitFor(() => {
      const all = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all) ?? [];
      expect(all).toHaveLength(0);
    });
  });

  it('adds item to caches on add success', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListHeaderMutations(1), { wrapper });

    act(() => {
      result.current.handleAddItem('New Task');
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.todoItems.some((item) => item.name === 'New Task')).toBe(true);
    });
  });

  it('rolls back caches when update name fails', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);
    server.use(http.put('*/api/todo-lists/1', () => HttpResponse.text('failed', { status: 500 })));

    const { result } = renderHook(() => useTodoListHeaderMutations(1), { wrapper });

    act(() => {
      result.current.handleUpdateName('Will Fail');
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.name).toBe('List One');
    });
  });

  it('is a no-op for invalid todoListId', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListHeaderMutations(0), { wrapper });

    act(() => {
      result.current.handleUpdateName('No-op');
      result.current.handleDeleteList();
      result.current.handleAddItem('No-op item');
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.name).toBe('List One');
      expect(detail?.todoItems).toHaveLength(1);
    });
  });
});
