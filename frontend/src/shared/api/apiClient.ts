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

export async function apiFetch(path: string, init: RequestInit, baseUrl: string): Promise<void>;
export async function apiFetch<T>(path: string, init: RequestInit, baseUrl: string): Promise<T>;
export async function apiFetch<T>(
  path: string,
  init: RequestInit,
  baseUrl: string,
): Promise<T | void> {
  const response = await fetch(`${baseUrl}${path}`, init);

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return;
  }

  return (await response.json()) as T;
}
