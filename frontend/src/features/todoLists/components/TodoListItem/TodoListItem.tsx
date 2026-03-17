import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type { TodoItem, UpdateTodoItemDto } from '../../types/todoList';
import { useTodoListItem } from './useTodoListItem';

interface TodoListItemProps {
  item: TodoItem;
  onUpdate: (updates: UpdateTodoItemDto) => void;
  onDelete: () => void;
}

export function TodoListItem({ item, onUpdate, onDelete }: TodoListItemProps) {
  const { nameField, descriptionField, handleToggleDone } =
    useTodoListItem({
      item,
      onUpdate,
      onDelete,
    });

  const baseClasses =
    'flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-slate-50';
  const doneClasses = item.done ? ' opacity-70' : '';

  return (
    <li className={baseClasses + doneClasses}>
      <button
        className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shrink-0"
        type="button"
        onClick={handleToggleDone}
        aria-label={item.done ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {item.done ? (
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Circle className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <input
          className={`w-full border-none outline-none bg-transparent py-0.5 font-sans text-sm font-medium ${
            item.done ? 'line-through italic text-slate-400' : 'text-slate-900'
          }`}
          type="text"
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          onKeyDown={nameField.onKeyDown}
        />
        <input
          className={`w-full border-none outline-none text-xs bg-transparent p-0 font-sans placeholder:italic placeholder:text-slate-300 ${
            item.done ? 'line-through italic text-slate-300' : 'text-slate-500'
          }`}
          type="text"
          value={descriptionField.value}
          placeholder="Add a description..."
          onChange={descriptionField.onChange}
          onBlur={descriptionField.onBlur}
          onKeyDown={descriptionField.onKeyDown}
        />
      </div>

      <button
        className="flex items-center justify-center rounded-full p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}

