import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TodoList as TodoListType } from '../../../types/todoList';
import {
  getTodoListById,
  updateTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  deleteTodoList,
} from '../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoList(todoListId: number) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<TodoListType, Error>({
    queryKey: ['todoList', todoListId],
    queryFn: () => getTodoListById(todoListId),
    // Prevent optimistic placeholder ids (we use <= 0 as temp ids)
    // from triggering an API request for a list that doesn't exist yet.
    enabled: todoListId > 0,
  });

  const todoList = data ?? null;

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load todo list');
    }
  }, [isError]);

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoListType>([
        'todoList',
        todoListId,
      ]);
      if (previous) {
        queryClient.setQueryData<TodoListType>(['todoList', todoListId], {
          ...previous,
          name,
        });
      }
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todoList', todoListId], context.previous);
      }
      toast.error('Could not rename the list');
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['todoList', todoListId], updated);
      toast.success('List name updated');
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoListType>([
        'todoList',
        todoListId,
      ]);

      if (previous) {
        const optimisticItemId = Math.max(
          0,
          ...previous.todoItems.map((i) => i.id),
        ) + 1;

        const optimisticItem = {
          id: optimisticItemId,
          name,
          description: '',
          done: false,
          todoListId: previous.id,
        };

        queryClient.setQueryData<TodoListType>(['todoList', todoListId], {
          ...previous,
          todoItems: [...previous.todoItems, optimisticItem],
        });

        return { previous };
      }

      return { previous: undefined };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todoList', todoListId], context.previous);
      }
      toast.error('Could not add the task');
    },
    onSuccess: (created) => {
      queryClient.setQueryData<TodoListType | undefined>(
        ['todoList', todoListId],
        (current) =>
          current
            ? {
                ...current,
                todoItems: current.todoItems
                  .filter((item) => item.name !== created.name || item.id === created.id)
                  .map((item) => (item.id === created.id ? created : item)),
              }
            : current,
      );
      toast.success('Task added');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListId] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: (params: {
      todoItemId: number;
      updates: { name?: string; description?: string; done?: boolean };
    }) => updateTodoItem(todoListId, params.todoItemId, params.updates),
    onMutate: async ({ todoItemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoListType>([
        'todoList',
        todoListId,
      ]);

      if (previous) {
        queryClient.setQueryData<TodoListType>(['todoList', todoListId], {
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
      queryClient.setQueryData<TodoListType | undefined>(
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
      const previous = queryClient.getQueryData<TodoListType>([
        'todoList',
        todoListId,
      ]);

      if (previous) {
        queryClient.setQueryData<TodoListType>(['todoList', todoListId], {
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

  const deleteListMutation = useMutation({
    mutationFn: () => deleteTodoList(todoListId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });

      const previousTodoLists =
        queryClient.getQueryData<TodoListType[]>(['todoLists']);
      const previousTodoList = queryClient.getQueryData<TodoListType>([
        'todoList',
        todoListId,
      ]);

      if (previousTodoLists) {
        queryClient.setQueryData<TodoListType[]>(
          ['todoLists'],
          previousTodoLists.filter((list) => list.id !== todoListId),
        );
      }

      return { previousTodoLists, previousTodoList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData<TodoListType[]>(
          ['todoLists'],
          context.previousTodoLists,
        );
      }
      if (context?.previousTodoList) {
        queryClient.setQueryData<TodoListType>(
          ['todoList', todoListId],
          context.previousTodoList,
        );
      }
      toast.error('Could not delete the list');
    },
    onSuccess: () => {
      toast.success('List deleted');
    },
  });

  function handleUpdateName(name: string) {
    if (todoListId <= 0) return;
    updateNameMutation.mutate(name);
  }

  function handleAddItem(name: string) {
    if (todoListId <= 0) return;
    addItemMutation.mutate(name);
  }

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

  function handleDeleteList() {
    if (todoListId <= 0) return;
    deleteListMutation.mutate();
  }

  return {
    todoList,
    isLoading,
    isError,
    refetch,
    handleUpdateName,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleDeleteList,
  };
}

