import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TodoListHeader } from './TodoListHeader'

describe('TodoListHeader', () => {
  it('renders list name input', () => {
    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={() => {}}
        onAddItem={() => {}}
        onDeleteList={() => {}}
      />,
    )

    expect(screen.getByDisplayValue('My List')).toBeInTheDocument()
  })

  it('updates list name on blur when changed + valid', async () => {
    const onUpdateName = vi.fn()
    const onAddItem = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={onUpdateName}
        onAddItem={onAddItem}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('My List')

    await user.clear(nameInput)
    await user.type(nameInput, '  Updated List  ')
    await user.tab()

    await waitFor(() => {
      expect(onUpdateName).toHaveBeenLastCalledWith('Updated List')
    })
  })

  it('does not call onUpdateName when blurred value is unchanged', async () => {
    const onUpdateName = vi.fn()
    const onAddItem = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={onUpdateName}
        onAddItem={onAddItem}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('My List')

    await user.clear(nameInput)
    await user.type(nameInput, 'My List')
    await user.tab()

    expect(onUpdateName).not.toHaveBeenCalled()
  })

  it('shows validation error and does not update when name is empty', async () => {
    const onUpdateName = vi.fn()
    const onAddItem = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={onUpdateName}
        onAddItem={onAddItem}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('My List')

    await user.clear(nameInput)
    await user.tab()

    expect(await screen.findByText('Name should not be empty')).toBeInTheDocument()
    expect(onUpdateName).not.toHaveBeenCalled()
  })

  it('pressing Enter on list name triggers update via blur', async () => {
    const onUpdateName = vi.fn()
    const onAddItem = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={onUpdateName}
        onAddItem={onAddItem}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const nameInput = screen.getByDisplayValue('My List')

    await user.clear(nameInput)
    await user.type(nameInput, 'Entered List{enter}')

    await waitFor(() => {
      expect(onUpdateName).toHaveBeenLastCalledWith('Entered List')
    })
  })

  it('submits add-task form, calls onAddItem, and resets input', async () => {
    const onUpdateName = vi.fn()
    const onAddItem = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={onUpdateName}
        onAddItem={onAddItem}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const input = screen.getByPlaceholderText('Add your task...')
    const submit = screen.getByRole('button', { name: 'Add task' })

    await user.type(input, 'Task 1')
    expect(submit).not.toBeDisabled()

    await user.click(submit)

    expect(onAddItem).toHaveBeenLastCalledWith('Task 1')
    expect(input).toHaveValue('')
  })

  it('disables add-task submit when name is empty/whitespace', async () => {
    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={() => {}}
        onAddItem={() => {}}
        onDeleteList={() => {}}
      />,
    )

    const user = userEvent.setup()
    const input = screen.getByPlaceholderText('Add your task...')
    const submit = screen.getByRole('button', { name: 'Add task' })

    expect(submit).toBeDisabled()

    await user.type(input, '   ')
    expect(submit).toBeDisabled()
  })

  it('calls onDeleteList when delete button is clicked', async () => {
    const onDeleteList = vi.fn()

    renderWithProviders(
      <TodoListHeader
        name="My List"
        onUpdateName={() => {}}
        onAddItem={() => {}}
        onDeleteList={onDeleteList}
      />,
    )

    const user = userEvent.setup()
    const deleteButton = screen.getByRole('button', { name: 'Delete list' })
    await user.click(deleteButton)

    expect(onDeleteList).toHaveBeenCalledTimes(1)
  })
})

