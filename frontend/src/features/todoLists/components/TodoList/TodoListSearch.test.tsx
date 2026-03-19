import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import { TodoListSearch } from './TodoListSearch'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

describe('TodoListSearch', () => {
  it('renders the initial value and placeholder', () => {
    function Wrapper() {
      const [value] = useState('hello')
      return <TodoListSearch value={value} onChange={() => {}} />
    }

    renderWithProviders(<Wrapper />)

    expect(screen.getByPlaceholderText('Search in this list...')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('calls onChange with typed value', async () => {
    const onChangeSpy = vi.fn()

    function Wrapper() {
      const [value, setValue] = useState('')
      return (
        <TodoListSearch
          value={value}
          onChange={(next) => {
            onChangeSpy(next)
            setValue(next)
          }}
        />
      )
    }

    renderWithProviders(<Wrapper />)

    const user = userEvent.setup()
    const input = screen.getByRole('textbox')

    await user.type(input, 'abc')

    expect(onChangeSpy).toHaveBeenLastCalledWith('abc')
  })
})

