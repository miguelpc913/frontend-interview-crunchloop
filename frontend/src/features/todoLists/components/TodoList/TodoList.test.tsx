import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, delay, http } from 'msw'

import { TodoList } from './TodoList'
import { renderWithProviders } from '@/test/test-utils'
import { server } from '@/test/server'
import { resetTodoLists, setTodoLists } from '@/test/handlers'

const listOne = {
  id: 1,
  name: 'List One',
  todoItems: [
    { id: 1, name: 'Task A', description: 'Alpha description', done: false },
    { id: 2, name: 'Task B', description: 'Beta details', done: true },
  ],
}

const listTwo = {
  id: 2,
  name: 'List Two',
  todoItems: [
    { id: 1, name: 'Another Task', description: 'Contains keyword', done: false },
  ],
}

const emptyList = { id: 3, name: 'Empty List', todoItems: [] }

describe('TodoList', () => {
  it('shows skeleton while loading', async () => {
    server.use(
      http.get('*/api/todo-lists/:id', async ({ params }) => {
        if (params.id === '1') {
          await delay(100)
        }
        return HttpResponse.json(listOne)
      }),
    )

    const { container } = renderWithProviders(<TodoList todoListId={1} />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy()

    expect(await screen.findByDisplayValue('Task A')).toBeInTheDocument()
  })

  it('shows error and retries fetching', async () => {
    let callCount = 0

    server.use(
      http.get('*/api/todo-lists/:id', ({ params }) => {
        if (params.id !== '1') return HttpResponse.json(listOne)
        callCount += 1

        if (callCount === 1) {
          return HttpResponse.text('Internal Server Error', { status: 500 })
        }

        return HttpResponse.json(listOne)
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)

    expect(await screen.findByText('We could not load this list. Please try again.')).toBeInTheDocument()
    const retry = screen.getByRole('button', { name: 'Try again' })

    const user = userEvent.setup()
    await user.click(retry)

    expect(await screen.findByDisplayValue('Task A')).toBeInTheDocument()
  })

  it('shows empty state for a list with no tasks', async () => {
    renderWithProviders(<TodoList todoListId={3} />)
    expect(await screen.findByText('No tasks yet.')).toBeInTheDocument()
  })

  it('filters by search query (name/description) and clears back', async () => {
    renderWithProviders(<TodoList todoListId={1} />)
    const search = await screen.findByPlaceholderText('Search in this list...')

    const user = userEvent.setup()
    await user.clear(search)
    await user.type(search, 'alpha')

    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Task B')).not.toBeInTheDocument()

    await user.clear(search)
    // Controlled input will already update to empty string.

    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Task B')).toBeInTheDocument()
  })

  it('filters by Done / Not done', async () => {
    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    await screen.findByPlaceholderText('Search in this list...')

    const trigger = screen.getAllByRole('button', { name: /All tasks/i })[0]
    await user.click(trigger)
    await user.click(screen.getByText('Done'))

    expect(await screen.findByDisplayValue('Task B')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('Filter')).toBeInTheDocument()

    const doneTrigger = screen.getAllByRole('button', { name: /Done/i })[0]
    await user.click(doneTrigger)
    await user.click(screen.getByText('Not done'))

    expect(await screen.findByDisplayValue('Task A')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Task B')).not.toBeInTheDocument()
  })

  it('combines filter + search and shows no-match state', async () => {
    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    await screen.findByPlaceholderText('Search in this list...')
    await user.click(screen.getAllByRole('button', { name: /All tasks/i })[0])
    await user.click(screen.getByText('Done'))

    const search = await screen.findByPlaceholderText('Search in this list...')
    await user.clear(search)
    await user.type(search, 'Alpha')

    expect(
      await screen.findByText('No tasks match your filters.'),
    ).toBeInTheDocument()
  })

  it('sends PUT payload with done toggle on checkbox blur flow', async () => {
    resetTodoLists()
    const putSpy = vi.fn()
    const updated = {
      ...listOne,
      todoItems: [
        { ...listOne.todoItems[0], done: true },
        listOne.todoItems[1],
      ],
    }

    server.use(
      http.put('*/api/todo-lists/1/todo-items/1', async ({ request }) => {
        const body = await request.json()
        putSpy(body)
        setTodoLists([updated, listTwo, emptyList])
        return HttpResponse.json({ ...updated.todoItems[0] })
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)
    const checkbox = await screen.findByRole('checkbox', { name: 'Mark as complete' })

    const user = userEvent.setup()
    await user.click(checkbox)

    await waitFor(() => {
      expect(putSpy).toHaveBeenCalledTimes(1)
      expect(putSpy).toHaveBeenLastCalledWith({ done: true })
    })
  })

  it('adds a new item via the header form', async () => {
    resetTodoLists()
    const postSpy = vi.fn()

    server.use(
      http.post('*/api/todo-lists/1/todo-items', async ({ request }) => {
        const body = await request.json()
        postSpy(body)
        const created = { id: 10, name: (body as { name: string }).name, description: '', done: false }
        return HttpResponse.json(created)
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    const addInput = await screen.findByPlaceholderText('Add your task...')
    await user.type(addInput, 'New Task')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(postSpy).toHaveBeenLastCalledWith({ name: 'New Task' })
    })
  })

  it('deletes an item when delete button is clicked', async () => {
    resetTodoLists()
    const deleteSpy = vi.fn()

    server.use(
      http.delete('*/api/todo-lists/1/todo-items/:itemId', ({ params }) => {
        deleteSpy(Number(params.itemId))
        return HttpResponse.json(null, { status: 204 })
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    const deleteButtons = await screen.findAllByRole('button', { name: 'Delete task' })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledTimes(1)
      expect(deleteSpy).toHaveBeenLastCalledWith(1)
    })
  })

  it('updates item name via blur', async () => {
    resetTodoLists()
    const putSpy = vi.fn()

    server.use(
      http.put('*/api/todo-lists/1/todo-items/1', async ({ request }) => {
        const body = await request.json()
        putSpy(body)
        return HttpResponse.json({ ...listOne.todoItems[0], ...(body as Record<string, unknown>) })
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    const nameInput = await screen.findByDisplayValue('Task A')
    await user.clear(nameInput)
    await user.type(nameInput, 'Task A Edited')
    await user.tab()

    await waitFor(() => {
      expect(putSpy).toHaveBeenCalledTimes(1)
      expect(putSpy).toHaveBeenLastCalledWith({ name: 'Task A Edited' })
    })
  })

  it('sends PUT payload with trimmed list rename on blur', async () => {
    resetTodoLists()
    const putSpy = vi.fn()
    const newName = 'Renamed List'
    const updated = { ...listOne, name: newName }

    server.use(
      http.put('*/api/todo-lists/1', async ({ request }) => {
        const body = await request.json()
        putSpy(body)
        setTodoLists([updated, listTwo, emptyList])
        return HttpResponse.json(updated)
      }),
    )

    renderWithProviders(<TodoList todoListId={1} />)
    const user = userEvent.setup()

    const listNameInput = await screen.findByDisplayValue('List One')
    await user.clear(listNameInput)
    await user.type(listNameInput, `  ${newName}  `)
    await user.tab()

    await waitFor(() => {
      expect(putSpy).toHaveBeenCalledTimes(1)
      expect(putSpy).toHaveBeenLastCalledWith({ name: newName })
    })
  })

})

