import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TodoList } from '../../../types/todoList';
import { getTodoListById } from '../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListQuery(todoListId: number) {
  const { data, isLoading, isError, refetch } = useQuery<TodoList, Error>({
    queryKey: ['todoList', todoListId],
    queryFn: () => getTodoListById(todoListId),
    enabled: todoListId > 0,
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
