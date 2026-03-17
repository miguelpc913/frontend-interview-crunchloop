import type { TodoItem, UpdateTodoItemDto } from '../../types/todoList';
import { useTodoListItem } from './useTodoListItem';
import './TodoListItem.css';

interface TodoListItemProps {
  item: TodoItem;
  onUpdate: (updates: UpdateTodoItemDto) => void;
  onDelete: () => void;
}

export function TodoListItem({ item, onUpdate, onDelete }: TodoListItemProps) {
  const { nameField, descriptionField, handleToggleDone, blockClass } =
    useTodoListItem({
      item,
      onUpdate,
      onDelete,
    });

  return (
    <li className={blockClass}>
      <button
        className="todo-list-item__checkbox"
        type="button"
        onClick={handleToggleDone}
        aria-label={item.done ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {item.done ? (
          <svg
            className="todo-list-item__check-icon"
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
            className="todo-list-item__circle-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" stroke="#000" strokeWidth="2" fill="none" />
          </svg>
        )}
      </button>

      <div className="todo-list-item__content">
        <input
          className="todo-list-item__name-input"
          type="text"
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          onKeyDown={nameField.onKeyDown}
        />
        <input
          className="todo-list-item__description-input"
          type="text"
          value={descriptionField.value}
          placeholder="Add a description..."
          onChange={descriptionField.onChange}
          onBlur={descriptionField.onBlur}
          onKeyDown={descriptionField.onKeyDown}
        />
      </div>

      <button
        className="todo-list-item__delete-btn"
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
