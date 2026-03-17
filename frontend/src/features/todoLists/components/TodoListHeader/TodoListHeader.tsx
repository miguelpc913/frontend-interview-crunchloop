import { ListTodo, Plus } from 'lucide-react';
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
    <div className="px-4 pt-4 pb-2 border-b border-slate-100 bg-white/90">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-sm">
          <ListTodo className="h-4 w-4" aria-hidden="true" />
        </span>
        <input
          className="w-full bg-transparent border-none outline-none text-xl font-semibold tracking-tight text-slate-900 font-sans placeholder:text-slate-400"
          type="text"
          name="listName"
          value={listNameField.value}
          onChange={listNameField.onChange}
          onBlur={listNameField.onBlur}
          onKeyDown={listNameField.onKeyDown}
        />
      </div>
      <form
        className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200"
        onSubmit={handleAddSubmit}
      >
        <input
          className="flex-1 bg-transparent border-none outline-none text-sm font-sans text-slate-900 placeholder:italic placeholder:text-slate-400"
          type="text"
          placeholder="Add your task..."
          value={newTaskName}
          name="newTaskName"
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-50 text-sm font-medium shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
          type="submit"
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

