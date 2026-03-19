import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ListTodo, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTodoListHeader } from './useTodoListHeader';

export interface TodoListHeaderProps {
  name: string;
  onUpdateName: (name: string) => void;
  onAddItem: (name: string) => void;
  onDeleteList: () => void;
  disabled?: boolean;
}

export function TodoListHeader({
  name,
  onUpdateName,
  onAddItem,
  onDeleteList,
  disabled = false,
}: TodoListHeaderProps) {
  const {
    listNameForm,
    addTaskForm,
    handleListNameBlur,
    handleListNameKeyDown,
    handleAddSubmit,
  } = useTodoListHeader({ name, onUpdateName, onAddItem });

  const {
    register: registerListName,
    formState: { errors: listNameErrors },
  } = listNameForm;

  const {
    register: registerAddTask,
    formState: { errors: addTaskErrors, isValid: isAddTaskValid },
  } = addTaskForm;

  return (
    <div className="px-4 pt-4 pb-3 border-b border-border">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/10 dark:bg-slate-100 dark:text-slate-900 dark:shadow-black/20">
          <ListTodo className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <Input
            className="h-9 w-full border-none bg-transparent px-0 text-xl md:text-2xl font-semibold tracking-tight text-slate-900 font-sans placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-500"
            type="text"
            {...registerListName('name')}
            onBlur={handleListNameBlur}
            onKeyDown={handleListNameKeyDown}
            disabled={disabled}
          />
          {listNameErrors.name && (
            <p className="mt-1 text-xs text-red-500">
              {listNameErrors.name.message}
            </p>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="p-1.5 text-slate-400 opacity-60 hover:text-red-500 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10"
              aria-label="Delete list"
              onClick={onDeleteList}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Delete list</TooltipContent>
        </Tooltip>
      </div>
      <form
        className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring"
        onSubmit={handleAddSubmit}
      >
        <div className="flex-1">
          <Input
            className="h-8 w-full border-none bg-transparent px-0 text-sm font-sans text-slate-900 placeholder:italic placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-transparent dark:bg-transparent dark:text-slate-50 dark:placeholder:text-slate-500"
            type="text"
            placeholder="Add your task..."
            {...registerAddTask('name')}
            disabled={disabled}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/20 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          aria-label="Add task"
          disabled={disabled || !isAddTaskValid}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
      {addTaskErrors.name && (
        <p className="mt-1 px-3 text-xs text-red-500">{addTaskErrors.name.message}</p>
      )}
    </div>
  );
}

