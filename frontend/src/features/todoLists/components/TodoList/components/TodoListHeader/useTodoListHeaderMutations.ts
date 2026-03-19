import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '../../../../types/todoList';
import {
  updateTodoList,
  deleteTodoList,
  addTodoItem,
} from '../../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onError: () => {
      toast.error('Could not rename the list');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: () => deleteTodoList(todoListId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });

      const previousTodoLists =
        queryClient.getQueryData<TodoList[]>(['todoLists']);
      const previousTodoList = queryClient.getQueryData<TodoList>([
        'todoList',
        todoListId,
      ]);

      if (previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          ['todoLists'],
          previousTodoLists.filter((list) => list.id !== todoListId),
        );
      }

      return { previousTodoLists, previousTodoList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          ['todoLists'],
          context.previousTodoLists,
        );
      }
      if (context?.previousTodoList) {
        queryClient.setQueryData<TodoList>(
          ['todoList', todoListId],
          context.previousTodoList,
        );
      }
      toast.error('Could not delete the list');
    },
    onSuccess: () => {
      toast.success('List deleted');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists'] });
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    mutationKey: ['addTodoItem', todoListId],
    onError: () => {
      toast.error('Could not add the task');
    },
    onSuccess: () => {
      toast.success('Task added');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const handleUpdateName = useCallback((name: string) => {
    if (todoListId <= 0) return;
    updateNameMutation.mutate(name);
  }, [todoListId, updateNameMutation]);

  const handleDeleteList = useCallback(() => {
    if (todoListId <= 0) return;
    deleteListMutation.mutate();
  }, [todoListId, deleteListMutation]);

  const handleAddItem = useCallback((name: string) => {
    if (todoListId <= 0) return;
    addItemMutation.mutate(name);
  }, [todoListId, addItemMutation]);

  return { handleUpdateName, handleDeleteList, handleAddItem };
}
