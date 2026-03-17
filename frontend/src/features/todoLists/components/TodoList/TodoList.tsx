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
    <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm transition-shadow hover:shadow-md font-sans text-slate-900 overflow-hidden dark:border-slate-800/80 dark:bg-slate-900/80 dark:text-slate-50">
      <TodoListHeader
        name={todoList.name}
        onUpdateName={handleUpdateName}
        onAddItem={handleAddItem}
      />
      <ul className="list-none m-0 p-4 md:p-5 flex flex-col gap-1.5">
        {todoList.todoItems.map((item: TodoItem) => (
          <TodoListItem
            key={item.id}
            item={item}
            onUpdate={(updates) => handleUpdateItem(item.id, updates)}
            onDelete={() => handleDeleteItem(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

