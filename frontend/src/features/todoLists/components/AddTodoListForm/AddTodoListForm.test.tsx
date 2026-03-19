import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, delay, http } from 'msw';

import { AddTodoListForm } from './AddTodoListForm';
import { TodoListsPage } from '../../TodoListsPage';
import { renderWithProviders } from '@/test/test-utils';
import { server } from '@/test/server';
import { setTodoLists } from '@/test/handlers';

describe('AddTodoListForm', () => {
  it('disables submit when input is empty and shows validation for whitespace', async () => {
    renderWithProviders(<AddTodoListForm />);

    const input = screen.getByLabelText('Todo list name');
    const submit = screen.getByRole('button', { name: 'Add list' });

    expect(submit).toBeDisabled();

    const user = userEvent.setup();
    await user.type(input, '   ');

    expect(submit).toBeDisabled();
    expect(await screen.findByText('Name should not be empty')).toBeInTheDocument();
  });

  it('POSTs with correct payload and clears input on success', async () => {
    const postSpy = vi.fn();

    server.use(
      http.post('*/api/todo-lists', async ({ request }) => {
        const body = (await request.json()) as { name: string };
        postSpy(body);

        return HttpResponse.json({
          id: 10,
          name: body.name.trim(),
          todoItems: [],
        });
      }),
    );

    renderWithProviders(<AddTodoListForm />);

    const input = screen.getByLabelText('Todo list name');
    const submit = screen.getByRole('button', { name: 'Add list' });
    const user = userEvent.setup();

    await user.type(input, 'New List');
    expect(submit).not.toBeDisabled();

    await user.click(submit);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenLastCalledWith({ name: 'New List' });
    });

    expect(input).toHaveValue('');
  });

  it('shows an alert when the POST fails', async () => {
    server.use(
      http.post('*/api/todo-lists', async () => {
        return HttpResponse.text('Internal Server Error', { status: 500 });
      }),
    );

    renderWithProviders(<AddTodoListForm />);

    const input = screen.getByLabelText('Todo list name');
    const submit = screen.getByRole('button', { name: 'Add list' });
    const user = userEvent.setup();

    await user.type(input, 'Bad List');
    await user.click(submit);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Internal Server Error');
  });

  it('optimistically adds a new list to TodoListsPage', async () => {
    setTodoLists([]);

    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json([]);
      }),
    );

    const created = {
      id: 1,
      name: 'Optimistic List',
      todoItems: [],
    };

    server.use(
      http.post('*/api/todo-lists', async ({ request }) => {
        const body = (await request.json()) as { name: string };
        if (body.name.trim() !== created.name) {
          return HttpResponse.json(null, { status: 400 });
        }
        await delay(500);
        return HttpResponse.json(created);
      }),
    );

    renderWithProviders(<TodoListsPage />);

    const input = screen.getByLabelText('Todo list name');
    const submit = screen.getByRole('button', { name: 'Add list' });
    const user = userEvent.setup();

    await user.type(input, created.name);
    await user.click(submit);

    // Should appear before the delayed POST resolves.
    await waitFor(
      () => {
        expect(screen.getAllByDisplayValue(created.name).length).toBeGreaterThan(0);
        expect(screen.getByText('No tasks yet.')).toBeInTheDocument();
      },
      { timeout: 250 },
    );
  });
});
