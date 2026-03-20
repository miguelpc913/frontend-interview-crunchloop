import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateTodoItemDto } from '@/features/todoLists/types/todoList';
import { updateTodoItem, deleteTodoItem } from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListMutationKeys, todoListQueryKeys } from '@/shared/query/todoLists';
import {
  removeTodoItemFromCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
  updateTodoItemInCaches,
} from '@/shared/query/todoListCache';

export function useTodoListItemMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationKey: todoListMutationKeys.updateItem(todoListId),
    mutationFn: (params: { todoItemId: number; updates: UpdateTodoItemDto }) =>
      updateTodoItem(todoListId, params.todoItemId, params.updates),
    onMutate: async ({ todoItemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      updateTodoItemInCaches(queryClient, todoListId, todoItemId, (current) => ({
        ...current,
        ...updates,
      }));
      return { snapshot };
    },
    onSuccess: (updatedItem) => {
      updateTodoItemInCaches(queryClient, todoListId, updatedItem.id, () => updatedItem);
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      toast.error('Could not update the task');
    },
  });

  const deleteItemMutation = useMutation({
    mutationKey: todoListMutationKeys.deleteItem(todoListId),
    mutationFn: (todoItemId: number) => deleteTodoItem(todoListId, todoItemId),
    onMutate: async (todoItemId: number) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      removeTodoItemFromCaches(queryClient, todoListId, todoItemId);

      return { snapshot };
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      toast.error('Could not delete the task');
    },
    onSuccess: () => {
      toast.success('Task deleted');
    },
  });

  const handleUpdateItem = useCallback(
    (todoItemId: number, updates: UpdateTodoItemDto) => {
      if (todoListId <= 0) return;
      updateItemMutation.mutate({ todoItemId, updates });
    },
    [todoListId, updateItemMutation],
  );

  const handleDeleteItem = useCallback(
    (todoItemId: number) => {
      if (todoListId <= 0) return;
      deleteItemMutation.mutate(todoItemId);
    },
    [todoListId, deleteItemMutation],
  );

  return { handleUpdateItem, handleDeleteItem };
}
