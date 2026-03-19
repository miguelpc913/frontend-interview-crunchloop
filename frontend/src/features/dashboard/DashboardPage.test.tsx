import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { HttpResponse, delay, http } from 'msw';

import { DashboardPage } from './DashboardPage';
import { renderWithProviders } from '@/test/test-utils';
import { server } from '@/test/server';

const lists = [
  {
    id: 1,
    name: 'Work',
    todoItems: [
      { id: 1, name: 'Task 1', description: '', done: true },
      { id: 2, name: 'Task 2', description: '', done: false },
      { id: 3, name: 'Task 3', description: '', done: true },
    ],
  },
  {
    id: 2,
    name: 'Personal',
    todoItems: [{ id: 4, name: 'Task 4', description: '', done: false }],
  },
];

describe('DashboardPage', () => {
  it('shows loading text while fetching', async () => {
    server.use(
      http.get('*/api/todo-lists', async () => {
        await delay(200);
        return HttpResponse.json(lists);
      }),
    );

    const { container } = renderWithProviders(<DashboardPage />);

    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy();
    expect(await screen.findByText('Completion Status')).toBeInTheDocument();
  });

  it('shows error text when fetch fails', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.text('error', { status: 500 });
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Failed to load dashboard data.')).toBeInTheDocument();
  });

  it('renders all chart headings with fetched data', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json(lists);
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Completion Status')).toBeInTheDocument();
    expect(screen.getByText('Items per List')).toBeInTheDocument();
    expect(screen.getByText('Completion Progress')).toBeInTheDocument();
    expect(screen.getByText('Largest Lists')).toBeInTheDocument();
  });

  it('computes global completion correctly', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json(lists);
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('4')).toBeInTheDocument();
    expect(screen.getByText('Total items')).toBeInTheDocument();
  });

  it('renders per-list labels in radial chart', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json(lists);
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('2/3 done')).toBeInTheDocument();
    expect(screen.getByText('0/1 done')).toBeInTheDocument();
  });

  it('handles a list with zero items (percentage = 0 branch)', async () => {
    const listsWithEmpty = [...lists, { id: 3, name: 'Empty List', todoItems: [] }];

    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json(listsWithEmpty);
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('Completion Status')).toBeInTheDocument();
    expect(screen.getByText('Empty List')).toBeInTheDocument();
  });

  it('renders empty states when no lists exist', async () => {
    server.use(
      http.get('*/api/todo-lists', () => {
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<DashboardPage />);

    expect(await screen.findByText('No items yet')).toBeInTheDocument();
    expect(screen.getAllByText('No lists yet')).toHaveLength(3);
  });
});
