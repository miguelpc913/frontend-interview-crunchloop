import type { ZodType } from 'zod';

export class ApiError extends Error {
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

export function apiFetch(path: string, init: RequestInit, baseUrl: string): Promise<void>;
export function apiFetch<T>(
  path: string,
  init: RequestInit,
  baseUrl: string,
  schema: ZodType<T>,
): Promise<T>;
export async function apiFetch<T>(
  path: string,
  init: RequestInit,
  baseUrl: string,
  schema?: ZodType<T>,
): Promise<T | void> {
  const response = await fetch(`${baseUrl}${path}`, init);

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return;
  }

  const data = await response.json();

  if (!schema) {
    return data as T;
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError('Invalid response payload from server', response.status);
  }

  return parsed.data;
}
