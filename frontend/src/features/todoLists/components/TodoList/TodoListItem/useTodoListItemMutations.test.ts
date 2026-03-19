import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import type { TodoList } from '@/shared/types/todoList';
import { todoListQueryKeys } from '@/shared/query/todoLists';
import { useTodoListItemMutations } from './useTodoListItemMutations';
import { server } from '@/test/server';
import { setTodoLists } from '@/test/handlers';

function makeList(): TodoList {
  return {
    id: 1,
    name: 'List One',
    todoItems: [
      { id: 1, name: 'Task A', description: 'desc', done: false },
      { id: 2, name: 'Task B', description: '', done: true },
    ],
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

describe('useTodoListItemMutations', () => {
  it('optimistically updates and persists item updates', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListItemMutations(1), { wrapper });

    act(() => {
      result.current.handleUpdateItem(1, { name: 'Updated name' });
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.todoItems.find((item) => item.id === 1)?.name).toBe('Updated name');
    });
  });

  it('optimistically removes and persists deletion', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListItemMutations(1), { wrapper });

    act(() => {
      result.current.handleDeleteItem(2);
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.todoItems.map((item) => item.id)).toEqual([1]);
    });
  });

  it('rolls back when update request fails', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    setTodoLists([list]);
    seedCaches(queryClient, list);
    server.use(
      http.put('*/api/todo-lists/1/todo-items/1', () =>
        HttpResponse.text('failed', { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useTodoListItemMutations(1), { wrapper });

    act(() => {
      result.current.handleUpdateItem(1, { name: 'Fail update' });
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.todoItems.find((item) => item.id === 1)?.name).toBe('Task A');
    });
  });

  it('is a no-op when todoListId is invalid', async () => {
    const { wrapper, queryClient } = createWrapper();
    const list = makeList();
    seedCaches(queryClient, list);

    const { result } = renderHook(() => useTodoListItemMutations(0), { wrapper });

    act(() => {
      result.current.handleUpdateItem(1, { name: 'No-op' });
      result.current.handleDeleteItem(1);
    });

    await waitFor(() => {
      const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
      expect(detail?.todoItems).toHaveLength(2);
      expect(detail?.todoItems[0]?.name).toBe('Task A');
    });
  });
});
