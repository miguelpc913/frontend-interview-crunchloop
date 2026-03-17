import { TodoListSkeleton } from './components/TodoList/TodoListSkeleton';

export function TodoListsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl grid gap-6 md:gap-8 md:grid-cols-2">
      <TodoListSkeleton />
      <TodoListSkeleton />
    </div>
  );
}

