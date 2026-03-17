import type {
  TodoList,
  TodoItem,
  CreateTodoListDto,
  UpdateTodoListDto,
  AddTodoItemDto,
  UpdateTodoItemDto,
} from '../types/todoList';

const API_URL = import.meta.env.VITE_API_URL;

const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

// ── Todo Lists ──────────────────────────────────────────────

export async function createTodoList(dto: CreateTodoListDto): Promise<TodoList> {
  const response = await fetch(`${API_URL}/api/todo-lists`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dto),
  });
  return response.json();
}

export async function getAllTodoLists(): Promise<TodoList[]> {
  const response = await fetch(`${API_URL}/api/todo-lists`, {
    method: 'GET',
    headers,
  });
  return response.json();
}

export async function getTodoListById(todoListId: number): Promise<TodoList> {
  const response = await fetch(`${API_URL}/api/todo-lists/${todoListId}`, {
    method: 'GET',
    headers,
  });
  return response.json();
}

export async function updateTodoList(
  todoListId: number,
  dto: UpdateTodoListDto,
): Promise<TodoList> {
  const response = await fetch(`${API_URL}/api/todo-lists/${todoListId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(dto),
  });
  return response.json();
}

export async function deleteTodoList(todoListId: number): Promise<void> {
  await fetch(`${API_URL}/api/todo-lists/${todoListId}`, {
    method: 'DELETE',
    headers,
  });
}

// ── Todo Items ──────────────────────────────────────────────

export async function addTodoItem(
  todoListId: number,
  dto: AddTodoItemDto,
): Promise<TodoItem> {
  const response = await fetch(
    `${API_URL}/api/todo-lists/${todoListId}/todo-items`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(dto),
    },
  );
  return response.json();
}

export async function getAllTodoItems(todoListId: number): Promise<TodoItem[]> {
  const response = await fetch(
    `${API_URL}/api/todo-lists/${todoListId}/todo-items`,
    {
      method: 'GET',
      headers,
    },
  );
  return response.json();
}

export async function getTodoItemById(
  todoListId: number,
  todoItemId: number,
): Promise<TodoItem> {
  const response = await fetch(
    `${API_URL}/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    {
      method: 'GET',
      headers,
    },
  );
  return response.json();
}

export async function updateTodoItem(
  todoListId: number,
  todoItemId: number,
  dto: UpdateTodoItemDto,
): Promise<TodoItem> {
  const response = await fetch(
    `${API_URL}/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(dto),
    },
  );
  return response.json();
}

export async function deleteTodoItem(
  todoListId: number,
  todoItemId: number,
): Promise<void> {
  await fetch(
    `${API_URL}/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    {
      method: 'DELETE',
      headers,
    },
  );
}
