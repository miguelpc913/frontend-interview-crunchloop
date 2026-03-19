import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import type { TodoList } from '@/shared/types/todoList';
import { todoListQueryKeys } from './todoLists';
import {
  addTodoItemToCaches,
  removeTodoItemFromCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
  updateTodoItemInCaches,
} from './todoListCache';

function makeList(): TodoList {
  return {
    id: 1,
    name: 'List One',
    todoItems: [
      { id: 1, name: 'Task A', description: 'Alpha', done: false },
      { id: 2, name: 'Task B', description: 'Beta', done: true },
    ],
  };
}

function setupClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const list = makeList();
  queryClient.setQueryData(todoListQueryKeys.detail(1), list);
  queryClient.setQueryData(todoListQueryKeys.all, [list]);
  return queryClient;
}

describe('todoListCache', () => {
  it('snapshots detail and all caches', () => {
    const queryClient = setupClient();

    const snapshot = snapshotTodoListCaches(queryClient, 1);

    expect(snapshot.previousDetail?.id).toBe(1);
    expect(snapshot.previousAll).toHaveLength(1);
  });

  it('restores caches from snapshot and no-ops without snapshot', () => {
    const queryClient = setupClient();
    const snapshot = snapshotTodoListCaches(queryClient, 1);

    queryClient.removeQueries({ queryKey: todoListQueryKeys.detail(1) });
    queryClient.setQueryData(todoListQueryKeys.all, []);

    restoreTodoListCaches(queryClient, 1, snapshot);

    expect(queryClient.getQueryData(todoListQueryKeys.detail(1))).toEqual(snapshot.previousDetail);
    expect(queryClient.getQueryData(todoListQueryKeys.all)).toEqual(snapshot.previousAll);

    restoreTodoListCaches(queryClient, 1, undefined);
    expect(queryClient.getQueryData(todoListQueryKeys.detail(1))).toEqual(snapshot.previousDetail);
  });

  it('updates item in detail and all caches', () => {
    const queryClient = setupClient();

    updateTodoItemInCaches(queryClient, 1, 1, (item) => ({
      ...item,
      name: 'Updated Task',
      done: true,
    }));

    const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
    const all = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);

    expect(detail?.todoItems[0]).toMatchObject({ id: 1, name: 'Updated Task', done: true });
    expect(all?.[0]?.todoItems[0]).toMatchObject({ id: 1, name: 'Updated Task', done: true });
  });

  it('adds item to both caches and deduplicates by id', () => {
    const queryClient = setupClient();
    const newItem = { id: 3, name: 'Task C', description: '', done: false };

    addTodoItemToCaches(queryClient, 1, newItem);
    addTodoItemToCaches(queryClient, 1, newItem);

    const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
    const all = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);

    expect(detail?.todoItems.map((item) => item.id)).toEqual([1, 2, 3]);
    expect(all?.[0]?.todoItems.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('removes item from both caches', () => {
    const queryClient = setupClient();

    removeTodoItemFromCaches(queryClient, 1, 2);

    const detail = queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(1));
    const all = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);

    expect(detail?.todoItems.map((item) => item.id)).toEqual([1]);
    expect(all?.[0]?.todoItems.map((item) => item.id)).toEqual([1]);
  });
});
