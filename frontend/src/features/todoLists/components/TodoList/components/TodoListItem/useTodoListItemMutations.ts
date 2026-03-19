import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '../../../../types/todoList';
import {
  updateTodoItem,
  deleteTodoItem,
} from '../../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListItemMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: (params: {
      todoItemId: number;
      updates: { name?: string; description?: string; done?: boolean };
    }) => updateTodoItem(todoListId, params.todoItemId, params.updates),
    onMutate: async ({ todoItemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoList>([
        'todoList',
        todoListId,
      ]);

      if (previous) {
        queryClient.setQueryData<TodoList>(['todoList', todoListId], {
          ...previous,
          todoItems: previous.todoItems.map((item) =>
            item.id === todoItemId ? { ...item, ...updates } : item,
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todoList', todoListId], context.previous);
      }
      toast.error('Could not update the task');
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<TodoList | undefined>(
        ['todoList', todoListId],
        (current) =>
          current
            ? {
                ...current,
                todoItems: current.todoItems.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item,
                ),
              }
            : current,
      );
      toast.success('Task updated');
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

  function handleUpdateItem(
    todoItemId: number,
    updates: { name?: string; description?: string; done?: boolean },
  ) {
    if (todoListId <= 0) return;
    updateItemMutation.mutate({ todoItemId, updates });
  }

  function handleDeleteItem(todoItemId: number) {
    if (todoListId <= 0) return;
    deleteItemMutation.mutate(todoItemId);
  }

  return { handleUpdateItem, handleDeleteItem };
}
