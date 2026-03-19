import { useQuery } from '@tanstack/react-query';
import type { TodoList as TodoListType } from '@/shared/types/todoList';
import { getAllTodoLists } from '@/shared/api/todoLists';
import { TODO_LIST_STALE_TIME_MS, todoListQueryKeys } from '@/shared/query/todoLists';

export function useTodoListsPage() {
  const { data, isLoading, isError, refetch } = useQuery<
    TodoListType[],
    Error
  >({
    queryKey: todoListQueryKeys.all,
    queryFn: getAllTodoLists,
    staleTime: TODO_LIST_STALE_TIME_MS,
  });

  const todoLists: TodoListType[] = data ?? [];

  return {
    todoLists,
    isLoading,
    isError,
    refetch,
  };
}

