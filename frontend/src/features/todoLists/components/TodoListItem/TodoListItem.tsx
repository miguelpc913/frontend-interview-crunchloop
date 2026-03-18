import { CheckCircle2, Circle, GripVertical, Trash2 } from 'lucide-react';
import type { TodoItem, UpdateTodoItemDto } from '../../types/todoList';
import { useTodoListItem } from './useTodoListItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoListItemProps {
  item: TodoItem;
  onUpdate: (updates: UpdateTodoItemDto) => void;
  onDelete: () => void;
  isDraggable?: boolean;
}

export function TodoListItem({
  item,
  onUpdate,
  onDelete,
  isDraggable = false,
}: TodoListItemProps) {
  const { nameField, descriptionField, handleToggleDone } =
    useTodoListItem({
      item,
      onUpdate,
      onDelete,
    });

  const baseClasses =
    'group flex items-start gap-3 px-2.5 py-2.5 rounded-lg border border-transparent transition-colors transition-shadow duration-150 hover:bg-slate-50 hover:border-slate-200/80 dark:hover:bg-slate-800/80 dark:hover:border-slate-700/80';
  const doneClasses = item.done ? ' opacity-80' : '';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      disabled: !isDraggable,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className={baseClasses + doneClasses}>
      {isDraggable && (
        <button
          type="button"
          className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shrink-0 dark:text-slate-600 dark:hover:text-slate-300 dark:focus-visible:ring-slate-500"
          aria-label="Reorder task"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        className="flex h-6 w-6 items-center justify-center rounded-full border border-transparent text-slate-400 hover:text-slate-900 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shrink-0 dark:text-slate-500 dark:hover:text-slate-100 dark:hover:border-slate-600 dark:focus-visible:ring-slate-500"
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
          className={`w-full border-none outline-none bg-transparent py-0.5 font-sans text-sm font-semibold tracking-tight ${
            item.done
              ? 'line-through italic text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-slate-50'
          }`}
          type="text"
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          onKeyDown={nameField.onKeyDown}
        />
        <input
          className={`w-full border-none outline-none text-xs bg-transparent pt-0.5 font-sans leading-relaxed placeholder:italic placeholder:text-slate-300 dark:placeholder:text-slate-500 ${
            item.done
              ? 'line-through italic text-slate-300 dark:text-slate-500'
              : 'text-slate-500 dark:text-slate-400'
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
        className="flex items-center justify-center rounded-full p-1.5 text-slate-400 opacity-60 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-colors transition-opacity duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 dark:focus-visible:ring-red-500/70"
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}

