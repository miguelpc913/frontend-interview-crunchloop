import {
  CreateTodoListDto,
  UpdateTodoListDto,
  AddTodoItemDto,
  UpdateTodoItemDto,
} from '@/features/todoLists/types/todoList';
import { apiFetch } from '@/shared/api/apiClient';
import {
  todoItemSchema,
  todoItemsSchema,
  todoListSchema,
  todoListsSchema,
} from '@/shared/schemas/todoList';
import type { TodoList, TodoItem } from '@/shared/types/todoList';

const API_URL = import.meta.env.VITE_API_URL;
const jsonHeaders = { 'Content-Type': 'application/json' };

export async function createTodoList(dto: CreateTodoListDto): Promise<TodoList> {
  return apiFetch<TodoList>(
    '/api/todo-lists',
    { method: 'POST', headers: jsonHeaders, body: JSON.stringify(dto) },
    API_URL,
    todoListSchema,
  );
}

export async function getAllTodoLists(): Promise<TodoList[]> {
  return apiFetch<TodoList[]>(
    '/api/todo-lists',
    { method: 'GET', headers: jsonHeaders },
    API_URL,
    todoListsSchema,
  );
}

export async function getTodoListById(todoListId: number): Promise<TodoList> {
  return apiFetch<TodoList>(
    `/api/todo-lists/${todoListId}`,
    { method: 'GET', headers: jsonHeaders },
    API_URL,
    todoListSchema,
  );
}

export async function updateTodoList(
  todoListId: number,
  dto: UpdateTodoListDto,
): Promise<TodoList> {
  return apiFetch<TodoList>(
    `/api/todo-lists/${todoListId}`,
    { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(dto) },
    API_URL,
    todoListSchema,
  );
}

export async function deleteTodoList(todoListId: number): Promise<void> {
  await apiFetch(
    `/api/todo-lists/${todoListId}`,
    { method: 'DELETE', headers: jsonHeaders },
    API_URL,
  );
}

export async function addTodoItem(todoListId: number, dto: AddTodoItemDto): Promise<TodoItem> {
  return apiFetch<TodoItem>(
    `/api/todo-lists/${todoListId}/todo-items`,
    { method: 'POST', headers: jsonHeaders, body: JSON.stringify(dto) },
    API_URL,
    todoItemSchema,
  );
}

export async function getAllTodoItems(todoListId: number): Promise<TodoItem[]> {
  return apiFetch<TodoItem[]>(
    `/api/todo-lists/${todoListId}/todo-items`,
    { method: 'GET', headers: jsonHeaders },
    API_URL,
    todoItemsSchema,
  );
}

export async function getTodoItemById(todoListId: number, todoItemId: number): Promise<TodoItem> {
  return apiFetch<TodoItem>(
    `/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    { method: 'GET', headers: jsonHeaders },
    API_URL,
    todoItemSchema,
  );
}

export async function updateTodoItem(
  todoListId: number,
  todoItemId: number,
  dto: UpdateTodoItemDto,
): Promise<TodoItem> {
  return apiFetch<TodoItem>(
    `/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(dto) },
    API_URL,
    todoItemSchema,
  );
}

export async function deleteTodoItem(todoListId: number, todoItemId: number): Promise<void> {
  await apiFetch(
    `/api/todo-lists/${todoListId}/todo-items/${todoItemId}`,
    { method: 'DELETE', headers: jsonHeaders },
    API_URL,
  );
}
