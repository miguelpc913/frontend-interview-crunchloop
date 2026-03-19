import { describe, expect, it } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { http, HttpResponse } from 'msw'
import { useTodoListQuery } from './useTodoListQuery'
import { useTodoListHeaderMutations } from '../components/TodoListHeader/useTodoListHeaderMutations'
import { useTodoListItemMutations } from '../components/TodoListItem/useTodoListItemMutations'

function useTodoList(todoListId: number) {
  const query = useTodoListQuery(todoListId)
  const headerMutations = useTodoListHeaderMutations(todoListId)
  const itemMutations = useTodoListItemMutations(todoListId)
  return { ...query, ...headerMutations, ...itemMutations }
}
import { server } from '@/test/server'
import { resetTodoLists } from '@/test/handlers'
import type { TodoList } from '../../../types/todoList'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  }
}

describe('useTodoList', () => {
  it('fetches and returns todo list data', async () => {
    resetTodoLists()
    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useTodoList(1), { wrapper })

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull()
    })

    expect(result.current.todoList!.name).toBe('List One')
    expect(result.current.todoList!.todoItems).toHaveLength(2)
  })

  it('handleUpdateName rolls back on mutation error', async () => {
    resetTodoLists()
    const { wrapper, queryClient } = createWrapper()

    server.use(
      http.put('*/api/todo-lists/1', () => {
        return new HttpResponse('bad', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )

    const { result } = renderHook(() => useTodoList(1), { wrapper })

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull()
    })

    act(() => {
      result.current.handleUpdateName('New Name')
    })

    await waitFor(() => {
      const data = queryClient.getQueryData<TodoList>(['todoList', 1])
      expect(data?.name).toBe('List One')
    })
  })

  it('handleUpdateItem rolls back on mutation error', async () => {
    resetTodoLists()
    const { wrapper, queryClient } = createWrapper()

    server.use(
      http.put('*/api/todo-lists/1/todo-items/1', () => {
        return new HttpResponse('bad', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )

    const { result } = renderHook(() => useTodoList(1), { wrapper })

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull()
    })

    act(() => {
      result.current.handleUpdateItem(1, { name: 'Updated' })
    })

    await waitFor(() => {
      const data = queryClient.getQueryData<TodoList>(['todoList', 1])
      expect(data?.todoItems[0].name).toBe('Task A')
    })
  })

  it('handleDeleteItem rolls back on mutation error', async () => {
    resetTodoLists()
    const { wrapper, queryClient } = createWrapper()

    server.use(
      http.delete('*/api/todo-lists/1/todo-items/:itemId', () => {
        return new HttpResponse('bad', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )

    const { result } = renderHook(() => useTodoList(1), { wrapper })

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull()
    })

    act(() => {
      result.current.handleDeleteItem(1)
    })

    await waitFor(() => {
      const data = queryClient.getQueryData<TodoList>(['todoList', 1])
      expect(data?.todoItems).toHaveLength(2)
    })
  })

  it('handleAddItem rolls back on mutation error', async () => {
    resetTodoLists()
    const { wrapper, queryClient } = createWrapper()

    server.use(
      http.post('*/api/todo-lists/1/todo-items', () => {
        return new HttpResponse('bad', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )

    const { result } = renderHook(() => useTodoList(1), { wrapper })

    await waitFor(() => {
      expect(result.current.todoList).not.toBeNull()
    })

    act(() => {
      result.current.handleAddItem('New Task')
    })

    await waitFor(() => {
      const data = queryClient.getQueryData<TodoList>(['todoList', 1])
      expect(data?.todoItems).toHaveLength(2)
    })
  })

  it('does not mutate when todoListId <= 0', async () => {
    resetTodoLists()
    const { wrapper, queryClient } = createWrapper()

    const { result } = renderHook(() => useTodoList(-1), { wrapper })

    act(() => {
      result.current.handleUpdateName('Nope')
      result.current.handleAddItem('Nope')
      result.current.handleUpdateItem(1, { name: 'Nope' })
      result.current.handleDeleteItem(1)
    })

    expect(queryClient.getQueryData(['todoList', -1])).toBeUndefined()
  })
})
