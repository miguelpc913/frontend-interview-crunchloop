import type { TodoItem } from '../../types/todoList';
import { TodoListHeader } from '../TodoListHeader/TodoListHeader';
import { TodoListItem } from '../TodoListItem/TodoListItem';
import { useTodoList } from './useTodoList';
import './TodoList.css';

interface TodoListProps {
  todoListId: number;
}

export function TodoList({ todoListId }: TodoListProps) {
  const {
    todoList,
    handleUpdateName,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useTodoList(todoListId);

  if (!todoList) return null;

  return (
    <div className="todo-list">
      <TodoListHeader
        name={todoList.name}
        onUpdateName={handleUpdateName}
        onAddItem={handleAddItem}
      />
      <ul className="todo-list__items">
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
