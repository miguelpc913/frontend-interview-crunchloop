import { useDeferredValue, useMemo, useState } from 'react';
import type { TodoItem } from '@/shared/types/todoList';
import type { FilterMode } from '../types';

export function useTodoListFilter(items: TodoItem[]) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const normalizedSearch = useMemo(
    () => deferredSearchQuery.trim().toLowerCase(),
    [deferredSearchQuery],
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item: TodoItem) => {
        if (filterMode === 'done' && !item.done) return false;
        if (filterMode === 'not-done' && item.done) return false;
        if (!normalizedSearch) return true;

        const name = item.name?.toLowerCase() ?? '';
        const description = item.description?.toLowerCase() ?? '';
        return (
          name.includes(normalizedSearch) || description.includes(normalizedSearch)
        );
      }),
    [items, filterMode, normalizedSearch],
  );

  const isReorderEnabled = filterMode === 'all' && !normalizedSearch;

  return {
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isReorderEnabled,
  };
}
