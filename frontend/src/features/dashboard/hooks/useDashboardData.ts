import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TodoList } from '@/shared/types/todoList';
import { getAllTodoLists } from '@/shared/api/todoLists';
import { todoListQueryKeys, TODO_LIST_STALE_TIME_MS } from '@/shared/query/todoLists';

const EMPTY_TODO_LISTS: TodoList[] = [];

export interface ListChartData {
  id: number;
  name: string;
  done: number;
  pending: number;
  total: number;
  percentage: number;
}

export function useDashboardData() {
  const { data, isLoading, isError } = useQuery<TodoList[]>({
    queryKey: todoListQueryKeys.all,
    queryFn: getAllTodoLists,
    staleTime: TODO_LIST_STALE_TIME_MS,
  });

  const todoLists = data ?? EMPTY_TODO_LISTS;

  const globalCompletion = useMemo(() => {
    const done = todoLists.reduce(
      (sum, list) => sum + list.todoItems.filter((i) => i.done).length,
      0,
    );
    const total = todoLists.reduce((sum, list) => sum + list.todoItems.length, 0);
    return { done, pending: total - done, total };
  }, [todoLists]);

  const perListData = useMemo<ListChartData[]>(() => {
    return todoLists.map((list) => {
      const done = list.todoItems.filter((i) => i.done).length;
      const pending = list.todoItems.filter((i) => !i.done).length;
      const total = list.todoItems.length;
      return {
        id: list.id,
        name: list.name,
        done,
        pending,
        total,
        percentage: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });
  }, [todoLists]);

  const largestLists = useMemo(() => {
    return [...perListData].sort((a, b) => b.total - a.total);
  }, [perListData]);

  return {
    globalCompletion,
    perListData,
    largestLists,
    isLoading,
    isError,
  };
}
