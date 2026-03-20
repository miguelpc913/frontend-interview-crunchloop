import type { QueryClient } from '@tanstack/react-query';
import type { TodoItem, TodoList } from '@/shared/types/todoList';
import { todoListQueryKeys } from './todoLists';

export interface TodoListCacheSnapshot {
  previousDetail?: TodoList;
  previousAll?: TodoList[];
}

export function snapshotTodoListCaches(
  queryClient: QueryClient,
  todoListId: number,
): TodoListCacheSnapshot {
  return {
    previousDetail: queryClient.getQueryData<TodoList>(todoListQueryKeys.detail(todoListId)),
    previousAll: queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all),
  };
}

export function restoreTodoListCaches(
  queryClient: QueryClient,
  todoListId: number,
  snapshot?: TodoListCacheSnapshot,
) {
  if (!snapshot) return;
  if (snapshot.previousDetail) {
    queryClient.setQueryData(todoListQueryKeys.detail(todoListId), snapshot.previousDetail);
  }
  if (snapshot.previousAll) {
    queryClient.setQueryData(todoListQueryKeys.all, snapshot.previousAll);
  }
}

export function addTodoListToCaches(queryClient: QueryClient, todoList: TodoList) {
  queryClient.setQueryData<TodoList[]>(todoListQueryKeys.all, (current) => {
    const lists = current ?? [];
    if (lists.some((list) => list.id === todoList.id)) return lists;
    return [...lists, todoList];
  });
  queryClient.setQueryData<TodoList>(todoListQueryKeys.detail(todoList.id), todoList);
}

export function removeTodoListFromCaches(queryClient: QueryClient, todoListId: number) {
  queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) => {
    if (!current) return current;
    return current.filter((list) => list.id !== todoListId);
  });
  queryClient.removeQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
}

export function updateTodoListInCaches(
  queryClient: QueryClient,
  todoListId: number,
  updater: (current: TodoList) => TodoList,
) {
  queryClient.setQueryData<TodoList | undefined>(todoListQueryKeys.detail(todoListId), (current) =>
    current ? updater(current) : current,
  );
  queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) => {
    if (!current) return current;
    return current.map((list) => (list.id === todoListId ? updater(list) : list));
  });
}

export function replaceTodoListInCaches(
  queryClient: QueryClient,
  tempId: number,
  realList: TodoList,
) {
  queryClient.setQueryData<TodoList[]>(todoListQueryKeys.all, (current) => {
    const lists = current ?? [];
    const hasTemp = lists.some((list) => list.id === tempId);
    if (hasTemp) {
      return lists.map((list) => (list.id === tempId ? realList : list));
    }
    return [...lists, realList];
  });
  queryClient.setQueryData<TodoList>(todoListQueryKeys.detail(realList.id), realList);
  queryClient.removeQueries({ queryKey: todoListQueryKeys.detail(tempId) });
}

export function updateTodoItemInCaches(
  queryClient: QueryClient,
  todoListId: number,
  todoItemId: number,
  updater: (current: TodoItem) => TodoItem,
) {
  queryClient.setQueryData<TodoList | undefined>(
    todoListQueryKeys.detail(todoListId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        todoItems: current.todoItems.map((item) => (item.id === todoItemId ? updater(item) : item)),
      };
    },
  );

  queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) => {
    if (!current) return current;
    return current.map((list) =>
      list.id !== todoListId
        ? list
        : {
            ...list,
            todoItems: list.todoItems.map((item) =>
              item.id === todoItemId ? updater(item) : item,
            ),
          },
    );
  });
}

export function addTodoItemToCaches(
  queryClient: QueryClient,
  todoListId: number,
  todoItem: TodoItem,
) {
  queryClient.setQueryData<TodoList | undefined>(
    todoListQueryKeys.detail(todoListId),
    (current) => {
      if (!current) return current;
      if (current.todoItems.some((item) => item.id === todoItem.id)) return current;
      return {
        ...current,
        todoItems: [...current.todoItems, todoItem],
      };
    },
  );

  queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) => {
    if (!current) return current;
    return current.map((list) =>
      list.id !== todoListId
        ? list
        : {
            ...list,
            todoItems: list.todoItems.some((item) => item.id === todoItem.id)
              ? list.todoItems
              : [...list.todoItems, todoItem],
          },
    );
  });
}

export function removeTodoItemFromCaches(
  queryClient: QueryClient,
  todoListId: number,
  todoItemId: number,
) {
  queryClient.setQueryData<TodoList | undefined>(
    todoListQueryKeys.detail(todoListId),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        todoItems: current.todoItems.filter((item) => item.id !== todoItemId),
      };
    },
  );

  queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) => {
    if (!current) return current;
    return current.map((list) =>
      list.id !== todoListId
        ? list
        : {
            ...list,
            todoItems: list.todoItems.filter((item) => item.id !== todoItemId),
          },
    );
  });
}
