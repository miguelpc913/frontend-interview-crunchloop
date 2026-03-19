import { useMutationState } from '@tanstack/react-query';
import type { SensorDescriptor, SensorOptions, DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TodoItem } from '@/shared/types/todoList';
import type { UpdateTodoItemDto } from '@/features/todoLists/types/todoList';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { TodoListEmptyState } from './TodoListEmptyState';
import { todoListMutationKeys } from '@/shared/query/todoLists';

interface TodoListItemsProps {
  todoListId: number;
  hasItems: boolean;
  filteredItems: TodoItem[];
  isReorderEnabled: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
  onUpdateItem: (todoItemId: number, updates: UpdateTodoItemDto) => void;
  onDeleteItem: (todoItemId: number) => void;
}

const pendingItemClassName =
  'rounded-lg border border-dashed border-border bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground opacity-50';

interface PendingItem {
  mutationId: number;
  name: string;
}

function PendingItems({ items }: { items: PendingItem[] }) {
  return (
    <>
      {items.map((item) => (
        <li key={item.mutationId} data-testid="pending-todo-item" className={pendingItemClassName}>
          {item.name}
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
  onUpdateItem,
  onDeleteItem,
}: TodoListItemsProps) {
  const pendingItems = useMutationState<PendingItem>({
    filters: {
      mutationKey: todoListMutationKeys.addItem(todoListId),
      status: 'pending',
    },
    select: (mutation) => ({
      mutationId: mutation.mutationId,
      name: mutation.state.variables as string,
    }),
  });

  if (!hasItems) {
    if (pendingItems.length === 0) {
      return (
        <TodoListEmptyState
          title="No tasks yet."
          description="Start by adding your first task above."
        />
      );
    }

    return <PendingItems items={pendingItems} />;
  }

  if (filteredItems.length === 0) {
    if (pendingItems.length === 0) {
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
        <PendingItems items={pendingItems} />
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
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
        <PendingItems items={pendingItems} />
      </>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
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
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </SortableContext>
      <PendingItems items={pendingItems} />
    </DndContext>
  );
}
