import { TodoList } from './components/TodoList/TodoList';
import { TodoListsPageError } from './TodoListsPageError';
import { TodoListsPageSkeleton } from './TodoListsPageSkeleton';
import { useTodoListsPage } from './useTodoListsPage';

export function TodoListsPage() {
  const { todoLists, isLoading, isError, refetch } = useTodoListsPage();

  return (
    <div className="flex items-start justify-center py-2 md:py-4">
      <div className="w-full max-w-5xl space-y-5 md:space-y-6">
        {isError && <TodoListsPageError onRetry={() => refetch()} />}

        {isLoading && !isError && <TodoListsPageSkeleton />}

        {!isLoading &&
          !isError &&
          todoLists.map((list) => (
            <TodoList key={list.id} todoListId={list.id} />
          ))}
      </div>
    </div>
  );
}

export default TodoListsPage;

