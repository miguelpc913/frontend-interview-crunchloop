export const todoListQueryKeys = {
  all: ['todoLists'] as const,
  detail: (todoListId: number) => ['todoList', todoListId] as const,
  addItem: (todoListId: number) => ['addTodoItem', todoListId] as const,
};

export const TODO_LIST_STALE_TIME_MS = 1000 * 30;
