import { useCallback, useMemo, useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';
import type { TodoItem } from '../../../../../types/todoList';
import { useTodoListItemMutations } from './useTodoListItemMutations';
import { useTodoListItem } from './useTodoListItem';

interface TodoListItemProps {
  todoListId: number;
  item: TodoItem;
  isDraggable?: boolean;
}

export function TodoListItem({
  todoListId,
  item,
  isDraggable = false,
}: TodoListItemProps) {
  const { handleUpdateItem, handleDeleteItem, updateItemMutation } =
    useTodoListItemMutations(todoListId);

  const { form, handleNameBlur, handleDescriptionBlur, handleKeyDown } =
    useTodoListItem({
      item,
      onUpdate: (updates) => handleUpdateItem(item.id, updates),
    });

  const optimisticDone =
    updateItemMutation.isPending &&
    updateItemMutation.variables?.todoItemId === item.id &&
    updateItemMutation.variables.updates.done !== undefined
      ? updateItemMutation.variables.updates.done
      : item.done;

  const { register, formState: { errors } } = form;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: !isDraggable });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.7 : 1,
    }),
    [transform, transition, isDragging],
  );

  const handleCheckedChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      handleUpdateItem(item.id, { done: checked === true });
    },
    [handleUpdateItem, item.id],
  );

  const handleDeleteClick = useCallback(() => {
    handleDeleteItem(item.id);
    setIsDeleteDialogOpen(false);
  }, [handleDeleteItem, item.id]);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2.5 transition-[border-color,background-color] duration-150',
        'hover:border-slate-200/80 hover:bg-slate-50 dark:hover:border-slate-700/80 dark:hover:bg-slate-800/80',
        optimisticDone && 'opacity-80',
      )}
      data-task-name={item.name}
    >
      {isDraggable && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-300"
              aria-label="Reorder task"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Reorder task</TooltipContent>
        </Tooltip>
      )}

      <Checkbox
        checked={optimisticDone}
        onCheckedChange={handleCheckedChange}
        aria-label={optimisticDone ? 'Mark as incomplete' : 'Mark as complete'}
        className="shrink-0"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div>
          <label htmlFor={`todo-item-name-${todoListId}-${item.id}`} className="sr-only">
            Task name
          </label>
          <Input
            id={`todo-item-name-${todoListId}-${item.id}`}
            className={cn(
              'h-7 w-full border-none bg-transparent px-0 py-0.5 font-sans text-sm font-semibold tracking-tight focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent',
              optimisticDone
                ? 'italic text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-50',
            )}
            type="text"
            aria-label="Task name"
            {...register('name')}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
          />
          {errors.name && (
            <p className="mt-0.5 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor={`todo-item-description-${todoListId}-${item.id}`}
            className="sr-only"
          >
            Task description
          </label>
          <Input
            id={`todo-item-description-${todoListId}-${item.id}`}
            className={cn(
              'h-6 w-full border-none bg-transparent px-0 pt-0.5 font-sans text-xs leading-relaxed placeholder:italic placeholder:text-slate-300 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent dark:placeholder:text-slate-500',
              optimisticDone
                ? 'italic text-slate-300 line-through dark:text-slate-500'
                : 'text-slate-500 dark:text-slate-400',
            )}
            type="text"
            aria-label="Task description"
            {...register('description')}
            placeholder="Add a description..."
            onBlur={handleDescriptionBlur}
            onKeyDown={handleKeyDown}
          />
          {errors.description && (
            <p className="mt-0.5 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="p-1.5 text-slate-400 opacity-60 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Delete task</TooltipContent>
        </Tooltip>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              aria-label="Confirm delete task"
              onClick={handleDeleteClick}
            >
              Delete task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
