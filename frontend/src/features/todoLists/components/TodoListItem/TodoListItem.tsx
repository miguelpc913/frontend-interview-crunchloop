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
    'flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0';
  const doneClasses = item.done ? ' opacity-70' : '';

  return (
    <li className={baseClasses + doneClasses}>
      <button
        className="flex items-center justify-center p-0 bg-transparent border-0 cursor-pointer shrink-0"
        type="button"
        onClick={handleToggleDone}
        aria-label={item.done ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {item.done ? (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" fill="#000" stroke="#000" strokeWidth="2" />
            <path
              d="M7 12.5l3 3 7-7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" stroke="#000" strokeWidth="2" fill="none" />
          </svg>
        )}
      </button>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <input
          className={`w-full border-none outline-none text-base font-medium bg-transparent py-0.5 font-sans ${
            item.done ? 'line-through italic text-gray-400' : 'text-black'
          }`}
          type="text"
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          onKeyDown={nameField.onKeyDown}
        />
        <input
          className={`w-full border-none outline-none text-xs bg-transparent p-0 font-sans placeholder:italic placeholder:text-gray-300 ${
            item.done ? 'line-through italic text-gray-300' : 'text-gray-500'
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
        className="flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer text-black shrink-0 transition-opacity hover:opacity-60"
        type="button"
        onClick={onDelete}
        aria-label="Delete task"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </li>
  );
}

