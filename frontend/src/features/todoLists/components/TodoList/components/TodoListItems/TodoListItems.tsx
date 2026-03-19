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

export function TodoListItems({
  todoListId,
  hasItems,
  filteredItems,
  isReorderEnabled,
  sensors,
  onDragEnd,
}: TodoListItemsProps) {
  if (!hasItems) {
    return (
      <TodoListEmptyState
        title="No tasks yet."
        description="Start by adding your first task above."
      />
    );
  }

  if (filteredItems.length === 0) {
    return (
      <TodoListEmptyState
        title="No tasks match your filters."
        description="Try changing the search term or done filter."
      />
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
    </DndContext>
  );
}
