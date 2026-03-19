import { TodoListHeader } from './components/TodoListHeader/TodoListHeader';
import { TodoListSkeleton } from '../TodoListSkeleton/TodoListSkeleton';
import { TodoListToolbar } from './components/TodoListToolbar/TodoListToolbar';
import { TodoListItems } from './components/TodoListItems/TodoListItems';
import { useTodoList } from './hooks/useTodoList';
import { QueryState } from '@/shared/ui/QueryState';
import { Card, CardContent } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

interface TodoListProps {
  todoListId: number;
}

export function TodoList({ todoListId }: TodoListProps) {
  const {
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
  } = useTodoList(todoListId);

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      loadingFallback={<TodoListSkeleton />}
      errorMessage="We could not load this list. Please try again."
    >
      {todoList && (
        <Card
          className="mx-auto w-full max-w-md font-sans text-slate-900 dark:text-slate-50"
          data-list-name={todoList.name}
        >
          <CardContent className="p-0">
            <TodoListHeader
              todoListId={todoListId}
              name={todoList.name}
            />
            <Separator className="bg-slate-100/80 dark:bg-slate-800/80" />
            <TodoListToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterMode={filterMode}
              onFilterChange={setFilterMode}
            />
            <Separator className="mt-3 bg-slate-100/80 md:mt-4 dark:bg-slate-800/80" />
            <ul className="m-0 flex list-none flex-col gap-1.5 p-3.5 md:p-4">
              <TodoListItems
                todoListId={todoListId}
                hasItems={todoList.todoItems.length > 0}
                filteredItems={filteredItems}
                isReorderEnabled={isReorderEnabled}
                sensors={sensors}
                onDragEnd={handleDragEnd}
              />
            </ul>
          </CardContent>
        </Card>
      )}
    </QueryState>
  );
}
