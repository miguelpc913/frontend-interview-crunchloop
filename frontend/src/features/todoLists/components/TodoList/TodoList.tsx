import type { TodoItem } from '../../types/todoList';
import { TodoListHeader } from '../TodoListHeader/TodoListHeader';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { TodoListSkeleton } from './TodoListSkeleton';
import { TodoListError } from './TodoListError';
import { useTodoList } from './useTodoList';

interface TodoListProps {
  todoListId: number;
}

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
  } = useTodoList(todoListId);

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (isError || !todoList) {
    return <TodoListError onRetry={() => refetch()} />;
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm shadow-slate-900/5 ring-1 ring-slate-950/[0.02] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 font-sans text-slate-900 overflow-hidden dark:border-slate-800/80 dark:bg-slate-900/90 dark:text-slate-50 dark:shadow-black/20 dark:ring-slate-50/5">
      <TodoListHeader
        name={todoList.name}
        onUpdateName={handleUpdateName}
        onAddItem={handleAddItem}
      />
      <ul className="list-none m-0 p-3.5 md:p-4 flex flex-col gap-1.5">
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
        ) : (
          todoList.todoItems.map((item: TodoItem) => (
            <TodoListItem
              key={item.id}
              item={item}
              onUpdate={(updates) => handleUpdateItem(item.id, updates)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))
        )}
      </ul>
    </div>
  );
}

