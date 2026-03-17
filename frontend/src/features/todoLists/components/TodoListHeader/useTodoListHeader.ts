import { useState, type FormEvent } from 'react';
import { useEditableField } from '../../../../hooks/useEditableField';
import type { TodoListHeaderProps } from './TodoListHeader';

export function useTodoListHeader({
  name,
  onUpdateName,
  onAddItem,
}: TodoListHeaderProps) {
  const listNameField = useEditableField({
    initialValue: name,
    onCommit: onUpdateName,
  });

  const [newTaskName, setNewTaskName] = useState('');

  function handleAddSubmit(event: FormEvent) {
    event.preventDefault();
    if (!newTaskName.trim()) return;
    onAddItem(newTaskName.trim());
    setNewTaskName('');
  }

  return {
    listNameField,
    newTaskName,
    setNewTaskName,
    handleAddSubmit,
  };
}

