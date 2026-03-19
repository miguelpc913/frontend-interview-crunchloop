import { useMutationState } from '@tanstack/react-query';
import type { SensorDescriptor, SensorOptions, DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TodoItem } from '../../../../types/todoList';
import { TodoListItem } from './TodoListItem/TodoListItem';
import { TodoListEmptyState } from './TodoListEmptyState/TodoListEmptyState';

interface TodoListItemsProps {
  todoListId: number;
  hasItems: boolean;
  filteredItems: TodoItem[];
  isReorderEnabled: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
}

const pendingItemClassName =
  'opacity-50 rounded-lg border border-dashed border-slate-200/70 bg-slate-50/60 px-3 py-2.5 text-xs text-slate-600 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300';

function PendingItems({ names }: { names: string[] }) {
  return (
    <>
      {names.map((name, index) => (
        <li
          key={`${name}-${index}`}
          data-testid="pending-todo-item"
          className={pendingItemClassName}
        >
          {name}
        </li>
      ))}
    </>
  );
}

export function TodoListItems({
  todoListId,
  hasItems,
  filteredItems,
  isReorderEnabled,
  sensors,
  onDragEnd,
}: TodoListItemsProps) {
  const pendingItemNames = useMutationState<string>({
    filters: {
      mutationKey: ['addTodoItem', todoListId],
      status: 'pending',
    },
    select: (mutation) => mutation.state.variables as string,
  });

  if (!hasItems) {
    if (pendingItemNames.length === 0) {
      return (
        <TodoListEmptyState
          title="No tasks yet."
          description="Start by adding your first task above."
        />
      );
    }

    return <PendingItems names={pendingItemNames} />;
  }

  if (filteredItems.length === 0) {
    if (pendingItemNames.length === 0) {
      return (
        <TodoListEmptyState
          title="No tasks match your filters."
          description="Try changing the search term or done filter."
        />
      );
    }

    return (
      <>
        <TodoListEmptyState
          title="No tasks match your filters."
          description="Try changing the search term or done filter."
        />
        <PendingItems names={pendingItemNames} />
      </>
    );
  }

  if (!isReorderEnabled) {
    return (
      <>
        {filteredItems.map((item: TodoItem) => (
          <TodoListItem
            key={item.id}
            todoListId={todoListId}
            item={item}
            isDraggable={false}
          />
        ))}
        <PendingItems names={pendingItemNames} />
      </>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={filteredItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {filteredItems.map((item: TodoItem) => (
          <TodoListItem
            key={item.id}
            todoListId={todoListId}
            item={item}
            isDraggable
          />
        ))}
      </SortableContext>
      <PendingItems names={pendingItemNames} />
    </DndContext>
  );
}
