import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { HttpResponse, delay, http } from 'msw';

import { TodoListsPage } from './TodoListsPage';
import { renderWithProviders } from '@/test/test-utils';
import { server } from '@/test/server';

const listOne = {
  id: 1,
  name: 'List One',
  todoItems: [
    { id: 1, name: 'Task A', description: 'Alpha description', done: false },
    { id: 2, name: 'Task B', description: 'Beta details', done: true },
  ],
};

describe('TodoListsPage', () => {
  it('renders skeleton while loading todo lists', async () => {
    server.use(
      http.get('*/api/todo-lists', async () => {
        await delay(100);
        return HttpResponse.json([listOne]);
      }),
    );

    const { container } = renderWithProviders(<TodoListsPage />);
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy();

    expect(await screen.findByDisplayValue('List One')).toBeInTheDocument();
  });

  it('shows error state and retries fetching', async () => {
    let callCount = 0;

    server.use(
      http.get('*/api/todo-lists', () => {
        callCount += 1;
        if (callCount === 1) {
          return HttpResponse.text('Internal Server Error', { status: 500 });
        }
        return HttpResponse.json([listOne]);
      }),
    );

    renderWithProviders(<TodoListsPage />);

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    const retry = screen.getByRole('button', { name: 'Try again' });

    const user = userEvent.setup();
    await user.click(retry);

    expect(await screen.findByDisplayValue('List One')).toBeInTheDocument();
  });

  it('renders fetched todo lists', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json([listOne]);
      }),
    );

    renderWithProviders(<TodoListsPage />);

    expect(await screen.findByDisplayValue('List One')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task B')).toBeInTheDocument();
  });

  it('does not fetch per-list data on initial mount when todo-lists are already cached', async () => {
    let todoListByIdCallCount = 0;

    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json([listOne]);
      }),
      http.get('*/api/todo-lists/:id', async () => {
        todoListByIdCallCount += 1;
        // If this endpoint is called, the test should fail.
        // We delay to make timing-related calls more observable.
        await delay(25);
        return HttpResponse.json(listOne);
      }),
    );

    renderWithProviders(<TodoListsPage />);

    expect(await screen.findByDisplayValue('List One')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task B')).toBeInTheDocument();

    // Allow any potential late per-list refetch to occur.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(todoListByIdCallCount).toBe(0);
  });
});
