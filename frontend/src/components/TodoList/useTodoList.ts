import { useEffect, useState } from 'react';
import type { TodoList as TodoListType } from '../../types/todoList';
import {
  getTodoListById,
  updateTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from '../../services/todoListService';

export function useTodoList(todoListId: number) {
  const [todoList, setTodoList] = useState<TodoListType | null>(null);

  useEffect(() => {
    getTodoListById(todoListId).then(setTodoList);
  }, [todoListId]);

  async function handleUpdateName(name: string) {
    if (!todoList) return;
    const updated = await updateTodoList(todoListId, { name });
    setTodoList(updated);
  }

  async function handleAddItem(name: string) {
    if (!todoList) return;
    const newItem = await addTodoItem(todoListId, { name });
    setTodoList({ ...todoList, todoItems: [...todoList.todoItems, newItem] });
  }

  async function handleUpdateItem(
    todoItemId: number,
    updates: { name?: string; description?: string; done?: boolean },
  ) {
    if (!todoList) return;
    const updatedItem = await updateTodoItem(todoListId, todoItemId, updates);
    setTodoList({
      ...todoList,
      todoItems: todoList.todoItems.map((item) =>
        item.id === todoItemId ? updatedItem : item,
      ),
    });
  }

  async function handleDeleteItem(todoItemId: number) {
    if (!todoList) return;
    await deleteTodoItem(todoListId, todoItemId);
    setTodoList({
      ...todoList,
      todoItems: todoList.todoItems.filter((item) => item.id !== todoItemId),
    });
  }

  return {
    todoList,
    handleUpdateName,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
  };
}

