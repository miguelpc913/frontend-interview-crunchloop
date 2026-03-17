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
    <div className="w-full max-w-md mx-auto bg-white border-2 border-black rounded-2xl shadow-md overflow-hidden font-sans text-black">
      <TodoListHeader
        name={todoList.name}
        onUpdateName={handleUpdateName}
        onAddItem={handleAddItem}
      />
      <ul className="list-none m-0 p-4 md:p-6 flex flex-col gap-1">
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

