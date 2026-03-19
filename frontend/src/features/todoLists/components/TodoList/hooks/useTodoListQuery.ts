import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '../../../types/todoList';
import { getTodoListById } from '../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListQuery(todoListId: number) {
  const queryClient = useQueryClient();

  const cachedTodoLists = queryClient.getQueryData<TodoList[]>(['todoLists']);
  const initialData = cachedTodoLists?.find((l) => l.id === todoListId);
  const todoListsQueryState = queryClient.getQueryState<TodoList[]>(['todoLists']);
  const initialDataUpdatedAt = todoListsQueryState?.dataUpdatedAt;

  const { data, isLoading, isError, refetch } = useQuery<TodoList, Error>({
    queryKey: ['todoList', todoListId],
    queryFn: () => getTodoListById(todoListId),
    enabled: todoListId > 0,
    initialData,
    initialDataUpdatedAt,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load todo list');
    }
  }, [isError]);

  return {
    todoList: data ?? null,
    isLoading,
    isError,
    refetch,
  };
}
