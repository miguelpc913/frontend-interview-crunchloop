import { TodoList } from './components/TodoList/TodoList';
import { AddTodoListForm } from './components/AddTodoListForm/AddTodoListForm';
import { QueryState } from '@/shared/ui/QueryState';
import { useTodoListsPage } from './useTodoListsPage';
import { TodoListSkeleton } from './components/TodoList/components/TodoListSkeleton/TodoListSkeleton';

export function TodoListsPage() {
  const { todoLists, isLoading, isError, refetch } = useTodoListsPage();

  return (
    <div className="flex items-start justify-center py-2 md:py-4">
      <div className="w-full max-w-5xl space-y-5 md:space-y-6">
        <AddTodoListForm />
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          loadingFallback={    
          <div className="mx-auto w-full max-w-5xl grid gap-6 md:gap-8 md:grid-cols-2">
            <TodoListSkeleton />
            <TodoListSkeleton />
          </div>
          }
          errorTitle="Something went wrong"
          errorMessage="We could not load your todo lists. Please try again."
        >
        <div className="mx-auto w-full max-w-5xl grid gap-6 md:gap-8 md:grid-cols-2">
          {todoLists.map((list) => (
            <TodoList key={list.id} todoListId={list.id} />
          ))}
          </div>
        </QueryState>
      </div>
    </div>
  );
}

export default TodoListsPage;
