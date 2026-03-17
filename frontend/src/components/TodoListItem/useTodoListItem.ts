import type { TodoItem, UpdateTodoItemDto } from '../../types/todoList';
import { useEditableField } from '../../hooks/useEditableField';

interface UseTodoListItemOptions {
  item: TodoItem;
  onUpdate: (updates: UpdateTodoItemDto) => void;
  onDelete: () => void;
}

export function useTodoListItem({ item, onUpdate, onDelete }: UseTodoListItemOptions) {
  const nameField = useEditableField({
    initialValue: item.name,
    onCommit: (value) => onUpdate({ name: value }),
  });

  const descriptionField = useEditableField({
    initialValue: item.description ?? '',
    onCommit: (value) => onUpdate({ description: value }),
  });

  function handleToggleDone() {
    onUpdate({ done: !item.done });
  }


  return {
    nameField,
    descriptionField,
    handleToggleDone,
    onDelete,
  };
}

