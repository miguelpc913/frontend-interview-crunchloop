import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TodoList } from '../../../../types/todoList';
import {
  updateTodoList,
  deleteTodoList,
  addTodoItem,
} from '../../../../services/todoListService';
import toast from 'react-hot-toast';

export function useTodoListHeaderMutations(todoListId: number) {
  const queryClient = useQueryClient();

  const updateNameMutation = useMutation({
    mutationFn: (name: string) => updateTodoList(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoList>([
        'todoList',
        todoListId,
      ]);
      if (previous) {
        queryClient.setQueryData<TodoList>(['todoList', todoListId], {
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

  const deleteListMutation = useMutation({
    mutationFn: () => deleteTodoList(todoListId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });

      const previousTodoLists =
        queryClient.getQueryData<TodoList[]>(['todoLists']);
      const previousTodoList = queryClient.getQueryData<TodoList>([
        'todoList',
        todoListId,
      ]);

      if (previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          ['todoLists'],
          previousTodoLists.filter((list) => list.id !== todoListId),
        );
      }

      return { previousTodoLists, previousTodoList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodoLists) {
        queryClient.setQueryData<TodoList[]>(
          ['todoLists'],
          context.previousTodoLists,
        );
      }
      if (context?.previousTodoList) {
        queryClient.setQueryData<TodoList>(
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

  const addItemMutation = useMutation({
    mutationFn: (name: string) => addTodoItem(todoListId, { name }),
    onMutate: async (name: string) => {
      await queryClient.cancelQueries({ queryKey: ['todoList', todoListId] });
      const previous = queryClient.getQueryData<TodoList>([
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

        queryClient.setQueryData<TodoList>(['todoList', todoListId], {
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
      queryClient.setQueryData<TodoList | undefined>(
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

  function handleUpdateName(name: string) {
    if (todoListId <= 0) return;
    updateNameMutation.mutate(name);
  }

  function handleDeleteList() {
    if (todoListId <= 0) return;
    deleteListMutation.mutate();
  }

  function handleAddItem(name: string) {
    if (todoListId <= 0) return;
    addItemMutation.mutate(name);
  }

  return { handleUpdateName, handleDeleteList, handleAddItem };
}
