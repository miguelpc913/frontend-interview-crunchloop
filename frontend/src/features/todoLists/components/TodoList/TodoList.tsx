import { useState } from 'react';
import type { TodoItem } from '../../types/todoList';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoListHeader } from './components/TodoListHeader/TodoListHeader';
import { TodoListItem } from './components/TodoListItem/TodoListItem';
import { TodoListSkeleton } from './components/TodoListSkeleton/TodoListSkeleton';
import { TodoListError } from './components/TodoListError/TodoListError';
import { TodoListSearch } from './components/TodoListSearch/TodoListSearch';
import { TodoListFilterDropdown } from './components/TodoListFilterDropdown/TodoListFilterDropdown';
import { useTodoList } from './hooks/useTodoList';
import { useItemOrder } from './hooks/useItemOrder';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

interface TodoListProps {
  todoListId: number;
}

type FilterMode = 'all' | 'done' | 'not-done';

export function TodoList({ todoListId }: TodoListProps) {
  const {
    todoList,
    isLoading,
    isError,
    refetch,
    handleUpdateName,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleDeleteList,
  } = useTodoList(todoListId);

  const isOptimistic = todoListId <= 0;

  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const { orderedItems, reorder } = useItemOrder(
    todoListId,
    todoList?.todoItems ?? [],
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredItems =
    orderedItems.filter((item: TodoItem) => {
      if (filterMode === 'done' && !item.done) {
        return false;
      }

      if (filterMode === 'not-done' && item.done) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const name = item.name?.toLowerCase() ?? '';
      const description = item.description?.toLowerCase() ?? '';

      return (
        name.includes(normalizedSearch) || description.includes(normalizedSearch)
      );
    }) ?? [];

  const isReorderEnabled = filterMode === 'all' && !normalizedSearch;

  function handleDragEnd(event: DragEndEvent) {
    if (!isReorderEnabled) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    reorder(active.id as number, over.id as number);
  }

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (isError || !todoList) {
    return <TodoListError onRetry={() => refetch()} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto font-sans text-slate-900 dark:text-slate-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" data-list-name={todoList.name}>
      <CardContent className="p-0">
        <TodoListHeader
          name={todoList.name}
          onUpdateName={handleUpdateName}
          onAddItem={handleAddItem}
          onDeleteList={handleDeleteList}
          disabled={isOptimistic}
        />
        <Separator className="bg-slate-100/80 dark:bg-slate-800/80" />
        <div className="relative z-10 px-3.5 pt-3.5 text-xs text-slate-600 backdrop-blur-sm md:px-4 md:pt-4 dark:text-slate-300">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <TodoListSearch
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <TodoListFilterDropdown
              mode={filterMode}
              onChangeMode={(mode) => {
                setFilterMode(mode);
              }}
            />
          </div>
        </div>
        <Separator className="mt-3 bg-slate-100/80 md:mt-4 dark:bg-slate-800/80" />
        <ul className="m-0 flex list-none flex-col gap-1.5 p-3.5 md:p-4">
        {todoList.todoItems.length === 0 ? (
          <li className="flex items-start gap-3 rounded-lg border border-dashed border-slate-200/80 bg-slate-50/60 px-3 py-3 text-xs text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-400">
            <span className="mt-0.5 h-5 w-5 rounded-full border border-slate-300/70 bg-white/80 dark:border-slate-600/80 dark:bg-slate-900/90" />
            <div className="flex-1">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                No tasks yet.
              </p>
              <p>Start by adding your first task above.</p>
            </div>
          </li>
        ) : filteredItems.length === 0 ? (
          <li className="flex items-start gap-3 rounded-lg border border-dashed border-slate-200/80 bg-slate-50/60 px-3 py-3 text-xs text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-400">
            <span className="mt-0.5 h-5 w-5 rounded-full border border-slate-300/70 bg-white/80 dark:border-slate-600/80 dark:bg-slate-900/90" />
            <div className="flex-1">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                No tasks match your filters.
              </p>
              <p>Try changing the search term or done filter.</p>
            </div>
          </li>
        ) : (
          isReorderEnabled ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredItems.map((item: TodoItem) => (
                  <TodoListItem
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                    onDelete={() => handleDeleteItem(item.id)}
                    isDraggable
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            filteredItems.map((item: TodoItem) => (
              <TodoListItem
                key={item.id}
                item={item}
                onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                onDelete={() => handleDeleteItem(item.id)}
                isDraggable={false}
              />
            ))
          )
        )}
        </ul>
      </CardContent>
    </Card>
  );
}

