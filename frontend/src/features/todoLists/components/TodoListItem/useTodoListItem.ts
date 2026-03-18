import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TodoItem, UpdateTodoItemDto } from '../../types/todoList';
import {
  editTodoItemSchema,
  type EditTodoItemFormValues,
} from '../../schemas/todoList.schemas';

interface UseTodoListItemOptions {
  item: TodoItem;
  onUpdate: (updates: UpdateTodoItemDto) => void;
  onDelete: () => void;
}

export function useTodoListItem({ item, onUpdate, onDelete }: UseTodoListItemOptions) {
  const form = useForm<EditTodoItemFormValues>({
    mode: 'onChange',
    resolver: zodResolver(editTodoItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      name: item.name,
      description: item.description ?? '',
    });
  }, [item.id, item.name, item.description, form]);

  function handleNameBlur() {
    const current = form.getValues('name');
    const trimmed = current.trim();
    form.trigger('name').then((valid) => {
      if (!valid) return;
      if (trimmed && trimmed !== item.name) {
        onUpdate({ name: trimmed });
      }
    });
  }

  function handleDescriptionBlur() {
    const current = form.getValues('description') ?? '';
    form.trigger('description').then((valid) => {
      if (!valid) return;
      if (current !== (item.description ?? '')) {
        onUpdate({ description: current });
      }
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }

  function handleToggleDone() {
    onUpdate({ done: !item.done });
  }

  return {
    form,
    handleNameBlur,
    handleDescriptionBlur,
    handleKeyDown,
    handleToggleDone,
    onDelete,
  };
}

