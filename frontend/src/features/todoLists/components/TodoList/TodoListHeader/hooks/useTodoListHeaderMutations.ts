import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodoList, deleteTodoList, addTodoItem } from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListMutationKeys, todoListQueryKeys } from '@/shared/query/todoLists';
import {
  addTodoItemToCaches,
  removeTodoListFromCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
  updateTodoListInCaches,
} from '@/shared/query/todoListCache';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateListNameMutation = useMutation({
    mutationKey: todoListMutationKeys.update(todoListId),
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      updateTodoListInCaches(queryClient, todoListId, (current) => ({ ...current, name }));
      return { snapshot };
    },
    onSuccess: (updated) => {
      updateTodoListInCaches(queryClient, todoListId, (current) => ({
        ...current,
        name: updated.name,
      }));
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      toast.error('Could not rename the list');
    },
  });

  const deleteListMutation = useMutation({
    mutationKey: todoListMutationKeys.delete(todoListId),
    mutationFn: () => deleteTodoList(todoListId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      removeTodoListFromCaches(queryClient, todoListId);
      return { snapshot };
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      toast.error('Could not delete the list');
    },
    onSuccess: () => {
      toast.success('List deleted');
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    mutationKey: todoListMutationKeys.addItem(todoListId),
    onSuccess: (createdItem) => {
      addTodoItemToCaches(queryClient, todoListId, createdItem);
      toast.success('Task added');
    },
    onError: () => {
      toast.error('Could not add the task');
    },
  });

  const handleUpdateName = useCallback(
    (name: string) => {
      if (todoListId <= 0) return;
      updateListNameMutation.mutate(name);
    },
    [todoListId, updateListNameMutation],
  );

  const handleDeleteList = useCallback(() => {
    if (todoListId <= 0) return;
    deleteListMutation.mutate();
  }, [todoListId, deleteListMutation]);

  const handleAddItem = useCallback(
    (name: string) => {
      if (todoListId <= 0) return;
      addItemMutation.mutate(name);
    },
    [todoListId, addItemMutation],
  );

  return { handleUpdateName, handleDeleteList, handleAddItem };
}
