import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList, UpdateTodoItemDto } from '../../../../../types/todoList';
import {
  updateTodoItem,
  deleteTodoItem,
} from '../../../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListItemMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: (params: {
      todoItemId: number;
      updates: UpdateTodoItemDto;
    }) => updateTodoItem(todoListId, params.todoItemId, params.updates),
    onError: () => {
      toast.error('Could not update the task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (todoItemId: number) => deleteTodoItem(todoListId, todoItemId),
    onMutate: async (todoItemId: number) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoList>([
        'todoList',
        todoListId,
      ]);

      if (previous) {
        queryClient.setQueryData<TodoList>(['todoList', todoListId], {
          ...previous,
          todoItems: previous.todoItems.filter((item) => item.id !== todoItemId),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todoList', todoListId], context.previous);
      }
      toast.error('Could not delete the task');
    },
    onSuccess: () => {
      toast.success('Task deleted');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const handleUpdateItem = useCallback((
    todoItemId: number,
    updates: UpdateTodoItemDto,
  ) => {
    if (todoListId <= 0) return;
    updateItemMutation.mutate({ todoItemId, updates });
  }, [todoListId, updateItemMutation]);

  const handleDeleteItem = useCallback((todoItemId: number) => {
    if (todoListId <= 0) return;
    deleteItemMutation.mutate(todoItemId);
  }, [todoListId, deleteItemMutation]);

  return { handleUpdateItem, handleDeleteItem, updateItemMutation };
}
