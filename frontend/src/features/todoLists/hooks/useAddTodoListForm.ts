import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import type { CreateTodoListDto, TodoList } from '../types/todoList';
import { createTodoList } from '../services/todoListService';
import {
  createTodoListSchema,
  type CreateTodoListFormValues,
} from '../schemas/todoList.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseAddTodoListFormOptions {
  initialValue?: string;
}

interface OptimisticContext {
  previous?: TodoList[];
  tempId: number;
}

export function useAddTodoListForm({
  initialValue = '',
}: UseAddTodoListFormOptions = {}) {
  const queryClient = useQueryClient();
  const form = useForm<CreateTodoListFormValues>({
    mode: 'onChange',
    resolver: zodResolver(createTodoListSchema),
    defaultValues: {
      name: initialValue,
    },
  });

  const createMutation = useMutation<
    TodoList,
    Error,
    CreateTodoListDto,
    OptimisticContext
  >({
    mutationFn: (dto) => createTodoList(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ['todoLists'] });

      const previous = queryClient.getQueryData<TodoList[]>(['todoLists']);
      const tempId = -Date.now();
      const optimisticList: TodoList = {
        id: tempId,
        name: dto.name.trim(),
        todoItems: [],
      };

      queryClient.setQueryData<TodoList[]>(['todoLists'], (old) => {
        const current = old ?? [];
        return [...current, optimisticList];
      });

      // Seed the per-list cache so `TodoList` can render without fetching
      // (we also disable fetching for temporary ids in `useTodoList`).
      queryClient.setQueryData<TodoList>(['todoList', tempId], optimisticList);

      return { previous, tempId };
    },
    onError: (err, _dto, context) => {
      if (!context) return;

      queryClient.setQueryData<TodoList[] | undefined>(
        ['todoLists'],
        context.previous,
      );
      queryClient.removeQueries({ queryKey: ['todoList', context.tempId] });
      toast.error(err.message || 'Could not create todo list');
    },
    onSuccess: (created, _dto, context) => {
      if (!context) return;

      queryClient.setQueryData<TodoList[]>(['todoLists'], (old) => {
        const current = old ?? [];
        const hasOptimisticEntry = current.some(
          (list) => list.id === context.tempId,
        );

        if (hasOptimisticEntry) {
          return current.map((list) =>
            list.id === context.tempId ? created : list,
          );
        }

        // Fallback: if the optimistic entry is missing, still ensure the created list is present.
        return [...current, created];
      });

      queryClient.setQueryData<TodoList>(['todoList', created.id], created);
      queryClient.removeQueries({ queryKey: ['todoList', context.tempId] });

      form.reset({ name: '' });
      toast.success('Todo list created');
    },
  });

  function onValidSubmit(values: CreateTodoListFormValues) {
    createMutation.mutate({ name: values.name.trim() });
  }

  const errorMessage =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : undefined;

  return {
    form,
    handleSubmit: form.handleSubmit(onValidSubmit),
    isSubmitting: createMutation.isPending,
    errorMessage,
  };
}

