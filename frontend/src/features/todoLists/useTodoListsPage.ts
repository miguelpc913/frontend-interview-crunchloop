import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TodoList as TodoListType } from './types/todoList';
import { getAllTodoLists } from './services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery<
    TodoListType[],
    Error
  >({
    queryKey: ['todoLists'],
    queryFn: getAllTodoLists,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load todo lists');
    }
  }, [isError, error]);

  const todoLists: TodoListType[] = data ?? [];

  return {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
  };
}

