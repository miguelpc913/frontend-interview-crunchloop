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

class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = `Request failed with status ${response.status}`;
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      return body.message ?? body.error ?? fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  try {
    const text = await response.text();
    return text.trim() || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function createTodoList(dto: CreateTodoListDto): Promise<TodoList> {
  return apiFetch<TodoList>('/api/todo-lists', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function getAllTodoLists(): Promise<TodoList[]> {
  return apiFetch<TodoList[]>('/api/todo-lists', {
    method: 'GET',
  });
}

export async function getTodoListById(todoListId: number): Promise<TodoList> {
  return apiFetch<TodoList>(`/api/todo-lists/${todoListId}`, {
    method: 'GET',
  });
}

export async function updateTodoList(
  todoListId: number,
  dto: UpdateTodoListDto,
): Promise<TodoList> {
  return apiFetch<TodoList>(`/api/todo-lists/${todoListId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function deleteTodoList(todoListId: number): Promise<void> {
  await apiFetch<void>(`/api/todo-lists/${todoListId}`, {
    method: 'DELETE',
  });
}

export async function addTodoItem(
  todoListId: number,
  dto: AddTodoItemDto,
): Promise<TodoItem> {
  return apiFetch<TodoItem>(`/api/todo-lists/${todoListId}/todo-items`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function getAllTodoItems(todoListId: number): Promise<TodoItem[]> {
  return apiFetch<TodoItem[]>(`/api/todo-lists/${todoListId}/todo-items`, {
    method: 'GET',
  });
}

export async function getTodoItemById(
  todoListId: number,
  todoItemId: number,
): Promise<TodoItem> {
  return apiFetch<TodoItem>(
    `/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    {
      method: 'GET',
    },
  );
}

export async function updateTodoItem(
  todoListId: number,
  todoItemId: number,
  dto: UpdateTodoItemDto,
): Promise<TodoItem> {
  return apiFetch<TodoItem>(
    `/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    {
      method: 'PUT',
      body: JSON.stringify(dto),
    },
  );
}

export async function deleteTodoItem(
  todoListId: number,
  todoItemId: number,
): Promise<void> {
  await apiFetch<void>(`/api/todo-lists/${todoListId}/todo-items/${todoItemId}`, {
    method: 'DELETE',
  });
}
