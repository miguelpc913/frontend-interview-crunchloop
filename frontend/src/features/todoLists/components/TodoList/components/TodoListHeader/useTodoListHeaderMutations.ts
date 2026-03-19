import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoItem, TodoList } from '@/shared/types/todoList';
import {
  updateTodoList,
  deleteTodoList,
  addTodoItem,
} from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListQueryKeys } from '../../../../api/queryKeys';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onError: () => {
      toast.error('Could not rename the list');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
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
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    mutationKey: todoListQueryKeys.addItem(todoListId),
    onSuccess: (createdItem) => {
      queryClient.setQueryData<TodoList | undefined>(
        todoListQueryKeys.detail(todoListId),
        (current) => {
          if (!current) return current;
          if (current.todoItems.some((item) => item.id === createdItem.id)) {
            return current;
          }
          return {
            ...current,
            todoItems: [...current.todoItems, createdItem],
          };
        },
      );

      queryClient.setQueryData<TodoList[] | undefined>(
        todoListQueryKeys.all,
        (current) => {
          if (!current) return current;
          return current.map((list) =>
            list.id !== todoListId
              ? list
              : {
                  ...list,
                  todoItems: list.todoItems.some((item: TodoItem) => item.id === createdItem.id)
                    ? list.todoItems
                    : [...list.todoItems, createdItem],
                },
          );
        },
      );
      toast.success('Task added');
    },
    onError: () => {
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
