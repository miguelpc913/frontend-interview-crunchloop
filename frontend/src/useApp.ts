import { useEffect, useState } from 'react';
import type { TodoList as TodoListType } from './types/todoList';
import { getAllTodoLists } from './services/todoListService';

export function useApp() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);

  useEffect(() => {
    getAllTodoLists().then(setTodoLists);
  }, []);

  return { todoLists };
}

