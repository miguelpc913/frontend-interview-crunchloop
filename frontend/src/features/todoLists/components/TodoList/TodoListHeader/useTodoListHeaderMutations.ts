import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '@/shared/types/todoList';
import {
  updateTodoList,
  deleteTodoList,
  addTodoItem,
} from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListMutationKeys, todoListQueryKeys } from '@/shared/query/todoLists';
import {
  addTodoItemToCaches,
  restoreTodoListCaches,
  snapshotTodoListCaches,
} from '@/shared/query/todoListCache';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      const snapshot = snapshotTodoListCaches(queryClient, todoListId);

      queryClient.setQueryData<TodoList | undefined>(
        todoListQueryKeys.detail(todoListId),
        (current) => (current ? { ...current, name } : current),
      );
      queryClient.setQueryData<TodoList[] | undefined>(
        todoListQueryKeys.all,
        (current) =>
          current?.map((list) => (list.id === todoListId ? { ...list, name } : list)),
      );

      return { snapshot };
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

      const previousTodoLists =
        queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);
      const previousTodoList = queryClient.getQueryData<TodoList>(
        todoListQueryKeys.detail(todoListId),
      );

      if (previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          todoListQueryKeys.all,
          previousTodoLists.filter((list) => list.id !== todoListId),
        );
      }

      return { previousTodoLists, previousTodoList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          todoListQueryKeys.all,
          context.previousTodoLists,
        );
      }
      if (context?.previousTodoList) {
        queryClient.setQueryData<TodoList>(
          todoListQueryKeys.detail(todoListId),
          context.previousTodoList,
        );
      }
      toast.error('Could not delete the list');
    },
    onSuccess: () => {
      toast.success('List deleted');
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    mutationKey: todoListMutationKeys.addItem(todoListId),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
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
        queryClient.setQueryData<TodoList | undefined>(
          todoListQueryKeys.detail(todoListId),
          (current) => {
            if (!current) return current;
            return {
              ...current,
              todoItems: current.todoItems.map((item) =>
                item.id === context.optimisticId ? createdItem : item,
              ),
            };
          },
        );
        queryClient.setQueryData<TodoList[] | undefined>(
          todoListQueryKeys.all,
          (current) =>
            current?.map((list) =>
              list.id !== todoListId
                ? list
                : {
                    ...list,
                    todoItems: list.todoItems.map((item) =>
                      item.id === context.optimisticId ? createdItem : item,
                    ),
                  },
            ),
        );
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

  return {
    handleUpdateName: (name: string) => {
      if (todoListId <= 0) return;
      updateNameMutation.mutate(name);
    },
    handleDeleteList: () => {
      if (todoListId <= 0) return;
      deleteListMutation.mutate();
    },
    handleAddItem: (name: string) => {
      if (todoListId <= 0) return;
      addItemMutation.mutate(name);
    },
  };
}
