import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { TodoItem } from '../../../types/todoList';
import type { FilterMode } from '../types';
import { useTodoListQuery } from './useTodoListQuery';
import { useItemOrder } from './useItemOrder';

export function useTodoList(todoListId: number) {
  const { todoList, isLoading, isError, refetch } = useTodoListQuery(todoListId);

  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const { orderedItems, reorder } = useItemOrder(
    todoListId,
    todoList?.todoItems ?? [],
  );

  const normalizedSearch = useMemo(
    () => deferredSearchQuery.trim().toLowerCase(),
    [deferredSearchQuery],
  );

  const filteredItems = useMemo(
    () =>
      orderedItems.filter((item: TodoItem) => {
        if (filterMode === 'done' && !item.done) return false;
        if (filterMode === 'not-done' && item.done) return false;
        if (!normalizedSearch) return true;

        const name = item.name?.toLowerCase() ?? '';
        const description = item.description?.toLowerCase() ?? '';
        return (
          name.includes(normalizedSearch) || description.includes(normalizedSearch)
        );
      }),
    [orderedItems, filterMode, normalizedSearch],
  );

  const isReorderEnabled = filterMode === 'all' && !normalizedSearch;

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!isReorderEnabled) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorder(active.id as number, over.id as number);
  }, [isReorderEnabled, reorder]);

  return {
    todoList,
    isLoading,
    isError,
    refetch,
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    sensors,
    filteredItems,
    isReorderEnabled,
    handleDragEnd,
  };
}
