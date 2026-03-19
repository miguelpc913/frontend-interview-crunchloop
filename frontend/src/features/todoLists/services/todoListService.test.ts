import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'

import {
  deleteTodoList,
  getAllTodoItems,
  getTodoItemById,
  deleteTodoItem,
} from './todoListService'
import { server } from '@/test/server'

describe('todoListService', () => {
  it('deleteTodoList sends DELETE', async () => {
    await deleteTodoList(1)
  })

  it('getAllTodoItems returns items', async () => {
    const items = await getAllTodoItems(1)
    expect(Array.isArray(items)).toBe(true)
  })

  it('getTodoItemById returns an item', async () => {
    const item = await getTodoItemById(1, 1)
    expect(item).toHaveProperty('id', 1)
    expect(item).toHaveProperty('name', 'Task A')
  })

  it('deleteTodoItem sends DELETE', async () => {
    await deleteTodoItem(1, 1)
  })

  it('throws a readable error when API responds with non-ok status', async () => {
    server.use(
      http.get('*/api/todo-lists/999/todo-items/999', () =>
        HttpResponse.json({ message: 'Task not found' }, { status: 404 }),
      ),
    )

    await expect(getTodoItemById(999, 999)).rejects.toThrow('Task not found')
  })
})
