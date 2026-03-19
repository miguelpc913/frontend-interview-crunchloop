import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '@/shared/types/todoList';
import { getTodoListById } from '@/shared/api/todoLists';
import { todoListQueryKeys } from '../../../api/queryKeys';
import { TODO_LIST_STALE_TIME_MS } from '../../../api/queryOptions';

export function useTodoListQuery(todoListId: number) {
  const queryClient = useQueryClient();

  const cachedTodoLists = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);
  const initialData = cachedTodoLists?.find((l) => l.id === todoListId);
  const todoListsQueryState = queryClient.getQueryState<TodoList[]>(todoListQueryKeys.all);
  const initialDataUpdatedAt = todoListsQueryState?.dataUpdatedAt;

  const { data, isLoading, isError, refetch } = useQuery<TodoList, Error>({
    queryKey: todoListQueryKeys.detail(todoListId),
    queryFn: () => getTodoListById(todoListId),
    enabled: todoListId > 0,
    initialData,
    initialDataUpdatedAt,
    staleTime: TODO_LIST_STALE_TIME_MS,
  });

  return {
    todoList: data ?? null,
    isLoading,
    isError,
    refetch,
  };
}
