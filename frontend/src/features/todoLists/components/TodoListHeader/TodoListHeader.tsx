import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListTodo, Plus } from 'lucide-react';
import { useTodoListHeader } from './useTodoListHeader';

export interface TodoListHeaderProps {
  name: string;
  onUpdateName: (name: string) => void;
  onAddItem: (name: string) => void;
  disabled?: boolean;
}

export function TodoListHeader({
  name,
  onUpdateName,
  onAddItem,
  disabled = false,
}: TodoListHeaderProps) {
  const { listNameField, newTaskName, setNewTaskName, handleAddSubmit } =
    useTodoListHeader({ name, onUpdateName, onAddItem });

  return (
    <div className="px-4 pt-4 pb-3 border-b border-border">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/10 dark:bg-slate-100 dark:text-slate-900 dark:shadow-black/20">
          <ListTodo className="h-4 w-4" aria-hidden="true" />
        </span>
        <Input
          className="h-9 w-full border-none bg-transparent px-0 text-xl md:text-2xl font-semibold tracking-tight text-slate-900 font-sans placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-500"
          type="text"
          name="listName"
          value={listNameField.value}
          onChange={listNameField.onChange}
          onBlur={listNameField.onBlur}
          onKeyDown={listNameField.onKeyDown}
          disabled={disabled}
        />
      </div>
      <form
        className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring"
        onSubmit={handleAddSubmit}
      >
        <Input
          className="h-8 flex-1 border-none bg-transparent px-0 text-sm font-sans text-slate-900 placeholder:italic placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-500"
          type="text"
          placeholder="Add your task..."
          value={newTaskName}
          name="newTaskName"
          onChange={(e) => setNewTaskName(e.target.value)}
          disabled={disabled}
        />
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/20 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          aria-label="Add task"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}

