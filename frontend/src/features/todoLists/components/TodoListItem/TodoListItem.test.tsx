import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '@/test/test-utils'
import { TodoListItem } from './TodoListItem'

describe('TodoListItem', () => {
  it('renders name/description and unchecked state', () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Alpha description')).toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox', { name: 'Mark as complete' })
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles done on checkbox click', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const checkbox = screen.getByRole('checkbox', { name: 'Mark as complete' })
    await user.click(checkbox)

    expect(onUpdate).toHaveBeenLastCalledWith({ done: true })
  })

  it('updates name on blur when changed + valid', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('Task A')

    await user.clear(nameInput)
    await user.type(nameInput, '  Task A Updated  ')
    await user.tab() // triggers blur

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith({ name: 'Task A Updated' })
    })
  })

  it('does not update name on blur when unchanged', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('Task A')

    await user.clear(nameInput)
    await user.type(nameInput, 'Task A')
    await user.tab()

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('shows validation error for empty name on blur', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('Task A')

    await user.clear(nameInput)
    await user.tab()

    expect(
      await screen.findByText('Name should not be empty'),
    ).toBeInTheDocument()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('updates description on blur when changed', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const descInput = screen.getByDisplayValue('Alpha description')

    await user.clear(descInput)
    await user.type(descInput, 'New description')
    await user.tab()

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith({ description: 'New description' })
    })
  })

  it('shows validation error for long description', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const descInput = screen.getByDisplayValue('Alpha description')
    const long = 'a'.repeat(256)

    await user.clear(descInput)
    await user.type(descInput, long)
    await user.tab()

    expect(
      await screen.findByText('Description should not exceed 255 characters'),
    ).toBeInTheDocument()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Delete task' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('pressing Enter blurs and updates name', async () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: false,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('Task A')

    await user.clear(nameInput)
    await user.type(nameInput, 'Task A Updated{enter}')

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith({ name: 'Task A Updated' })
    })
  })

  it('applies line-through classes when done', () => {
    const item = {
      id: 1,
      name: 'Task A',
      description: 'Alpha description',
      done: true,
    }

    const onUpdate = vi.fn()
    const onDelete = vi.fn()

    renderWithProviders(<TodoListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />)

    const nameInput = screen.getByDisplayValue('Task A')
    expect(nameInput).toHaveClass('line-through')
  })
})

