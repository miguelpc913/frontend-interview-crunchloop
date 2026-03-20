import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TodoItem } from '@/shared/types/todoList';
import type { UpdateTodoItemDto } from '../../../types/todoList';
import { editTodoItemSchema, type EditTodoItemFormValues } from '../../../schemas/todoList.schemas';

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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    form.reset({
      name: item.name,
      description: item.description ?? '',
    });
  }, [item.id, item.name, item.description, form]);

  const handleNameBlur = useCallback(() => {
    const current = form.getValues('name');
    const trimmed = current.trim();
    form.trigger('name').then((valid) => {
      if (!valid) return;
      if (trimmed && trimmed !== item.name) {
        onUpdate({ name: trimmed });
      }
    });
  }, [form, item.name, onUpdate]);

  const handleDescriptionBlur = useCallback(() => {
    const current = form.getValues('description') ?? '';
    form.trigger('description').then((valid) => {
      if (!valid) return;
      if (current !== (item.description ?? '')) {
        onUpdate({ description: current });
      }
    });
  }, [form, item.description, onUpdate]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }, []);

  const handleCheckedChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      onUpdate({ done: checked === true });
    },
    [onUpdate],
  );

  const handleDeleteClick = useCallback(() => {
    onDelete();
    setIsDeleteDialogOpen(false);
  }, [onDelete]);

  return {
    form,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleNameBlur,
    handleDescriptionBlur,
    handleKeyDown,
    handleCheckedChange,
    handleDeleteClick,
  };
}
