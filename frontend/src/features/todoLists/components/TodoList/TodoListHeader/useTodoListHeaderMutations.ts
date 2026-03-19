import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '@/shared/types/todoList';
import { updateTodoList, deleteTodoList, addTodoItem } from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListMutationKeys, todoListQueryKeys } from '@/shared/query/todoLists';
import {
  addTodoItemToCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
  updateTodoItemInCaches,
} from '@/shared/query/todoListCache';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);

      queryClient.setQueryData<TodoList | undefined>(
        todoListQueryKeys.detail(todoListId),
        (current) => (current ? { ...current, name } : current),
      );
      queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) =>
        current?.map((list) => (list.id === todoListId ? { ...list, name } : list)),
      );

      return { snapshot };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<TodoList | undefined>(
        todoListQueryKeys.detail(todoListId),
        (current) => (current ? { ...current, name: updated.name } : current),
      );
      queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) =>
        current?.map((list) => (list.id === todoListId ? { ...list, name: updated.name } : list)),
      );
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      toast.error('Could not rename the list');
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: () => deleteTodoList(todoListId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);

      queryClient.setQueryData<TodoList[] | undefined>(todoListQueryKeys.all, (current) =>
        current?.filter((list) => list.id !== todoListId),
      );
      queryClient.removeQueries({ queryKey: todoListQueryKeys.detail(todoListId) });

      return { snapshot };
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      toast.error('Could not delete the list');
    },
    onSuccess: () => {
      toast.success('List deleted');
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    mutationKey: todoListMutationKeys.addItem(todoListId),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);
      const optimisticId = -Date.now();
      addTodoItemToCaches(queryClient, todoListId, {
        id: optimisticId,
        name: name.trim(),
        description: '',
        done: false,
      });

      return { snapshot, optimisticId };
    },
    onSuccess: (createdItem, _name, context) => {
      if (context?.optimisticId) {
        updateTodoItemInCaches(queryClient, todoListId, context.optimisticId, () => createdItem);
      } else {
        addTodoItemToCaches(queryClient, todoListId, createdItem);
      }
      toast.success('Task added');
    },
    onError: (_err, _variables, context) => {
      restoreTodoListCaches(queryClient, todoListId, context?.snapshot);
      toast.error('Could not add the task');
    },
  });

  const handleUpdateName = useCallback(
    (name: string) => {
      if (todoListId <= 0) return;
      updateNameMutation.mutate(name);
    },
    [todoListId, updateNameMutation],
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
