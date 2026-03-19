import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateTodoItemDto } from '@/features/todoLists/types/todoList';
import {
  updateTodoItem,
  deleteTodoItem,
} from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListQueryKeys } from '@/shared/query/todoLists';
import {
  removeTodoItemFromCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
  updateTodoItemInCaches,
} from '@/shared/query/todoListCache';

export function useTodoListItemMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: (params: {
      todoItemId: number;
      updates: UpdateTodoItemDto;
    }) => updateTodoItem(todoListId, params.todoItemId, params.updates),
    onMutate: async ({ todoItemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      updateTodoItemInCaches(
        queryClient,
        todoListId,
        todoItemId,
        (current) => ({ ...current, ...updates }),
      );
      return { snapshot };
    },
    onSuccess: (updatedItem) => {
      updateTodoItemInCaches(
        queryClient,
        todoListId,
        updatedItem.id,
        () => updatedItem,
      );
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      toast.error('Could not update the task');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (todoItemId: number) => deleteTodoItem(todoListId, todoItemId),
    onMutate: async (todoItemId: number) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      removeTodoItemFromCaches(queryClient, todoListId, todoItemId);

      return { snapshot };
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      toast.error('Could not delete the task');
    },
    onSuccess: () => {
      toast.success('Task deleted');
    },
  });

  return {
    handleUpdateItem: (todoItemId: number, updates: UpdateTodoItemDto) => {
      if (todoListId <= 0) return;
      updateItemMutation.mutate({ todoItemId, updates });
    },
    handleDeleteItem: (todoItemId: number) => {
      if (todoListId <= 0) return;
      deleteItemMutation.mutate(todoItemId);
    },
  };
}
