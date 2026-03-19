import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoItem, TodoList } from '@/shared/types/todoList';
import { UpdateTodoItemDto } from '@/features/todoLists/types/todoList';
import {
  updateTodoItem,
  deleteTodoItem,
} from '@/shared/api/todoLists';
import toast from 'react-hot-toast';
import { todoListQueryKeys } from '../../../../../api/queryKeys';

export function useTodoListItemMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: (params: {
      todoItemId: number;
      updates: UpdateTodoItemDto;
    }) => updateTodoItem(todoListId, params.todoItemId, params.updates),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<TodoList | undefined>(
        todoListQueryKeys.detail(todoListId),
        (current) => {
          if (!current) return current;
          return {
            ...current,
            todoItems: current.todoItems.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
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
                  todoItems: list.todoItems.map((item: TodoItem) =>
                    item.id === updatedItem.id ? updatedItem : item,
                  ),
                },
          );
        },
      );
    },
    onError: () => {
      toast.error('Could not update the task');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (todoItemId: number) => deleteTodoItem(todoListId, todoItemId),
    onMutate: async (todoItemId: number) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) });
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });

      const previous = queryClient.getQueryData<TodoList>(
        todoListQueryKeys.detail(todoListId),
      );
      const previousLists = queryClient.getQueryData<TodoList[]>(todoListQueryKeys.all);

      if (previous) {
        queryClient.setQueryData<TodoList>(todoListQueryKeys.detail(todoListId), {
          ...previous,
          todoItems: previous.todoItems.filter((item) => item.id !== todoItemId),
        });
      }

      if (previousLists) {
        queryClient.setQueryData<TodoList[]>(
          todoListQueryKeys.all,
          previousLists.map((list) =>
            list.id !== todoListId
              ? list
              : {
                  ...list,
                  todoItems: list.todoItems.filter((item) => item.id !== todoItemId),
                },
          ),
        );
      }

      return { previous, previousLists };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(todoListQueryKeys.detail(todoListId), context.previous);
      }
      if (context?.previousLists) {
        queryClient.setQueryData(todoListQueryKeys.all, context.previousLists);
      }
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
    updateItemMutation,
  };
}
