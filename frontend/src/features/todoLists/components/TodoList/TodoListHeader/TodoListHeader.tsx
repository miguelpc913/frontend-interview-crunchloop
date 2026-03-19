import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Trash2, ListTodo, Plus } from 'lucide-react';
import { ConfirmationDialog } from '@/shared/ui/ConfirmationDialog';
import { useTodoListHeaderMutations } from './useTodoListHeaderMutations';
import { useTodoListHeader } from './useTodoListHeader';

export interface TodoListHeaderProps {
  todoListId: number;
  name: string;
}

export function TodoListHeader({ todoListId, name }: TodoListHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { handleUpdateName, handleDeleteList, handleAddItem } =
    useTodoListHeaderMutations(todoListId);
  const disabled = todoListId <= 0;

  const { listNameForm, addTaskForm, handleListNameBlur, handleListNameKeyDown, handleAddSubmit } =
    useTodoListHeader({ name, onUpdateName: handleUpdateName, onAddItem: handleAddItem });

  const {
    register: registerListName,
    formState: { errors: listNameErrors },
  } = listNameForm;

  const {
    register: registerAddTask,
    formState: { errors: addTaskErrors, isValid: isAddTaskValid },
  } = addTaskForm;

  return (
    <div className="border-border px-4 pt-4 pb-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <ListTodo className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <label htmlFor={`todo-list-name-${todoListId}`} className="sr-only">
            Todo list name
          </label>
          <Input
            id={`todo-list-name-${todoListId}`}
            className="h-9 w-full border-none bg-transparent px-0 font-sans text-xl font-semibold tracking-tight placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent md:text-2xl"
            type="text"
            aria-label="Todo list name"
            {...registerListName('name')}
            onBlur={handleListNameBlur}
            onKeyDown={handleListNameKeyDown}
            disabled={disabled}
            name='name'
            autoComplete='off'
          />
          {listNameErrors.name && (
            <p className="mt-1 text-xs text-red-500">{listNameErrors.name.message}</p>
          )}
        </div>
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete list?"
          description="This will permanently delete the list and all of its tasks."
          confirmLabel="Delete list"
          confirmAriaLabel="Confirm delete list"
          onConfirm={() => {
            handleDeleteList();
            setIsDeleteDialogOpen(false);
          }}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="p-1.5 text-muted-foreground opacity-60 hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete list"
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />
      </div>
      <form
        className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50"
        onSubmit={handleAddSubmit}
      >
        <div className="flex-1">
          <label htmlFor={`todo-list-add-task-${todoListId}`} className="sr-only">
            Task name
          </label>
          <Input
            id={`todo-list-add-task-${todoListId}`}
            className="h-8 w-full border-none bg-transparent px-0 font-sans text-sm placeholder:italic placeholder:text-muted-foreground focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
            type="text"
            placeholder="Add your task..."
            aria-label="Task name"
            {...registerAddTask('name')}
            disabled={disabled}
            autoComplete='off'
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
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
