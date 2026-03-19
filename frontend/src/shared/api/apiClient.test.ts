import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import { apiFetch, ApiError } from './apiClient';
import { server } from '@/test/server';

const BASE_URL = 'http://localhost:3000';

describe('apiClient', () => {
  it('returns validated JSON data when schema matches', async () => {
    server.use(
      http.get(`${BASE_URL}/api/validated`, () => HttpResponse.json({ id: 1, name: 'Valid' })),
    );

    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });

    const result = await apiFetch('/api/validated', { method: 'GET' }, BASE_URL, schema);

    expect(result).toEqual({ id: 1, name: 'Valid' });
  });

  it('returns void for 204 responses', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/no-content`, () => new HttpResponse(null, { status: 204 })),
    );

    const result = await apiFetch('/api/no-content', { method: 'DELETE' }, BASE_URL);

    expect(result).toBeUndefined();
  });

  it('throws ApiError with parsed JSON message for non-ok responses', async () => {
    server.use(
      http.get(`${BASE_URL}/api/error-json`, () =>
        HttpResponse.json({ message: 'Readable json error' }, { status: 400 }),
      ),
    );

    await expect(apiFetch('/api/error-json', { method: 'GET' }, BASE_URL)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(apiFetch('/api/error-json', { method: 'GET' }, BASE_URL)).rejects.toMatchObject({
      status: 400,
      message: 'Readable json error',
    });
  });

  it('throws ApiError with text fallback for non-json error responses', async () => {
    server.use(
      http.get(`${BASE_URL}/api/error-text`, () =>
        HttpResponse.text('Text body error', { status: 500 }),
      ),
    );

    await expect(apiFetch('/api/error-text', { method: 'GET' }, BASE_URL)).rejects.toMatchObject({
      status: 500,
      message: 'Text body error',
    });
  });

  it('throws ApiError for invalid schema payload', async () => {
    server.use(
      http.get(`${BASE_URL}/api/invalid-schema`, () => HttpResponse.json({ id: 'not-a-number' })),
    );
    const schema = z.object({ id: z.number() });

    await expect(
      apiFetch('/api/invalid-schema', { method: 'GET' }, BASE_URL, schema),
    ).rejects.toMatchObject({
      status: 200,
      message: 'Invalid response payload from server',
    });
  });

  it('falls back to status message when json body is malformed', async () => {
    server.use(
      http.get(
        `${BASE_URL}/api/error-bad-json`,
        () =>
          new HttpResponse('{ broken json', {
            status: 418,
            headers: { 'content-type': 'application/json' },
          }),
      ),
    );

    await expect(
      apiFetch('/api/error-bad-json', { method: 'GET' }, BASE_URL),
    ).rejects.toMatchObject({
      status: 418,
      message: 'Request failed with status 418',
    });
  });
});
