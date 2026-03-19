import { useTodoListQuery } from './useTodoListQuery';
import { useItemOrder } from './useItemOrder';
import { useTodoListFilter } from './useTodoListFilter';
import { useTodoListDnd } from './useTodoListDnd';

export function useTodoList(todoListId: number) {
  const { todoList, isLoading, isError, refetch } = useTodoListQuery(todoListId);

  const { orderedItems, reorder } = useItemOrder(
    todoListId,
    todoList?.todoItems ?? [],
  );

  const {
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    filteredItems,
    isReorderEnabled,
  } = useTodoListFilter(orderedItems);

  const { sensors, handleDragEnd } = useTodoListDnd({
    isReorderEnabled,
    reorder,
  });

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
