import { useTodoListHeader } from './useTodoListHeader';
import './TodoListHeader.css';

export interface TodoListHeaderProps {
  name: string;
  onUpdateName: (name: string) => void;
  onAddItem: (name: string) => void;
}

export function TodoListHeader({ name, onUpdateName, onAddItem }: TodoListHeaderProps) {
  const { listNameField, newTaskName, setNewTaskName, handleAddSubmit } =
    useTodoListHeader({ name, onUpdateName, onAddItem });

  return (
    <div className="todo-list-header">
      <div className="todo-list-header__title-bar">
        <input
          className="todo-list-header__title-input"
          type="text"
          name="listName"
          value={listNameField.value}
          onChange={listNameField.onChange}
          onBlur={listNameField.onBlur}
          onKeyDown={listNameField.onKeyDown}
        />
      </div>
      <form className="todo-list-header__form" onSubmit={handleAddSubmit}>
        <input
          className="todo-list-header__task-input"
          type="text"
          placeholder="Add your task..."
          value={newTaskName}
          name="newTaskName"
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button className="todo-list-header__add-btn" type="submit" aria-label="Add task">
          <svg
            className="todo-list-header__add-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </form>
    </div>
  );
}
