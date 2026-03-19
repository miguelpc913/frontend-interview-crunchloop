import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addTodoItemSchema,
  editTodoListNameSchema,
  type AddTodoItemFormValues,
  type EditTodoListNameFormValues,
} from '../../../../schemas/todoList.schemas';

interface UseTodoListHeaderOptions {
  name: string;
  onUpdateName: (name: string) => void;
  onAddItem: (name: string) => void;
}

export function useTodoListHeader({
  name,
  onUpdateName,
  onAddItem,
}: UseTodoListHeaderOptions) {
  const listNameForm = useForm<EditTodoListNameFormValues>({
    mode: 'onChange',
    resolver: zodResolver(editTodoListNameSchema),
    defaultValues: { name },
  });

  const addTaskForm = useForm<AddTodoItemFormValues>({
    mode: 'onChange',
    resolver: zodResolver(addTodoItemSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    listNameForm.reset({ name });
  }, [name, listNameForm]);

  function handleListNameBlur() {
    const current = listNameForm.getValues('name');
    const trimmed = current.trim();
    listNameForm.trigger('name').then((valid) => {
      if (!valid) return;
      if (trimmed && trimmed !== name) {
        onUpdateName(trimmed);
      }
    });
  }

  function handleListNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }

  function handleAddSubmit(values: AddTodoItemFormValues) {
    const trimmed = values.name.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    addTaskForm.reset({ name: '' });
  }

  return {
    listNameForm,
    addTaskForm,
    handleListNameBlur,
    handleListNameKeyDown,
    handleAddSubmit: addTaskForm.handleSubmit(handleAddSubmit),
  };
}

