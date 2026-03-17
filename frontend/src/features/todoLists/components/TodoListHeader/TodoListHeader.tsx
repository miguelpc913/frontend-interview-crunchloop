import { useTodoListHeader } from './useTodoListHeader';

export interface TodoListHeaderProps {
  name: string;
  onUpdateName: (name: string) => void;
  onAddItem: (name: string) => void;
}

export function TodoListHeader({ name, onUpdateName, onAddItem }: TodoListHeaderProps) {
  const { listNameField, newTaskName, setNewTaskName, handleAddSubmit } =
    useTodoListHeader({ name, onUpdateName, onAddItem });

  return (
    <div>
      <div className="bg-black px-6 py-4 text-center">
        <input
          className="w-full bg-transparent border-none outline-none text-white text-2xl font-bold italic text-center font-sans"
          type="text"
          name="listName"
          value={listNameField.value}
          onChange={listNameField.onChange}
          onBlur={listNameField.onBlur}
          onKeyDown={listNameField.onKeyDown}
        />
      </div>
      <form
        className="flex items-center gap-2 px-6 py-4 border-b border-gray-200"
        onSubmit={handleAddSubmit}
      >
        <input
          className="flex-1 border-2 border-black rounded-full px-4 py-2 text-sm font-sans outline-none bg-white placeholder:italic placeholder:text-gray-400"
          type="text"
          placeholder="Add your task..."
          value={newTaskName}
          name="newTaskName"
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          className="w-9 h-9 rounded-full border-none bg-black text-white flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-80"
          type="submit"
          aria-label="Add task"
        >
          <svg
            className="w-5 h-5"
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

