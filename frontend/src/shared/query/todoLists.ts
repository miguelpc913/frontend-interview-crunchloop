export const todoListQueryKeys = {
  all: ['todoLists'] as const,
  detail: (todoListId: number) => ['todoLists', todoListId] as const,
};

export const todoListMutationKeys = {
  create: () => ['todoLists', 'create'] as const,
  update: (todoListId: number) => ['todoLists', todoListId, 'update'] as const,
  delete: (todoListId: number) => ['todoLists', todoListId, 'delete'] as const,
  addItem: (todoListId: number) => ['todoLists', todoListId, 'addItem'] as const,
  updateItem: (todoListId: number) => ['todoLists', todoListId, 'updateItem'] as const,
  deleteItem: (todoListId: number) => ['todoLists', todoListId, 'deleteItem'] as const,
};

export const TODO_LIST_STALE_TIME_MS = 1000 * 30;
