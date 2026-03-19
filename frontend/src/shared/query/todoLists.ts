export const todoListQueryKeys = {
  all: ['todoLists'] as const,
  detail: (todoListId: number) => ['todoLists', todoListId] as const,
};

export const todoListMutationKeys = {
  addItem: (todoListId: number) => ['addTodoItem', todoListId] as const,
};

export const TODO_LIST_STALE_TIME_MS = 1000 * 30;
