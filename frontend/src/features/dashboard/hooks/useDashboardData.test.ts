import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { http, HttpResponse } from 'msw';
import { useDashboardData } from './useDashboardData';
import { server } from '@/test/server';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

describe('useDashboardData', () => {
  it('computes aggregated and per-list metrics', async () => {
    server.use(
      http.get('*/api/todo-lists', () =>
        HttpResponse.json([
          {
            id: 1,
            name: 'Work',
            todoItems: [
              { id: 1, name: 'A', description: '', done: true },
              { id: 2, name: 'B', description: '', done: false },
            ],
          },
          {
            id: 2,
            name: 'Home',
            todoItems: [{ id: 3, name: 'C', description: '', done: true }],
          },
        ]),
      ),
    );

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.globalCompletion).toEqual({ done: 2, pending: 1, total: 3 });
    expect(result.current.perListData).toEqual([
      { id: 1, name: 'Work', done: 1, pending: 1, total: 2, percentage: 50 },
      { id: 2, name: 'Home', done: 1, pending: 0, total: 1, percentage: 100 },
    ]);
    expect(result.current.largestLists.map((list) => list.name)).toEqual(['Work', 'Home']);
  });
});
