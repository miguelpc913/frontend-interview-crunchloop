import { useQuery } from '@tanstack/react-query';
import type { TodoList as TodoListType } from './types/todoList';
import { getAllTodoLists } from './services/todoListService';
import toast from 'react-hot-toast';

export function useApp() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TodoListType[], Error>({
    queryKey: ['todoLists'],
    queryFn: getAllTodoLists,
    staleTime: 1000 * 30,
    onError: () => {
      toast.error('Failed to load todo lists');
    },
  });

  return {
    todoLists: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

