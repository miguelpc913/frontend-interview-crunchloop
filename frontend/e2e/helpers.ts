import type { APIRequestContext } from '@playwright/test';

export const getApiBaseUrl = () => process.env.VITE_API_URL ?? 'http://localhost:4000';

export async function getAllTestLists(request: APIRequestContext): Promise<
  Array<{
    id: number;
    name: string;
    todoItems: unknown[];
  }>
> {
  const baseUrl = getApiBaseUrl();
  const response = await request.get(`${baseUrl}/api/todo-lists`);
  if (!response.ok()) {
    throw new Error(`getAllTestLists failed: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function createTestList(
  request: APIRequestContext,
  name: string,
): Promise<{ id: number; name: string; todoItems: unknown[] }> {
  const baseUrl = getApiBaseUrl();
  const response = await request.post(`${baseUrl}/api/todo-lists`, {
    data: { name },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok()) {
    throw new Error(`createTestList failed: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

export async function deleteTestList(request: APIRequestContext, id: number): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const response = await request.delete(`${baseUrl}/api/todo-lists/${id}`);
  if (!response.ok() && response.status() !== 204 && response.status() !== 404) {
    throw new Error(`deleteTestList failed: ${response.status()} ${await response.text()}`);
  }
}

export async function addTestItem(
  request: APIRequestContext,
  listId: number,
  name: string,
): Promise<{ id: number; name: string; description?: string; done: boolean }> {
  const baseUrl = getApiBaseUrl();
  const response = await request.post(`${baseUrl}/api/todo-lists/${listId}/todo-items`, {
    data: { name },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok()) {
    throw new Error(`addTestItem failed: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}
