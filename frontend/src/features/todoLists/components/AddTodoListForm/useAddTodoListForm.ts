import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { TodoList } from '@/shared/types/todoList';
import { CreateTodoListDto } from '@/features/todoLists/types/todoList';
import { createTodoList } from '@/shared/api/todoLists';
import {
  createTodoListSchema,
  type CreateTodoListFormValues,
} from '../../schemas/todoList.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoListMutationKeys, todoListQueryKeys } from '@/shared/query/todoLists';
import {
  addTodoListToCaches,
  removeTodoListFromCaches,
  replaceTodoListInCaches,
} from '@/shared/query/todoListCache';

interface UseAddTodoListFormOptions {
  initialValue?: string;
}

interface OptimisticContext {
  tempId: number;
}

export function useAddTodoListForm({ initialValue = '' }: UseAddTodoListFormOptions = {}) {
  const queryClient = useQueryClient();
  const form = useForm<CreateTodoListFormValues>({
    mode: 'onChange',
    resolver: zodResolver(createTodoListSchema),
    defaultValues: {
      name: initialValue,
    },
  });

  const createListMutation = useMutation<TodoList, Error, CreateTodoListDto, OptimisticContext>({
    mutationKey: todoListMutationKeys.create(),
    mutationFn: (dto) => createTodoList(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: todoListQueryKeys.all });
      const tempId = -Date.now();
      addTodoListToCaches(queryClient, {
        id: tempId,
        name: dto.name.trim(),
        todoItems: [],
      });
      return { tempId };
    },
    onError: (err, _dto, context) => {
      if (!context) return;
      removeTodoListFromCaches(queryClient, context.tempId);
      queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all });
      toast.error(err.message || 'Could not create todo list');
    },
    onSuccess: (created, _dto, context) => {
      if (!context) return;
      replaceTodoListInCaches(queryClient, context.tempId, created);
      form.reset({ name: '' });
      toast.success('Todo list created');
    },
  });

  function onValidSubmit(values: CreateTodoListFormValues) {
    createListMutation.mutate({ name: values.name.trim() });
  }

  const errorMessage =
    createListMutation.error instanceof Error ? createListMutation.error.message : undefined;

  return {
    form,
    handleSubmit: form.handleSubmit(onValidSubmit),
    isSubmitting: createListMutation.isPending,
    errorMessage,
  };
}
